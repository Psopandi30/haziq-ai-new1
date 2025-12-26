
import { useState, useRef } from 'react';
import { transcribeAudioWithGroq } from '../services/voiceService';

export const useVoiceTyping = (onTranscript: (text: string) => void, apiKeys: string) => {
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const toggleListening = async () => {
        // STOP RECORDING
        if (isListening) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
                setIsListening(false);
                setIsLoading(true);
            }
            return;
        }

        // START RECORDING
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());

                try {
                    const transcript = await transcribeAudioWithGroq(audioBlob, apiKeys);
                    if (transcript && transcript.trim()) {
                        onTranscript(transcript);
                    }
                } catch (error: any) {
                    console.error(error);
                    alert("Gagal memproses suara: " + error.message);
                } finally {
                    setIsLoading(false);
                }
            };

            mediaRecorder.start();
            setIsListening(true);

        } catch (err) {
            console.error("Microphone Access Error:", err);
            alert("Gagal mengakses mikrofon. Pastikan izin Mikofon diberikan.");
            setIsListening(false);
        }
    };

    return { isListening, isLoading, toggleListening };
};
