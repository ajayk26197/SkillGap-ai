import React from 'react';

export default function SkillPills({ matchedSkills = [], missingSkills = [], bonusSkills = [] }) {
  return (
    <div className="space-y-5">

      {/* Matched Skills */}
      {matchedSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <h4 className="text-sm font-semibold text-slate-300">
              Matched Skills
              <span className="ml-2 text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {matchedSkills.length}
              </span>
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, i) => (
              <span key={i} className="skill-matched">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <h4 className="text-sm font-semibold text-slate-300">
              Missing Skills
              <span className="ml-2 text-xs font-normal text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                {missingSkills.length}
              </span>
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, i) => (
              <span key={i} className="skill-missing">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bonus Skills */}
      {bonusSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: '#c4893a' }} />
            <h4 className="text-sm font-semibold text-slate-300">
              Bonus Skills
              <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full border" style={{ color: '#e8c48a', background: 'rgba(196,137,58,0.1)', borderColor: 'rgba(196,137,58,0.3)' }}>
                {bonusSkills.length}
              </span>
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {bonusSkills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(196,137,58,0.15)', color: '#e8c48a', border: '1px solid rgba(196,137,58,0.3)' }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3l14 9-14 9V3z" />
                </svg>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {matchedSkills.length === 0 && missingSkills.length === 0 && bonusSkills.length === 0 && (
        <p className="text-slate-500 text-sm">No skill data available.</p>
      )}
    </div>
  );
}
