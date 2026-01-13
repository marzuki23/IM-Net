import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartSupportResponse = async (prompt: string, userContext: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are a helpful customer support assistant for a WiFi ISP called WiFiNet. 
      The user context is: ${userContext}.
      User asks: ${prompt}
      Please provide a friendly and helpful response in Indonesian.`,
            config: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Maaf, saya sedang mengalami kendala teknis. Silakan coba lagi nanti.";
    }
};