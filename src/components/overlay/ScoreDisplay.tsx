import React, { useEffect, useState, useRef } from 'react';
import { ScoreState } from '../../types/match';

interface ScoreDisplayProps {
  score: ScoreState;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const [runsAnim, setRunsAnim] = useState(false);
  const [ballsAnim, setBallsAnim] = useState(false);
  const [outsAnim, setOutsAnim] = useState(false);

  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (prevScoreRef.current.runs !== score.runs) {
      setRunsAnim(true);
      const timer = setTimeout(() => setRunsAnim(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score.runs]);

  useEffect(() => {
    if (prevScoreRef.current.balls !== score.balls) {
      setBallsAnim(true);
      const timer = setTimeout(() => setBallsAnim(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score.balls]);

  useEffect(() => {
    if (prevScoreRef.current.outs !== score.outs) {
      setOutsAnim(true);
      const timer = setTimeout(() => setOutsAnim(false), 300);
      return () => clearTimeout(timer);
    }
  }, [score.outs]);

  useEffect(() => {
    prevScoreRef.current = score;
  }, [score]);

  const pad = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="relative select-none z-30">
      {/* Outer TV-Broadcast Green & White Capsule */}
      <div className="rounded-2xl border-2 border-[#17C978]/60 shadow-[0_4px_18px_rgba(0,0,0,0.28),0_0_15px_rgba(23,201,120,0.25)] overflow-hidden flex divide-x divide-white/10 bg-gradient-to-b from-[#062417] to-[#061B3A]">
        {/* 1. RUNS Column */}
        <div className="flex flex-col min-w-[95px] md:min-w-[115px] relative group">
          {/* Top white accent line */}
          <div className="h-[3px] w-full bg-white" />
          
          <div className="pt-1.5 pb-0.5 text-center text-[10px] md:text-[11px] font-bold tracking-widest text-white uppercase font-display">
            RUNS
          </div>
          <div
            className={`text-white font-score font-extrabold text-5xl md:text-6xl px-4 py-1 text-center transition-all duration-300 leading-none tracking-tight ${
              runsAnim ? 'scale-110 text-[#17C978]' : ''
            }`}
          >
            {pad(score.runs)}
          </div>
          <div className="pb-1 text-center">
            <span className="inline-block w-6 h-[2px] bg-white/30 rounded-full" />
          </div>
        </div>

        {/* 2. BALLS Column */}
        <div className="flex flex-col min-w-[95px] md:min-w-[115px] relative group">
          {/* Top green accent line */}
          <div className="h-[3px] w-full bg-[#17C978]" />
          
          <div className="pt-1.5 pb-0.5 text-center text-[10px] md:text-[11px] font-bold tracking-widest text-[#17C978] uppercase font-display">
            BALLS
          </div>
          <div
            className={`text-[#17C978] font-score font-extrabold text-5xl md:text-6xl px-4 py-1 text-center transition-all duration-300 leading-none tracking-tight ${
              ballsAnim ? 'scale-110 brightness-125' : ''
            }`}
          >
            {pad(score.balls)}
          </div>
          <div className="pb-1 text-center">
            <span className="inline-block w-6 h-[2px] bg-[#17C978]/40 rounded-full" />
          </div>
        </div>

        {/* 3. OUTS Column */}
        <div className="flex flex-col min-w-[95px] md:min-w-[115px] relative group">
          {/* Top red accent line */}
          <div className="h-[3px] w-full bg-[#E32636]" />
          
          <div className="pt-1.5 pb-0.5 text-center text-[10px] md:text-[11px] font-bold tracking-widest text-[#FF5A61] uppercase font-display">
            OUTS
          </div>
          <div
            className={`text-[#E32636] font-score font-extrabold text-5xl md:text-6xl px-4 py-1 text-center transition-all duration-300 leading-none tracking-tight ${
              outsAnim ? 'scale-110 brightness-125' : ''
            }`}
          >
            {pad(score.outs)}
          </div>
          <div className="pb-1 text-center">
            <span className="inline-block w-6 h-[2px] bg-[#E32636]/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
