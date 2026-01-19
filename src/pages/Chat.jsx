import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, RefreshCw } from 'lucide-react';
import { getGroqResponse } from '../services/groq';
import { saveMessages, getMessages } from '../services/storage';
import Sentiment from 'sentiment';

const Chat = () => {
    // Initialize state from storage if available, otherwise use default
    const [messages, setMessages] = useState(() => {
        const saved = getMessages();
        return saved || [{ id: 1, text: "Hi there! I'm MindMate. How are you feeling today?", sender: 'bot', mood: 'neutral' }];
    });
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const sentiment = new Sentiment();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Save to storage whenever messages change
    useEffect(() => {
        saveMessages(messages);
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        setInput('');

        // Analyze sentiment
        const result = sentiment.analyze(userText);
        let userMood = 'neutral';
        if (result.score > 0) userMood = 'positive';
        if (result.score < 0) userMood = 'negative';

        // add user message with mood
        const newMessages = [...messages, {
            id: Date.now(),
            text: userText,
            sender: 'user',
            mood: userMood
        }];
        setMessages(newMessages);
        setIsTyping(true);

        try {
            // Filter history for context
            const minDelayPromise = new Promise(resolve => setTimeout(resolve, 600));

            const [response] = await Promise.all([
                getGroqResponse(messages, userText),
                minDelayPromise
            ]);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: response.text,
                sender: 'bot',
                mood: response.mood
            }]);
        } catch (error) {
            console.error("Chat Error", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `I'm having trouble connecting. Error: ${error.message || "Unknown Error"}`,
                sender: 'bot',
                mood: 'negative'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // ... (rest of render)
    return (
        <div className="card animate-fade-in" style={{ height: '70vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            {/* ... header ... */}
            <div style={{ background: 'var(--surface)', padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Bot size={24} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>MindMate</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Online</span>
                </div>
                <button onClick={() => setMessages([{ id: Date.now(), text: "Hi there! I'm MindMate. How are you feeling today?", sender: 'bot', mood: 'neutral' }])} style={{ marginLeft: 'auto', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} title="Reset Chat">
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>New Chat</span>
                    <RefreshCw size={18} />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        gap: '10px'
                    }}>
                        {msg.sender === 'bot' && (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Bot size={18} color="var(--text-muted)" />
                            </div>
                        )}

                        <div style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '16px',
                            borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
                            background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                            color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                            boxShadow: msg.sender === 'bot' ? 'var(--shadow-sm)' : 'none',
                            border: msg.sender === 'bot' ? '1px solid var(--border)' : 'none'
                        }}>
                            {msg.text}
                        </div>

                        {msg.sender === 'user' && (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <User size={18} color="white" />
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}></div>
                        <div style={{ padding: '12px 16px', background: 'white', borderRadius: '16px', borderTopLeftRadius: '4px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div>
                                <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thinking... (might take a moment)</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: '1rem', background: 'white', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    style={{
                        flex: 1,
                        padding: '0.8rem 1rem',
                        borderRadius: '24px',
                        border: '1px solid var(--border)',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <button type="submit" disabled={!input.trim()} className="btn btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default Chat;
