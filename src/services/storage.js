const STORAGE_KEY = 'mindmate_chat_history';

export const saveMessages = (messages) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
        console.error("Failed to save messages:", error);
    }
};

export const getMessages = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Failed to load messages:", error);
        return null;
    }
};

export const calculateInsights = () => {
    const messages = getMessages() || [];

    // Filter for bot messages to analyze the "vibe" of the conversation based on bot's reaction (since bot tags mood)
    // OR analyse user messages if we had sentiment analysis on them stored.
    // Our Chat.jsx stores 'mood' on bot messages based on user input sentiment.
    // Filter for USER messages to analyze the user's actual mood
    const allUserMessages = messages.filter(m => m.sender === 'user');

    if (allUserMessages.length === 0) {
        return {
            mood: "Neutral",
            trend: "No data yet",
            message: "Start chatting to see your insights!",
            counts: { positive: 0, negative: 0, neutral: 0 }
        };
    }

    // Only look at the last 5 messages for "Current Vibe" so it changes faster
    const recentCountMessages = allUserMessages.slice(-5);

    const counts = {
        positive: recentCountMessages.filter(m => m.mood === 'positive').length,
        negative: recentCountMessages.filter(m => m.mood === 'negative').length,
        neutral: recentCountMessages.filter(m => m.mood === 'neutral' || !m.mood).length
    };

    // Default to Neutral
    let mood = "Neutral";

    // If there is ANY strong signal, prioritize it over neutral
    if (counts.positive > 0 || counts.negative > 0) {
        if (counts.positive >= counts.negative) mood = "Positive";
        else mood = "Stressed/Low";
    }

    // Simple trend logic
    const recentMessages = allUserMessages.slice(-5);
    const recentNegatives = recentMessages.filter(m => m.mood === 'negative').length;

    let trend = "Stable";
    if (recentNegatives > 2) trend = "Needs Attention";
    if (counts.positive > counts.negative * 2) trend = "Thriving";

    // Dynamic advice
    const advice = [
        "Remember to take breaks.",
        "You're doing better than you think.",
        "Consistency is key to mental wellness.",
        "Don't forget to hydrate!",
        "It's okay to ask for help."
    ];
    const randomAdvice = advice[Math.floor(Math.random() * advice.length)];

    return {
        mood,
        trend,
        message: randomAdvice,
        counts
    };
};

export const getWeeklyInsights = () => {
    const messages = getMessages() || [];
    const userMessages = messages.filter(m => m.sender === 'user');

    // Group by day (Mon, Tue, etc.)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyData = {}; // { "Monday": { positive: 0, negative: 0, neutral: 0 } }

    // Initialize last 7 days to 0 to show empty days too
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];
        weeklyData[dayName] = { positive: 0, negative: 0, neutral: 0, name: dayName, date: d };
    }

    userMessages.forEach(msg => {
        const date = new Date(msg.id);
        const dayName = days[date.getDay()];

        // Only count if it's within the generated last 7 days window (simple check)
        if (weeklyData[dayName]) {
            if (msg.mood === 'positive') weeklyData[dayName].positive++;
            else if (msg.mood === 'negative') weeklyData[dayName].negative++;
            else weeklyData[dayName].neutral++;
        }
    });

    // Convert to array and determine dominant mood
    return Object.values(weeklyData).map(day => {
        let dominant = 'Neutral';
        if (day.positive > day.negative && day.positive > day.neutral) dominant = 'Positive';
        if (day.negative > day.positive && day.negative > day.neutral) dominant = 'Stressed';

        return {
            day: day.name,
            mood: dominant,
            counts: day // Keep raw counts for charts
        };
    });
};
