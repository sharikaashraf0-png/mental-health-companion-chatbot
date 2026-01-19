
import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

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

export const getGroqResponse = async (history, message) => {
    if (!API_KEY) {
        return {
            text: "I'm having trouble connecting (API Key missing). Please check settings!",
            mood: 'neutral'
        };
    }

    try {
        const messages = [
            { role: "system", content: SYSTEM_INSTRUCTION }
        ];

        // Format history
        history.forEach(msg => {
            if (!msg.text || !msg.text.trim()) return;
            const role = msg.sender === 'user' ? 'user' : 'assistant';
            messages.push({ role, content: msg.text });
        });

        // Add current user message
        messages.push({ role: "user", content: message });

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile", // Latest supported model
            temperature: 0.7,
            max_tokens: 1024,
        });

        const text = completion.choices[0]?.message?.content || "I'm not sure what to say.";

        // Simple sentiment tagging for the UI
        let mood = 'neutral';
        const lowerText = text.toLowerCase();
        if (lowerText.includes('sorry') || lowerText.includes('tough') || lowerText.includes('here for you')) mood = 'empathetic';
        if (lowerText.includes('great') || lowerText.includes('proud') || lowerText.includes('wonderful')) mood = 'positive';

        return { text, mood };

    } catch (error) {
        console.error("Groq API Error:", error);
        return {
            text: "I'm having a little trouble thinking clearly right now. Please try again in a moment.",
            mood: 'neutral'
        };
    }
};
