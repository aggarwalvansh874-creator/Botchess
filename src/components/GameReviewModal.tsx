import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { StoredGame, EvaluatedMove } from '../types/chess';
import { ChessBoard, BoardThemeId } from './ChessBoard';
import { EvalBar } from './EvalBar';
import { sound } from '../lib/audio';
import { 
  X, 
  Award, 
  AlertOctagon, 
  Sparkles, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Lightbulb
} from 'lucide-react';

interface GameReviewModalProps {
  game: StoredGame;
  onClose: () => void;
  boardTheme: BoardThemeId;
}

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  game,
  onClose,
  boardTheme,
}) => {
  const [currentMoveIdx, setCurrentMoveIdx] = useState<number>(0);
  const [chessInstance, setChessInstance] = useState<Chess>(() => {
    const c = new Chess();
    if (game.moves.length > 0) {
      c.load(game.moves[0].fenAfter);
    }
    return c;
  });
  const [solveMode, setSolveMode] = useState<boolean>(false);
  const [solveFeedback, setSolveFeedback] = useState<string | null>(null);

  const currentMove: EvaluatedMove | undefined = game.moves[currentMoveIdx];

  const jumpToMove = (idx: number) => {
    if (idx < 0 || idx >= game.moves.length) return;
    setCurrentMoveIdx(idx);
    setSolveMode(false);
    setSolveFeedback(null);
    const newChess = new Chess();
    newChess.load(game.moves[idx].fenAfter);
    setChessInstance(newChess);
    sound.playMove();
  };

  const handleBlunderRetryMove = (from: Square, to: Square) => {
    if (!solveMode || !currentMove) return;

    if (currentMove.bestMoveSan) {
      // Check if this move matches best move
      const testChess = new Chess(currentMove.fenBefore);
      const legalMoves = testChess.moves({ verbose: true });
      const played = legalMoves.find((m) => m.from === from && m.to === to);

      if (played && played.san === currentMove.bestMoveSan) {
        sound.playVictory();
        setSolveFeedback(`Brilliant! You found the Grandmaster move: ${played.san}!`);
        const nextChess = new Chess(currentMove.fenBefore);
        nextChess.move({ from, to });
        setChessInstance(nextChess);
      } else {
        sound.playMove();
        setSolveFeedback(`That move was not optimal. The engine recommends ${currentMove.bestMoveSan}.`);
      }
    }
  };

  const startSolveBlunder = (move: EvaluatedMove) => {
    setSolveMode(true);
    setSolveFeedback('Try to find the move the engine recommended!');
    const resetChess = new Chess(move.fenBefore);
    setChessInstance(resetChess);
  };

  // Find user's blunders to quick-jump
  const playerBlunders = game.moves
    .map((m, idx) => ({ m, idx }))
    .filter((item) => item.m.color === game.playerColor && (item.m.quality === 'blunder' || item.m.quality === 'mistake'));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Game Review vs {game.botName}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {game.botElo >= 1000000 ? '50,000,000 PTS' : `${game.botElo} ELO`}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Played on {game.date} • Result:{' '}
                <strong className={game.result === 'win' ? 'text-emerald-400' : 'text-rose-400'}>
                  {game.result.toUpperCase()} ({game.reason})
                </strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Board & Navigation (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex gap-2 sm:gap-4 items-stretch justify-center">
              <EvalBar
                evalCp={currentMove?.evalAfter || 0}
                orientation={game.playerColor}
              />
              <div className="flex-1 max-w-[480px]">
                <ChessBoard
                  chess={chessInstance}
                  orientation={game.playerColor}
                  interactive={solveMode}
                  onMove={solveMode ? handleBlunderRetryMove : undefined}
                  lastMove={
                    currentMove && !solveMode
                      ? { from: currentMove.from, to: currentMove.to }
                      : null
                  }
                  theme={boardTheme}
                />
              </div>
            </div>

            {/* Step Controls */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <button
                onClick={() => jumpToMove(Math.max(0, currentMoveIdx - 1))}
                disabled={currentMoveIdx === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="text-xs font-mono text-slate-300">
                Move {Math.floor(currentMoveIdx / 2) + 1} of {Math.ceil(game.moves.length / 2)}
                {currentMove && (
                  <span className="ml-2 font-bold text-amber-300">({currentMove.san})</span>
                )}
              </div>

              <button
                onClick={() => jumpToMove(Math.min(game.moves.length - 1, currentMoveIdx + 1))}
                disabled={currentMoveIdx >= game.moves.length - 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Solve feedback alert */}
            {solveFeedback && (
              <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-200 font-semibold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{solveFeedback}</span>
              </div>
            )}
          </div>

          {/* Right Column: Statistics, Blunder Breakdown & Coaching (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Accuracy Score Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Your Accuracy
                </span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {game.playerAccuracy.toFixed(1)}%
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  {game.botName} Accuracy
                </span>
                <span className="text-3xl font-extrabold text-indigo-400 font-mono">
                  {game.botAccuracy.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Move Quality Breakdown Badges */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Move Classification
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                  <span className="font-bold text-sm block">{game.brilliantCount}</span>
                  <span className="text-[10px] text-slate-400">Brilliant (!!)</span>
                </div>
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300">
                  <span className="font-bold text-sm block">{game.mistakesCount}</span>
                  <span className="text-[10px] text-slate-400">Mistakes (?)</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <span className="font-bold text-sm block">{game.blundersCount}</span>
                  <span className="text-[10px] text-slate-400">Blunders (??)</span>
                </div>
              </div>
            </div>

            {/* Current Move Coaching Note */}
            {currentMove && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Engine Analysis</span>
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      currentMove.quality === 'blunder'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : currentMove.quality === 'mistake'
                        ? 'bg-orange-500/20 text-orange-400'
                        : currentMove.quality === 'brilliant'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {currentMove.quality}
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {currentMove.quality === 'blunder' ? (
                    <span className="text-rose-300">
                      <strong>Critical error:</strong> Playing {currentMove.san} dropped significant tactical advantage. The engine wanted <strong>{currentMove.bestMoveSan || 'a better move'}</strong>.
                    </span>
                  ) : currentMove.quality === 'mistake' ? (
                    <span className="text-orange-300">
                      Playing {currentMove.san} conceded the initiative. Better was <strong>{currentMove.bestMoveSan}</strong>.
                    </span>
                  ) : currentMove.quality === 'brilliant' ? (
                    <span className="text-cyan-300">
                      Exceptional move! You found the sharpest tactical continuation on the board.
                    </span>
                  ) : (
                    <span>
                      Solid choice ({currentMove.san}). Maintained strategic balance and king safety.
                    </span>
                  )}
                </div>

                {(currentMove.quality === 'blunder' || currentMove.quality === 'mistake') && (
                  <button
                    onClick={() => startSolveBlunder(currentMove)}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Solve From This Mistake</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick-Jump to Blunders List */}
            {playerBlunders.length > 0 && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick-Jump to Key Mistakes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {playerBlunders.map(({ m, idx }) => (
                    <button
                      key={idx}
                      onClick={() => jumpToMove(idx)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors cursor-pointer ${
                        currentMoveIdx === idx
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-800 text-rose-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {Math.floor(idx / 2) + 1}. {m.san} ({m.quality === 'blunder' ? '??' : '?'})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
