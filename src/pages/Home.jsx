import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Shield, Heart } from 'lucide-react';

const Home = () => {
    return (
        <div className="animate-fade-in">
            <section style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Your Safe Space for <span style={{ color: 'var(--primary)' }}>Mental Wellness</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    MindMate is here to listen, support, and guide you through your student journey without judgment.
                </p>
                <Link to="/chat" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.8rem 2rem', textDecoration: 'none' }}>
                    Start Chatting Now
                </Link>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <FeatureCard
                    icon={<MessageCircle size={32} color="var(--primary)" />}
                    title="Empathetic AI Chat"
                    description="Express yourself freely. Our AI understands your emotions and responds with care."
                />
                <FeatureCard
                    icon={<Shield size={32} color="var(--success)" />}
                    title="Private & Secure"
                    description="Your conversations are private. We don't store personal data. This is a safe space."
                />
                <FeatureCard
                    icon={<Heart size={32} color="var(--secondary)" />}
                    title="Self-Care Tips"
                    description="Discover simple relaxation techniques and daily wellness tips tailored for students."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ marginBottom: '1rem', background: 'var(--background)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            {icon}
        </div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
);

export default Home;
