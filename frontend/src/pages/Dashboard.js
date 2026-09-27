import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScoreCircle from '../components/Dashboard/ScoreCircle';
import SkillPills from '../components/Dashboard/SkillPills';
import ActionPlan from '../components/Dashboard/ActionPlan';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function AnalysisCard({ analysis, onClick, isSelected }) {
  const score = analysis.matchScore;
  const scoreColor = score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';
  const scoreBg = score >= 75 ? 'bg-emerald-500/10 border-emerald-500/20' : score >= 50 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20';

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all duration-200 hover:bg-[#2c2d35] ${
        isSelected ? 'ring-2' : ''
      }`}
      style={{
        borderColor: isSelected ? '#c4893a' : undefined,
        boxShadow: isSelected ? '0 0 0 2px rgba(196,137,58,0.25)' : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{analysis.fileName}</p>
          <p className="text-slate-500 text-xs mt-0.5">{formatDate(analysis.createdAt)}</p>
        </div>
        <div className={`flex-shrink-0 px-3 py-1 rounded-full border ${scoreBg}`}>
          <span className={`text-sm font-bold ${scoreColor}`}>{score}%</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {analysis.matchedSkills?.length || 0} matched
        </div>
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          {analysis.missingSkills?.length || 0} missing
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/match/history');
        setAnalyses(data);
        if (data.length > 0) handleSelect(data[0]._id);
      } catch (err) {
        setError('Failed to load history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSelect = async (id) => {
    if (selected?._id === id) return;
    setDetailLoading(true);
    try {
      const { data } = await API.get(`/match/${id}`);
      setSelected(data);
    } catch {
      setError('Failed to load analysis details.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131314]">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(196,137,58,0.07)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(91,74,44,0.08)' }} />
      </div>

      <div className="relative py-10" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {analyses.length > 0
                ? `You have ${analyses.length} saved analysis ${analyses.length === 1 ? 'result' : 'results'}`
                : 'No analyses yet — start by uploading your resume'}
            </p>
          </div>
          <Link to="/" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 animate-spin" style={{ color: '#c4893a' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-slate-400 text-sm">Loading your analyses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="card text-center py-12">
            <p className="text-rose-400">{error}</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-2xl border border-white/10 flex items-center justify-center mb-4" style={{ background: 'rgba(196,137,58,0.1)' }}>
              <svg className="w-8 h-8" style={{ color: '#c4893a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No analyses yet</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              Upload your resume and a job description to get your first AI-powered skill gap analysis.
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              Start Your First Analysis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            {/* Left: History List */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1 mb-4">
                History ({analyses.length})
              </h2>
              {analyses.map((a) => (
                <AnalysisCard
                  key={a._id}
                  analysis={a}
                  onClick={() => handleSelect(a._id)}
                  isSelected={selected?._id === a._id}
                />
              ))}
            </div>

            {/* Right: Detail View */}
            <div className="lg:col-span-2">
              {detailLoading ? (
                <div className="card flex items-center justify-center h-64">
                  <svg className="w-7 h-7 animate-spin" style={{ color: '#c4893a' }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : selected ? (
                <div className="space-y-5">
                  {/* Score header */}
                  <div className="card">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <ScoreCircle score={selected.matchScore} />
                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">File</p>
                        <p className="text-white font-semibold mb-3">{selected.fileName}</p>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Analyzed</p>
                        <p className="text-slate-300 text-sm">{formatDate(selected.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {selected.summary && (
                    <div className="card">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" style={{ color: '#c4893a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        AI Summary
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{selected.summary}</p>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="card">
                    <SkillPills
                      matchedSkills={selected.matchedSkills}
                      missingSkills={selected.missingSkills}
                      bonusSkills={selected.bonusSkills}
                    />
                  </div>

                  {/* Action Plan */}
                  {selected.actionPlan && (
                    <div className="card">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Action Plan
                      </h3>
                      <ActionPlan markdown={selected.actionPlan} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="card flex items-center justify-center h-48 text-slate-500 text-sm">
                  Select an analysis from the list to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
