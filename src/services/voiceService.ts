
/**
 * Service to transcribe audio using Groq Whisper API.
 * This bypasses browser limitations in PWA mode by sending actual audio data to the cloud.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

/**
 * Finds a valid Groq API Key from the comma-separated string
 */
const getGroqKey = (apiKeys: string): string | null => {
    if (!apiKeys) return null;
    const keys = apiKeys.split(',');
    return keys.find(k => k.trim().startsWith('gsk_'))?.trim() || null;
};

/**
 * Transcribes an audio blob to text using Groq Whisper
 */
export const transcribeAudioWithGroq = async (audioBlob: Blob, apiKeys: string): Promise<string> => {
    const apiKey = getGroqKey(apiKeys);

    if (!apiKey) {
        throw new Error("Groq API Key (gsk_...) not found. Please add it to your configuration.");
    }

    // Debug: Log Blob details
    console.log("Transcribing audio...", audioBlob.type, audioBlob.size);

    const formData = new FormData();
    // Groq requires 'file' and 'model'
    // We strictly append filename 'audio.webm' (or wav) so Groq knows format
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'id'); // Optimize for Indonesian
    formData.append('response_format', 'json');

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                // Do NOT set 'Content-Type': 'multipart/form-data' manually, 
                // fetch does it automatically with boundary when using FormData
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq Whisper API Error:", errorText);
            throw new Error(`Groq API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.text || "";

    } catch (error) {
        console.error("Transcription failed:", error);
        throw error;
    }
};
