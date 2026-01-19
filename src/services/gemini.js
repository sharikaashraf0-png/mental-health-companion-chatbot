
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

const SYSTEM_INSTRUCTION = `You are MindMate, a compassionate and supportive mental health companion for students. 
Your goal is to provide a safe, non-judgmental space for students to express their feelings.
Key traits: Empathetic, calm, encouraging, good listener.
Guidelines:
1. Validate feelings: Acknowledge what the user is going through.
2. Offer support: Suggest simple, actionable coping strategies.
3. Safety First: If the user mentions self-harm, suicide, or severe distress, urge them to seek professional help.
4. Keep it concise: 2-3 sentences usually.
5. No Medical Advice: You are a companion, not a doctor.
`;

export const getGeminiResponse = async (history, message) => {
    if (!API_KEY || !genAI) {
        return {
            text: "I'm having trouble connecting (API Key missing). Please check your .env settings!",
            mood: 'neutral'
        };
    }

    try {
        // Use a model that is stable. gemini-1.5-flash is fast and good for chat.
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // Simple sentiment tagging for the UI
        let mood = 'neutral';
        const lowerText = text.toLowerCase();
        if (lowerText.includes('sorry') || lowerText.includes('tough') || lowerText.includes('here for you')) mood = 'empathetic';
        if (lowerText.includes('great') || lowerText.includes('proud') || lowerText.includes('wonderful')) mood = 'positive';

        return { text, mood };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            text: "I'm having a little trouble thinking clearly right now. Please try again in a moment.",
            mood: 'neutral'
        };
    }
};
