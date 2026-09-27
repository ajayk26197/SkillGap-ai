import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

const getScoreColor = (score) => {
  if (score >= 75) return { primary: '#10b981', glow: 'rgba(16,185,129,0.25)', label: 'Strong Match', labelColor: 'text-emerald-400' };
  if (score >= 50) return { primary: '#f59e0b', glow: 'rgba(245,158,11,0.25)', label: 'Moderate Match', labelColor: 'text-amber-400' };
  return { primary: '#f43f5e', glow: 'rgba(244,63,94,0.25)', label: 'Low Match', labelColor: 'text-rose-400' };
};

export default function ScoreCircle({ score }) {
  const { primary, glow, label, labelColor } = getScoreColor(score);
  const data = [{ value: score, fill: primary }];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-48 h-48 rounded-full"
        style={{ boxShadow: `0 0 40px ${glow}` }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="72%"
            outerRadius="90%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: 'rgba(255,255,255,0.05)' }}
              dataKey="value"
              cornerRadius={12}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white leading-none">{score}</span>
          <span className="text-sm font-medium text-slate-400 mt-0.5">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${labelColor}`}>{label}</span>
    </div>
  );
}
