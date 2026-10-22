import React from 'react';
import { PieceColor } from '../types/chess';

interface EvalBarProps {
  evalCp: number;
  orientation?: PieceColor;
  isMate?: boolean;
  mateIn?: number;
}

export const EvalBar: React.FC<EvalBarProps> = ({
  evalCp,
  orientation = 'w',
  isMate = false,
  mateIn,
}) => {
  // Convert cp (-1500 to +1500) to white winning percentage (0 to 100)
  // Standard Lichess / FIDE winning chance curve
  const clampedCp = Math.max(-1500, Math.min(1500, evalCp));
  let whitePercent = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * clampedCp)) - 1);

  if (isMate && mateIn !== undefined) {
    whitePercent = evalCp > 0 ? 100 : 0;
  }

  // Adjust percentage according to board orientation
  // If orientation is White, White is at the bottom (so white height is from bottom)
  // If orientation is Black, Black is at the bottom
  const fillHeight = orientation === 'w' ? whitePercent : 100 - whitePercent;

  let displayScore = '';
  if (isMate && mateIn !== undefined) {
    const mateNum = Math.abs(mateIn);
    displayScore = evalCp > 0 ? `M${mateNum}` : `-M${mateNum}`;
  } else {
    const scoreVal = evalCp / 100;
    displayScore = scoreVal > 0 ? `+${scoreVal.toFixed(1)}` : scoreVal.toFixed(1);
  }

  return (
    <div className="relative w-7 sm:w-8 h-full min-h-[380px] bg-slate-900 rounded-lg overflow-hidden border border-slate-700/80 shadow-md flex flex-col justify-end select-none">
      {/* Top score label (if Black is leading or at top) */}
      <div className="absolute top-1 left-0 right-0 z-10 text-center text-[10px] font-bold font-mono text-slate-300 drop-shadow">
        {orientation === 'w' && evalCp < 0 ? displayScore : ''}
        {orientation === 'b' && evalCp > 0 ? displayScore : ''}
      </div>

      {/* White evaluation fill */}
      <div
        className="w-full bg-slate-100 transition-all duration-300 ease-out"
        style={{ height: `${Math.max(2, Math.min(98, fillHeight))}%` }}
      />

      {/* Bottom score label */}
      <div className="absolute bottom-1 left-0 right-0 z-10 text-center text-[10px] font-bold font-mono text-slate-800 drop-shadow">
        {orientation === 'w' && evalCp >= 0 ? displayScore : ''}
        {orientation === 'b' && evalCp <= 0 ? displayScore : ''}
      </div>
    </div>
  );
};
