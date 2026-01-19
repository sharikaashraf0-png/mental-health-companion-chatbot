import React from 'react';
import { Smile, Frown, Meh } from 'lucide-react';
import { calculateInsights, getWeeklyInsights } from '../services/storage';

const Insights = () => {
    const stats = calculateInsights();
    const weeklyStats = getWeeklyInsights();

    return (
        <div className="animate-fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Mood Insights</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Current Vibe</h3>
                    <div style={{ margin: '2rem 0' }}>
                        {stats.mood === 'Positive' ? <Smile size={64} color="var(--success)" /> :
                            stats.mood === 'Stressed/Low' ? <Frown size={64} color="var(--warning)" /> :
                                <Meh size={64} color="var(--info)" />}
                    </div>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.mood}</p>
                    <p style={{ color: 'var(--text-muted)' }}>Based on your recent chats.</p>
                </div>

                <div className="card">
                    <h3>Weekly Trends</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Last 7 Days</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {weeklyStats.map(day => (
                            <li key={day.day} style={{ padding: '0.8rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ width: '80px', fontWeight: '500' }}>{day.day}</span>

                                <div style={{ flex: 1, margin: '0 1rem', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: day.counts.positive + day.counts.negative + day.counts.neutral > 0 ? '100%' : '0%',
                                        background: day.mood === 'Positive' ? 'var(--success)' : day.mood === 'Stressed' ? 'var(--warning)' : 'var(--info)',
                                        opacity: day.counts.positive + day.counts.negative + day.counts.neutral > 0 ? 1 : 0.3
                                    }}></div>
                                </div>

                                <span style={{
                                    width: '80px',
                                    textAlign: 'right',
                                    color: day.mood === 'Positive' ? 'var(--success)' : day.mood === 'Stressed' ? 'var(--warning)' : 'var(--info)'
                                }}>
                                    {day.mood}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
                    <h3 style={{ color: 'white' }}>Daily Advice</h3>
                    <p style={{ fontSize: '1.2rem', margin: '2rem 0', fontStyle: 'italic' }}>"{stats.message}"</p>
                    <div style={{ opacity: 0.8 }}>
                        Remember, progress isn't linear.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
