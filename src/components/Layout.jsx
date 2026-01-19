import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Heart, BarChart2, Info, Home } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active-link' : '';

    return (
        <>
            <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Heart fill="var(--primary)" size={24} />
                        <span>MindMate</span>
                    </Link>

                    <nav style={{ display: 'flex', gap: '20px' }}>
                        <NavLink to="/" icon={<Home size={20} />} label="Home" active={location.pathname === '/'} />
                        <NavLink to="/chat" icon={<MessageCircle size={20} />} label="Chat" active={location.pathname === '/chat'} />
                        <NavLink to="/insights" icon={<BarChart2 size={20} />} label="Insights" active={location.pathname === '/insights'} />
                        <NavLink to="/self-care" icon={<Heart size={20} />} label="Self Care" active={location.pathname === '/self-care'} />
                        <NavLink to="/about" icon={<Info size={20} />} label="About" active={location.pathname === '/about'} />
                    </nav>
                </div>
            </header>

            <main style={{ flex: 1, padding: '2rem 0' }}>
                <div className="container">
                    {children}
                </div>
            </main>

            <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem 0', marginTop: 'auto' }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <p>© 2024 MindMate. Not a replacement for professional help.</p>
                    <p>If you are in crisis, please contact emergency services.</p>
                </div>
            </footer>
        </>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: active ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: active ? 600 : 400,
            transition: 'color 0.2s'
        }}
    >
        {icon}
        <span className="nav-label">{label}</span>
    </Link>
);

export default Layout;
