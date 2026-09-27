import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10" style={{ background: 'rgba(15, 12, 8, 0.97)', backdropFilter: 'blur(12px)' }}>
      <div style={{ paddingLeft: '40px', paddingRight: '40px' }}>
        <div className="flex items-center justify-between h-16">

          {/* LEFT: Logo + Analyze link */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200"
                style={{ background: 'linear-gradient(135deg, #c4893a 0%, #5b4a2c 100%)', boxShadow: '0 4px 14px rgba(196,137,58,0.35)' }}
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span
                className="text-lg font-bold"
                style={{
                  background: 'linear-gradient(90deg, #f5d78e 0%, #e8a84a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.01em',
                }}
              >SkillGap AI</span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-white/15" />

            {/* Analyze link — right next to logo */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={
                  isActive('/')
                    ? { background: 'rgba(196,137,58,0.18)', color: '#f5d78e' }
                    : { color: '#94a3b8' }
                }
                onMouseEnter={e => { if (!isActive('/')) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; } }}
                onMouseLeave={e => { if (!isActive('/')) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; } }}
              >
                Analyze
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={
                    isActive('/dashboard')
                      ? { background: 'rgba(196,137,58,0.18)', color: '#f5d78e' }
                      : { color: '#94a3b8' }
                  }
                  onMouseEnter={e => { if (!isActive('/dashboard')) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; } }}
                  onMouseLeave={e => { if (!isActive('/dashboard')) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT: New Analysis btn + Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* New Analysis button — always visible */}
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #c4893a 0%, #5b4a2c 100%)',
                color: '#fff',
                boxShadow: '0 2px 12px rgba(196,137,58,0.3)',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #c4893a 0%, #5b4a2c 100%)' }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 max-w-[120px] truncate">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm text-white font-medium bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 rounded-xl transition-all duration-200">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 space-y-1 animate-fade-in">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10">Analyze</Link>
            {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10">Dashboard</Link>}
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium" style={{ color: '#f5d78e' }}>+ New Analysis</Link>
            {user ? (
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm hover:bg-white/10" style={{ color: '#e8c48a' }}>Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
