import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Copy, Check } from 'lucide-react';
import { EvaluatedMove, MoveQuality } from '../types/chess';

interface MoveHistoryProps {
  moves: EvaluatedMove[];
  currentMoveIndex: number; // -1 = initial start, 0 = after move 1, etc.
  onSelectMove: (index: number) => void;
  pgn: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  currentMoveIndex,
  onSelectMove,
  pgn,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Auto-scroll to current move
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.active-move');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [currentMoveIndex]);

  const handleCopyPgn = () => {
    navigator.clipboard.writeText(pgn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderQualityBadge = (quality: MoveQuality) => {
    switch (quality) {
      case 'brilliant':
        return (
          <span className="ml-1 px-1 py-0.2 text-[9px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            !!
          </span>
        );
      case 'best':
        return (
          <span className="ml-1 px-1 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-400">
            ★
          </span>
        );
      case 'inaccuracy':
        return (
          <span className="ml-1 px-1 py-0.2 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300">
            ?!
          </span>
        );
      case 'mistake':
        return (
          <span className="ml-1 px-1 py-0.2 text-[9px] font-bold rounded bg-orange-500/20 text-orange-400">
            ?
          </span>
        );
      case 'blunder':
        return (
          <span className="ml-1 px-1 py-0.2 text-[9px] font-bold rounded bg-red-500/25 text-red-400 font-mono">
            ??
          </span>
        );
      default:
        return null;
    }
  };

  // Group moves into pairs (White & Black)
  const pairedMoves: { num: number; white?: EvaluatedMove; black?: EvaluatedMove; whiteIdx: number; blackIdx: number }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairedMoves.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
      whiteIdx: i,
      blackIdx: i + 1,
    });
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Notation</span>
          <span className="text-[10px] text-slate-500 font-normal">({moves.length} plies)</span>
        </h3>

        <button
          onClick={handleCopyPgn}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
          title="Copy PGN to clipboard"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'PGN'}</span>
        </button>
      </div>

      {/* Moves Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-1 text-sm font-mono scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent min-h-[160px] max-h-[320px]"
      >
        {pairedMoves.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic py-8">
            No moves played yet.
          </div>
        ) : (
          pairedMoves.map((pair) => (
            <div
              key={pair.num}
              className="grid grid-cols-12 gap-1 items-center py-0.5 px-1.5 rounded hover:bg-slate-800/40"
            >
              <span className="col-span-2 text-xs text-slate-500">{pair.num}.</span>

              {/* White move */}
              {pair.white && (
                <button
                  onClick={() => onSelectMove(pair.whiteIdx)}
                  className={`col-span-5 text-left px-2 py-0.5 rounded text-xs transition-colors flex items-center cursor-pointer ${
                    currentMoveIndex === pair.whiteIdx
                      ? 'bg-amber-500/20 text-amber-300 font-bold active-move border border-amber-500/40'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{pair.white.san}</span>
                  {renderQualityBadge(pair.white.quality)}
                </button>
              )}

              {/* Black move */}
              {pair.black ? (
                <button
                  onClick={() => onSelectMove(pair.blackIdx)}
                  className={`col-span-5 text-left px-2 py-0.5 rounded text-xs transition-colors flex items-center cursor-pointer ${
                    currentMoveIndex === pair.blackIdx
                      ? 'bg-amber-500/20 text-amber-300 font-bold active-move border border-amber-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{pair.black.san}</span>
                  {renderQualityBadge(pair.black.quality)}
                </button>
              ) : (
                <div className="col-span-5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Navigation Controls */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/70 grid grid-cols-4 gap-1">
        <button
          onClick={() => onSelectMove(-1)}
          disabled={currentMoveIndex === -1}
          className="p-1.5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Initial Position"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectMove(Math.max(-1, currentMoveIndex - 1))}
          disabled={currentMoveIndex === -1}
          className="p-1.5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous Move"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectMove(Math.min(moves.length - 1, currentMoveIndex + 1))}
          disabled={currentMoveIndex === moves.length - 1}
          className="p-1.5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next Move"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectMove(moves.length - 1)}
          disabled={currentMoveIndex === moves.length - 1}
          className="p-1.5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Latest Move"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
