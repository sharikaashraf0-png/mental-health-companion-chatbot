import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';

const About = () => {
    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>About MindMate</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Our Mission</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                    Student life is challenging. Between exams, social pressure, and planning for the future, it's easy to feel overwhelmed.
                    <strong>MindMate</strong> was created to be a always-available companion that listens without judgement.
                </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <AlertTriangle color="var(--danger)" size={32} style={{ flexShrink: 0 }} />
                    <div>
                        <h3 style={{ marginTop: 0 }}>Important Disclaimer</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            MindMate is an AI chatbot and <strong>does not replace professional mental health care</strong>.
                            We cannot diagnose conditions or prescribe medications.
                        </p>
                        <p>
                            If you are experiencing severe distress, suicidal thoughts, or a crisis, please:
                        </p>
                        <ul style={{ fontWeight: 'bold' }}>
                            <li>Call Emergency Services (911 in US)</li>
                            <li>Call 988 Suicide & Crisis Lifeline</li>
                            <li>Go to the nearest emergency room</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>Built with ❤️ using React & AI Sentiment Analysis.</p>
            </div>
        </div>
    );
};

export default About;
