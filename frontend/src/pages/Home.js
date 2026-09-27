import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import ScoreCircle from '../components/Dashboard/ScoreCircle';
import ActionPlan from '../components/Dashboard/ActionPlan';
import SkillPills from '../components/Dashboard/SkillPills';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Home() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!file) return setError('Please upload your resume first.');
    if (jobDescription.trim().length < 10) return setError('Please enter a job description (at least 10 characters).');
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const { data } = await API.post('/match/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#131314]">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(196,137,58,0.08)' }} />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(91,74,44,0.1)' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative py-12" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight whitespace-nowrap">
            Know Your <span className="gradient-text">Skill Gap</span> in Seconds
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload your resume and paste any job description. Our AI instantly scores your match,
            identifies missing skills, and gives you a personal action plan.
          </p>
        </div>

        {!result ? (
          /* Input Form */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
            {/* Left: Job Description */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(196,137,58,0.2)' }}>
                  <svg className="w-4 h-4" style={{ color: '#c4893a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="font-semibold text-white">Job Description</h2>
              </div>
              <textarea
                id="job-description"
                className="input-field resize-none"
                rows={12}
                placeholder="Paste the full job description here...&#10;&#10;Example: We are looking for a Senior React Developer with 3+ years of experience in TypeScript, Node.js, REST APIs..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-600">{jobDescription.length} characters</span>
                {jobDescription.length > 0 && jobDescription.length < 10 && (
                  <span className="text-xs text-amber-500">Add at least {10 - jobDescription.length} more characters</span>
                )}
              </div>
            </div>

            {/* Right: File Upload */}
            <div className="card flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(196,137,58,0.2)' }}>
                  <svg className="w-4 h-4" style={{ color: '#c4893a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="font-semibold text-white">Your Resume</h2>
              </div>
              <FileUpload onFileSelect={setFile} selectedFile={file} />

              <div className="mt-4 p-3 rounded-xl bg-white/3 border border-white/5">
                <p className="text-xs text-slate-500 leading-relaxed">
                  🔒 Your file is processed securely in memory and never stored permanently without your consent.
                  OCR is used for scanned image resumes.
                </p>
              </div>

              <div className="mt-auto pt-5">
                {error && (
                  <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                    {error}
                  </div>
                )}
                <button
                  id="analyze-btn"
                  onClick={handleAnalyze}
                  disabled={loading || !file || jobDescription.trim().length < 10}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Analyze My Resume
                    </>
                  )}
                </button>
                {!user && (
                  <p className="text-center text-xs text-slate-600 mt-3">
                    <Link to="/login" className="hover:underline" style={{ color: '#e8c48a' }}>Sign in</Link> to save your results to Dashboard
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="animate-slide-up space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Analysis Results</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {result.fileName}
                  {result.saved && <span className="ml-2 text-emerald-400 text-xs">· Saved to Dashboard</span>}
                </p>
              </div>
              <button onClick={handleReset} className="btn-secondary text-sm">
                ↩ New Analysis
              </button>
            </div>

            {/* Score + Summary row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card flex flex-col items-center justify-center md:col-span-1">
                <p className="text-slate-400 text-sm font-medium mb-4">Match Score</p>
                <ScoreCircle score={result.matchScore} />
              </div>
              <div className="card md:col-span-2 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Matched</p>
                    <p className="text-white font-bold text-2xl">{result.matchedSkills?.length || 0} <span className="text-slate-400 text-sm font-normal">skills</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <span className="text-3xl">🚀</span>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Bonus Skills</p>
                    <p className="text-white font-bold text-2xl">{result.bonusSkills?.length || 0} <span className="text-slate-400 text-sm font-normal">extra</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Missing</p>
                    <p className="text-white font-bold text-2xl">{result.missingSkills?.length || 0} <span className="text-slate-400 text-sm font-normal">gaps</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <SkillPills
                matchedSkills={result.matchedSkills}
                missingSkills={result.missingSkills}
                bonusSkills={result.bonusSkills}
              />
            </div>

            {/* Action Plan */}
            {result.actionPlan && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="font-semibold text-white">Action Plan</h3>
                </div>
                <ActionPlan markdown={result.actionPlan} />
              </div>
            )}
          </div>
        )}

        {/* Features row */}
        {!result && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 animate-fade-in">
            {[
              { icon: '🔍', title: 'ATS Analysis', desc: 'Deep keyword matching against real ATS systems' },
              { icon: '🤖', title: 'GPT-4o-mini AI', desc: 'Semantic understanding beyond simple keyword matching' },
              { icon: '📊', title: 'Skill Gap Report', desc: 'Precise list of what you have and what you need' },
            ].map((f) => (
              <div key={f.title} className="bg-[#24252b] border border-white/10 rounded-xl p-4 text-center shadow-lg">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-white font-medium text-sm">{f.title}</p>
                <p className="text-slate-400 text-xs mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
