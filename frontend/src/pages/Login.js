import React from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

// In production (Vercel): REACT_APP_API_URL=/api → same domain, use relative path
// In local dev: REACT_APP_API_URL=http://localhost:5001/api → extract base
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const BACKEND_URL = API_URL.startsWith('http') ? API_URL.replace('/api', '') : '';

export default function Login() {
  const [searchParams] = useSearchParams();
  const googleFailed = searchParams.get('error') === 'google_failed';

  return (
    <div className="min-h-screen bg-[#131314] flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(196,137,58,0.08)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(91,74,44,0.1)' }} />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #c4893a 0%, #5b4a2c 100%)', boxShadow: '0 4px 14px rgba(196,137,58,0.35)' }}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(90deg, #e8c48a 0%, #c4893a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'brightness(1.3)',
              }}
            >SkillGap AI</span>
          </Link>
          <p className="text-slate-400 text-sm mt-3">Sign in to access your dashboard</p>
        </div>

        <div className="card flex flex-col items-center gap-6 py-10 px-8">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center"
            style={{ background: 'rgba(196,137,58,0.12)' }}
          >
            <svg className="w-8 h-8" style={{ color: '#c4893a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm">Use your Google account to continue</p>
          </div>

          {/* Google error */}
          {googleFailed && (
            <div className="w-full p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
              Google sign-in failed. Please try again.
            </div>
          )}

          {/* Google Sign In Button */}
          <a
            id="google-oauth-btn"
            href={`${BACKEND_URL}/api/auth/google`}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm border border-gray-200 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <p className="text-xs text-slate-600 text-center leading-relaxed">
            By continuing, you agree to our{' '}
            <span className="text-slate-500 cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-slate-500 cursor-pointer hover:text-white transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
