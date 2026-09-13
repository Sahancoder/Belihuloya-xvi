import React, { useEffect, useState, useRef } from 'react';

interface ScoreValueProps {
  value: number;
  label: string;
  type?: 'runs' | 'balls' | 'outs';
  padZeros?: boolean;
}

export const ScoreValue: React.FC<ScoreValueProps> = ({
  value,
  label,
  type = 'runs',
  padZeros = false,
}) => {
  const [animating, setAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 300);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  const formattedValue = padZeros ? String(value).padStart(2, '0') : String(value);

  const getAnimationClass = () => {
    if (!animating) return '';
    if (type === 'outs') return 'scale-110 text-red-500 transition-all duration-300';
    if (type === 'balls') return 'scale-110 text-emerald-400 transition-all duration-300';
    return 'scale-110 text-cyan-300 transition-all duration-300';
  };

  const getLabelColor = () => {
    if (type === 'outs') return 'text-red-400';
    if (type === 'balls') return 'text-emerald-400';
    return 'text-cyan-400';
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-1 min-w-[75px]">
      <span className={`text-[10px] font-black tracking-widest uppercase ${getLabelColor()}`}>
        {label}
      </span>
      <span
        className={`font-mono font-black text-3xl md:text-4xl text-white tracking-tight leading-none ${getAnimationClass()}`}
      >
        {formattedValue}
      </span>
    </div>
  );
};
