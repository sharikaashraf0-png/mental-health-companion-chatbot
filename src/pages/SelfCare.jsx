import React, { useState } from 'react';
import { Wind, Sun, BookOpen, Music, ChevronDown, ChevronUp } from 'lucide-react';

const SelfCare = () => {
    return (
        <div className="animate-fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Self-Care Toolbox</h2>
            <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--text-muted)' }}>
                Simple, effective techniques to help you ground yourself and find calm in the chaos.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <ExpandableCard
                    icon={<Wind size={24} color="var(--info)" />}
                    title="4-7-8 Breathing"
                    content={
                        <ol style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                            <li>Close your mouth and inhale quietly through your nose to a mental count of <strong>4</strong>.</li>
                            <li>Hold your breath for a count of <strong>7</strong>.</li>
                            <li>Exhale completely through your mouth, making a whoosh sound to a count of <strong>8</strong>.</li>
                            <li>Repeat the cycle three more times for a total of four breaths.</li>
                        </ol>
                    }
                />

                <ExpandableCard
                    icon={<Sun size={24} color="var(--warning)" />}
                    title="5-4-3-2-1 Grounding"
                    content={
                        <div style={{ lineHeight: '1.8' }}>
                            <p>Look around and acknowledge:</p>
                            <ul style={{ paddingLeft: '1.5rem' }}>
                                <li><strong>5</strong> things you see</li>
                                <li><strong>4</strong> things you can touch</li>
                                <li><strong>3</strong> things you hear</li>
                                <li><strong>2</strong> things you can smell</li>
                                <li><strong>1</strong> thing you can taste</li>
                            </ul>
                        </div>
                    }
                />

                <ExpandableCard
                    icon={<BookOpen size={24} color="var(--secondary)" />}
                    title="Study Breaks (Pomodoro)"
                    content={
                        <p style={{ lineHeight: '1.6' }}>
                            Study for <strong>25 minutes</strong>, then take a <strong>5 minute</strong> break. After 4 sessions, take a longer 15-30 minute break. During breaks, move away from screens and stretch!
                        </p>
                    }
                />

                <ExpandableCard
                    icon={<Music size={24} color="var(--success)" />}
                    title="Calming Playlist"
                    content={
                        <p>
                            Listening to lo-fi beats, classical music, or nature sounds (rain, forest) can lower blood pressure and reduce stress hormones. Try searching for "Binaural Beats" for focus.
                        </p>
                    }
                />
            </div>
        </div>
    );
};

const ExpandableCard = ({ icon, title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onClick={() => setIsOpen(!isOpen)}>
            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isOpen ? 'var(--background)' : 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {icon}
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {isOpen && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'white' }} className="animate-fade-in">
                    {content}
                </div>
            )}
        </div>
    );
};

export default SelfCare;
