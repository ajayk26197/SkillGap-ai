import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * This page is the OAuth redirect landing point.
 * Backend redirects here after Google login with user data in URL params.
 * It stores the token in context/localStorage and redirects to dashboard.
 */
export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      navigate('/login?error=google_failed', { replace: true });
      return;
    }

    const userData = {
      _id: searchParams.get('id'),
      name: searchParams.get('name'),
      email: searchParams.get('email'),
      avatar: searchParams.get('avatar') || null,
      token,
    };

    login(userData);
    navigate('/dashboard', { replace: true });
  }, []);

  return (
    <div className="min-h-screen bg-[#131314] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-slate-400 text-sm">Signing you in with Google...</p>
      </div>
    </div>
  );
}
