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
  webhookUrl: string,
  user: UserData | null,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    // Construct the payload.
    // We send 'chatInput' which is commonly used by n8n AI nodes, 
    // as well as 'message', 'history', and 'user' context.
    const payload = {
      chatInput: prompt,
      message: prompt,
      user: user ? {
        name: user.name,
        full_name: user.full_name,
        nim: user.nim,
        prodi: user.prodi,
        position: user.position || 'Mahasiswa'
      } : null,
      history: history,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook connection failed: ${response.status} ${response.statusText}`);
    }

    // Read the response as text first to handle empty bodies or non-JSON responses
    const responseText = await response.text();

    if (!responseText) {
      console.warn("Received empty response from n8n.");
      return "Maaf, server memberikan respon kosong.";
    }

    try {
      // Try to parse as JSON
      const data = JSON.parse(responseText);

      // Handle various JSON response formats
      if (data.output && typeof data.output === 'string') return data.output;
      if (data.text && typeof data.text === 'string') return data.text;
      if (data.response && typeof data.response === 'string') return data.response;
      if (data.message && typeof data.message === 'string') return data.message;

      // Handle array response (common in n8n)
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        if (firstItem.output && typeof firstItem.output === 'string') return firstItem.output;
        if (firstItem.text && typeof firstItem.text === 'string') return firstItem.text;
        if (firstItem.response && typeof firstItem.response === 'string') return firstItem.response;
        // If the array item itself is a string
        if (typeof firstItem === 'string') return firstItem;
      }

      // If data is a simple string
      if (typeof data === 'string') return data;

      // Fallback: if we can't find a specific field, return stringified data or default message
      console.warn("Unknown JSON structure:", data);
      return JSON.stringify(data);

    } catch (parseError) {
      // If parsing fails, it's likely plain text (e.g., "Webhook received"). Return it directly.
      return responseText;
    }

  } catch (error) {
    console.error("N8N Service Error:", error);
    // Return a friendly error message to the UI
    return "Maaf, terjadi kesalahan saat menghubungkan ke server.";
  }
};
