import React, { useEffect, useState } from 'react';

const LETTERS = 'Skill Gap'.split('');
const DROP_DELAY   = 80;   // ms between each letter drop
const HOLD_TIME    = 1800; // ms to hold after all letters landed
const RISE_TIME    = 300;  // ms to fade letters out before next cycle

export default function DropLetters() {
  const [phase, setPhase]     = useState('dropping');
  const [visible, setVisible] = useState([]);
  const [key, setKey]         = useState(0);

  useEffect(() => {
    if (phase !== 'dropping') return;
    const timers = LETTERS.map((_, i) =>
      setTimeout(() => setVisible(v => [...v, i]), i * DROP_DELAY)
    );
    const holdTimer = setTimeout(
      () => setPhase('holding'),
      LETTERS.length * DROP_DELAY + 50
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(holdTimer);
    };
  }, [phase, key]);

  useEffect(() => {
    if (phase !== 'holding') return;
    const t = setTimeout(() => setPhase('resetting'), HOLD_TIME);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'resetting') return;
    const t = setTimeout(() => {
      setVisible([]);
      setKey(k => k + 1);
      setPhase('dropping');
    }, RISE_TIME);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <span
      aria-label="Skill Gap"
      style={{
        display: 'inline-block',
        background: 'linear-gradient(90deg, #e8c48a 0%, #c4893a 60%, #d4a35a 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'brightness(1.2)',
      }}
    >
      {LETTERS.map((letter, i) => {
        const isVisible = visible.includes(i);
        const isResetting = phase === 'resetting';
        return (
          <span
            key={`${key}-${i}`}
            style={{
              display: 'inline-block',
              opacity: isResetting ? 0 : isVisible ? 1 : 0,
              transform: isResetting
                ? 'translateY(-20px)'
                : isVisible
                ? 'translateY(0px)'
                : 'translateY(-48px)',
              transition: isResetting
                ? `opacity ${RISE_TIME}ms ease-in, transform ${RISE_TIME}ms ease-in`
                : 'opacity 0.35s ease-out, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              whiteSpace: letter === ' ' ? 'pre' : 'normal',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        );
      })}
    </span>
  );
}
