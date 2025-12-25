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
    // UPDATED: Added multiple backup keys to resolve Rate Limit issues
    // UPDATED: Added DeepSeek key
    const hardcodedKeys = "AIzaSyCCO-rUujlkWWhNKxOL7dWRO8UJj_amcC8,AIzaSyDvZA3qq0ifUc-eZpDtI1cS1X6fPB110wk,AIzaSyA7ylI7vt5AOENYZNQmxC2wCurTnUNkTEg,AIzaSyB0UpOd0gCbUsJ1LRGXRaNfOReAlO0Q6zw,AIzaSyA74ZyjeaNykKPx4uUhEyfl0CDwr6FC9So,AIzaSyAZjiomCv0Ziiz1RNJTgHSD0G6s5EY-Pus,AIzaSyDmyO66ocnUOJctvjtuIJuKVIR-xqn7ONI,AIzaSyDAmk4ihMlfTCoZRRurKCZ_AA8DArQWIDs,sk-2272ab34aee443808548aeba9eb59408";

    // Combine newly provided keys with any existing configuration to ensure we always have valid keys
    const keysToUse = hardcodedKeys + (apiKeys ? "," + apiKeys : "");
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
      } else if (apiKey.startsWith('sk-')) {
        // Assume DeepSeek (or generic OpenAI compatible) for other sk- keys
        return await callDeepSeek(apiKey, historyGeneric);
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
  // UPDATED: Try fallback models if specific version is not found (404)
  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];

  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (!response.ok) {
        // If 404 (Model not found), continue to try next model
        if (response.status === 404) {
          console.warn(`Model ${model} not found, retrying...`);
          continue;
        }
        const errorText = await response.text();
        throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e: any) {
      lastError = e;
      // Throw immediately to let Key Rotation handle it (unless it was a handled 404 loop which wouldn't be here)
      throw e;
    }
  }
  throw lastError || new Error('No compatible Gemini model found');
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

// DeepSeek Implementation
async function callDeepSeek(apiKey: string, messages: any[]) {
  const url = 'https://api.deepseek.com/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: messages,
      model: "deepseek-chat"
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek Error: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
