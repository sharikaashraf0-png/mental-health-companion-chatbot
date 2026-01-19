
import Groq from "groq-sdk";

// Initialize Groq SDK with server-side API Key
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
});

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format" });
        }

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        // Return the full completion object or just the content
        // The frontend expects the structure, so let's check what we return.
        // We'll return the standard completion object.
        res.status(200).json(completion);

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
