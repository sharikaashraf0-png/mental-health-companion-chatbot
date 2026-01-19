
import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

let groq = null;
if (API_KEY) {
    groq = new Groq({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
    });
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

export const getGroqResponse = async (history, message) => {
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

        let completion;

        if (groq) {
            // Local Development: Use SDK directly
            console.log("Using Client-side SDK");
            completion = await groq.chat.completions.create({
                messages: messages,
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 1024,
            });
        } else {
            // Production: Use Netlify Function
            console.log("Using Netlify Function");
            const res = await fetch('/.netlify/functions/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });

            if (!res.ok) throw new Error(`API Error: ${await res.text()}`);
            completion = await res.json();
        }

        const text = completion.choices[0]?.message?.content || "I'm not sure what to say.";

        // Simple sentiment tagging for the UI
        let mood = 'neutral';
        const lowerText = text.toLowerCase();
        if (lowerText.includes('sorry') || lowerText.includes('tough') || lowerText.includes('here for you')) mood = 'empathetic';
        if (lowerText.includes('great') || lowerText.includes('proud') || lowerText.includes('wonderful')) mood = 'positive';

        return { text, mood };

    } catch (error) {
        console.error("Groq Service Error:", error);
        return {
            text: "I'm having a little trouble thinking clearly right now. Please try again in a moment.",
            mood: 'neutral'
        };
    }
};
