import React from 'react';

/**
 * Renders the AI-generated actionPlan markdown string.
 * Parses headings (##), bold (**), bullet lists (-), and numbered lists (1.)
 * without needing an external markdown library.
 */
export default function ActionPlan({ markdown }) {
  if (!markdown) return null;

  const lines = markdown.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h4 key={i} className="text-white font-semibold text-sm mt-4 first:mt-0">
              {trimmed.slice(3)}
            </h4>
          );
        }
        // # Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h3 key={i} className="text-white font-bold text-base mt-4 first:mt-0">
              {trimmed.slice(2)}
            </h3>
          );
        }
        // Bullet list item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-2.5 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <p className="text-slate-300 text-sm leading-relaxed">
                <InlineMarkdown text={trimmed.slice(2)} />
              </p>
            </div>
          );
        }
        // Numbered list item
        const numberedMatch = trimmed.match(/^(\d+)\.\s(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex items-start gap-3 ml-1">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center mt-0.5">
                {numberedMatch[1]}
              </span>
              <p className="text-slate-300 text-sm leading-relaxed">
                <InlineMarkdown text={numberedMatch[2]} />
              </p>
            </div>
          );
        }
        // Empty line
        if (!trimmed) return <div key={i} className="h-1" />;

        // Regular paragraph
        return (
          <p key={i} className="text-slate-300 text-sm leading-relaxed">
            <InlineMarkdown text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

// Renders **bold** and `code` inline within text
function InlineMarkdown({ text }) {
  // Split by **bold** and `code` patterns
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
