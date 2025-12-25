import { UserData } from '../types';

/**
 * Sends a message to the n8n Webhook.
 * 
 * @param prompt - The current user message.
 * @param webhookUrl - The N8N webhook URL (configurable from admin panel).
 * @param user - The current user data (optional).
 * @param history - The conversation history (formatted from App.tsx).
 * @returns The text response from the webhook.
 */
export const sendMessageToGemini = async (
  prompt: string,
  _webhookUrl: string, // Deprecated/Unused but kept for signature compatibility if needed, or better remove it
  apiKeys: string | undefined,
  _user: UserData | null,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    // We strictly use keys passed from configuration or env vars
    const hardcodedKeys = import.meta.env.VITE_GEMINI_API_KEYS || "";

    const keysToUse = (apiKeys && apiKeys.trim().length > 0) ? apiKeys : hardcodedKeys;
    const keys = keysToUse.split(',').map(k => k.trim()).filter(k => k);

    if (keys.length === 0) {
      return "Error: Tidak ada API Key yang tersedia. Hubungi admin.";
    }

    try {
      return await sendToGeminiDirectRotated(keys, prompt, history);
    } catch (directError: any) {
      console.error("Direct API failed:", directError);
      return `Gagal menghubungkan ke layanan AI: ${directError.message}`;
    }

    // REMOVED N8N FALLBACK COMPLETELY AS REQUESTED

  } catch (error: any) {
    console.error("Service Error:", error);
    return `Terjadi kesalahan sistem: ${error.message}`;
  }
};



/**
 * Helper function to call various AI APIs directly with Key Rotation
 */
async function sendToGeminiDirectRotated(
  keys: string[],
  prompt: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> {

  // Format generic history for non-Gemini providers if needed
  const historyGeneric = history.map(h => ({
    role: h.role === 'model' ? 'assistant' : 'user',
    content: h.parts[0].text
  }));
  historyGeneric.push({ role: 'user', content: prompt });

  // Gemini specific history
  const contentsGemini = [
    ...history,
    { role: 'user', parts: [{ text: prompt }] }
  ];

  let lastError = null;

  // Let's try Random to distribute load, but retry others on failure.
  // We will shuffle the keys to try them in random order.
  const shuffledKeys = keys.sort(() => Math.random() - 0.5);

  console.log(`[HaziqAI] Attempting ${shuffledKeys.length} API keys...`);

  for (const apiKey of shuffledKeys) {
    try {
      if (apiKey.startsWith('AIza')) {
        return await callGoogleGemini(apiKey, contentsGemini);
      } else if (apiKey.startsWith('hf_')) {
        return await callHuggingFace(apiKey, historyGeneric);
      } else if (apiKey.startsWith('gsk_')) {
        return await callGroq(apiKey, historyGeneric);
      } else if (apiKey.startsWith('sk-or-')) {
        return await callOpenRouter(apiKey, historyGeneric);
      } else {
        console.warn(`Unknown key format: ${apiKey.slice(0, 5)}...`);
        continue;
      }

    } catch (err: any) {
      console.warn(`Key ...${apiKey.slice(-5)} failed:`, err.message);
      lastError = err;
      // Continue to next key
    }
  }

  console.error("All API keys failed. Last error:", lastError);
  console.error("All API keys failed. Last error:", lastError);
  // Return the specific error message to help the user/admin debug
  return `Maaf, sistem sedang sibuk atau mengalami error: ${lastError?.message || "Koneksi gagal"}. Mohon coba lagi.`;
}

// --- Provider Implementations ---

async function callGoogleGemini(apiKey: string, contents: any[]) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text) return text;
  throw new Error('No text in Gemini response');
}

async function callHuggingFace(apiKey: string, messages: any[]) {
  // Using Meta Llama 3 8B Instruct
  const model = "meta-llama/Meta-Llama-3-8B-Instruct";

  // Attempt 1: Chat API (openai-compatible if supported by endpoint)
  const url = `https://api-inference.huggingface.co/models/${model}/v1/chat/completions`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Maaf, tidak ada respon dari Hugging Face.";
    }
  } catch (e) {
    console.warn("HF Chat API failed, trying legacy...", e);
  }

  // Fallback if the proper chat endpoint fails (some HF models don't support it fully via inference API yet)
  // We will just throw to rotate to next key (likely next provider)
  throw new Error("HF Chat API not available");
}

async function callGroq(apiKey: string, messages: any[]) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: messages,
      model: "llama-3.3-70b-versatile" // Updated to latest supported model
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq Error: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callOpenRouter(apiKey: string, messages: any[]) {
  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // 'HTTP-Referer': 'https://haziq-ai.app', 
      // 'X-Title': 'Haziq AI' 
    },
    body: JSON.stringify({
      messages: messages,
      model: "google/gemini-2.0-flash-exp:free" // Free high quality model
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter Error: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
