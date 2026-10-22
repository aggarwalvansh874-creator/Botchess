import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { HISTORICAL_GAMES } from '../data/historicalGames';
import { HistoricalGame, EvaluatedMove } from '../types/chess';
import { ChessBoard, BoardThemeId } from './ChessBoard';
import { EvalBar } from './EvalBar';
import { evaluatePosition } from '../engine/evaluator';
import { sound } from '../lib/audio';
import { 
  BookOpen, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Play, 
  Pause, 
  HelpCircle, 
  Award,
  CheckCircle2,
  XCircle,
  Upload
} from 'lucide-react';

interface HistoricalReplayViewProps {
  boardTheme: BoardThemeId;
}

export const HistoricalReplayView: React.FC<HistoricalReplayViewProps> = ({ boardTheme }) => {
  const [selectedGame, setSelectedGame] = useState<HistoricalGame>(HISTORICAL_GAMES[0]);
  const [chessInstance, setChessInstance] = useState<Chess>(new Chess());
  const [currentPly, setCurrentPly] = useState<number>(-1);
  const [parsedMoves, setParsedMoves] = useState<{ san: string; from: string; to: string; fen: string }[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [guessMode, setGuessMode] = useState<boolean>(false);
  const [guessFeedback, setGuessFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [customPgnInput, setCustomPgnInput] = useState<string>('');
  const [showPgnModal, setShowPgnModal] = useState<boolean>(false);

  // Load and parse game moves from PGN
  useEffect(() => {
    try {
      const tempChess = new Chess();
      tempChess.loadPgn(selectedGame.pgn);
      const historyVerbose = tempChess.history({ verbose: true });

      // Replay from start to extract FENs
      const sim = new Chess();
      const movesData = historyVerbose.map((m) => {
        sim.move(m);
        return {
          san: m.san,
          from: m.from,
          to: m.to,
          fen: sim.fen(),
        };
      });

      setParsedMoves(movesData);
      setCurrentPly(-1);
      setChessInstance(new Chess());
      setGuessFeedback(null);
      setIsPlaying(false);
    } catch (e) {
      console.error('Error loading PGN:', e);
    }
  }, [selectedGame]);

  // Autoplay effect
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentPly((prev) => {
          if (prev >= parsedMoves.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          const nextChess = new Chess(parsedMoves[next].fen);
          setChessInstance(nextChess);
          sound.playMove();
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, parsedMoves]);

  const goToPly = (ply: number) => {
    if (ply < -1 || ply >= parsedMoves.length) return;
    setCurrentPly(ply);
    setGuessFeedback(null);
    if (ply === -1) {
      setChessInstance(new Chess());
    } else {
      setChessInstance(new Chess(parsedMoves[ply].fen));
      sound.playMove();
    }
  };

  const handleCustomPgnSubmit = () => {
    if (!customPgnInput.trim()) return;
    try {
      const testChess = new Chess();
      testChess.loadPgn(customPgnInput);
      const customGame: HistoricalGame = {
        id: `custom-${Date.now()}`,
        title: 'Custom Game Replay',
        subtitle: 'Loaded from User PGN',
        event: 'Custom PGN Analysis',
        year: new Date().getFullYear(),
        white: { name: 'White Player', title: '' },
        black: { name: 'Black Player', title: '' },
        result: '1/2-1/2',
        eco: 'A00',
        openingName: 'Custom Opening',
        pgn: customPgnInput,
        description: 'User-provided PGN game analyzed with Grandmaster insights.',
        keyMoments: [],
      };
      setSelectedGame(customGame);
      setShowPgnModal(false);
      setCustomPgnInput('');
    } catch {
      alert('Invalid PGN format. Please check the text and try again.');
    }
  };

  // Check if current move is a key historical moment
  const currentKeyMoment = selectedGame.keyMoments.find((km) => km.moveIndex === currentPly);

  // Guess the move challenge handler
  const handleBoardMove = (from: Square, to: Square) => {
    if (!guessMode) return;
    if (currentPly >= parsedMoves.length - 1) return;

    const expectedNextMove = parsedMoves[currentPly + 1];
    if (from === expectedNextMove.from && to === expectedNextMove.to) {
      sound.playCheck();
      setGuessFeedback({
        correct: true,
        message: `Brilliant! You found the Grandmaster move: ${expectedNextMove.san}!`,
      });
      goToPly(currentPly + 1);
    } else {
      sound.playMove();
      setGuessFeedback({
        correct: false,
        message: `Not quite. That move was not the historical choice. Try another candidate move or check the hint!`,
      });
    }
  };

  // Real-time evaluation of current replay board
  const evalCp = evaluatePosition(chessInstance);
  const lastMoveObj = currentPly >= 0 ? {
    from: parsedMoves[currentPly].from,
    to: parsedMoves[currentPly].to,
  } : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Game Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">Historical Masterpiece Library</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Study legendary chess clashes with deep tactical explanations, candidate move refutations, and interactive challenges.
          </p>
        </div>

        {/* Game Selector Dropdown & Import */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedGame.id}
            onChange={(e) => {
              const found = HISTORICAL_GAMES.find((g) => g.id === e.target.value);
              if (found) setSelectedGame(found);
            }}
            className="flex-1 md:flex-none bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-medium focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {HISTORICAL_GAMES.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title} ({game.year}) - {game.white.name} vs {game.black.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowPgnModal(true)}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Import custom PGN"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Load PGN</span>
          </button>
        </div>
      </div>

      {/* Main Replay Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Board & Controls (Cols 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex gap-2 sm:gap-4 items-stretch justify-center">
            {/* Eval Bar */}
            <EvalBar evalCp={evalCp} orientation="w" />

            {/* Chess Board */}
            <div className="flex-1 max-w-[580px]">
              <ChessBoard
                chess={chessInstance}
                orientation="w"
                onMove={guessMode ? handleBoardMove : undefined}
                interactive={guessMode}
                lastMove={lastMoveObj}
                theme={boardTheme}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPly(-1)}
                disabled={currentPly === -1}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                title="Start of game"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPly(currentPly - 1)}
                disabled={currentPly === -1}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                title="Previous move"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Autoplay'}</span>
              </button>
              <button
                onClick={() => goToPly(currentPly + 1)}
                disabled={currentPly >= parsedMoves.length - 1}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                title="Next move"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPly(parsedMoves.length - 1)}
                disabled={currentPly >= parsedMoves.length - 1}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
                title="End of game"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Move: <span className="font-bold text-slate-100">{currentPly === -1 ? '0' : Math.floor(currentPly / 2) + 1}</span> / {Math.ceil(parsedMoves.length / 2)}
            </div>

            {/* Guess the Move Mode Toggle */}
            <button
              onClick={() => {
                setGuessMode(!guessMode);
                setGuessFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                guessMode
                  ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{guessMode ? 'Exit Guess Mode' : 'Guess the Move Challenge'}</span>
            </button>
          </div>

          {/* Guess Feedback Alert */}
          {guessFeedback && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                guessFeedback.correct
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              }`}
            >
              {guessFeedback.correct ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{guessFeedback.message}</span>
            </div>
          )}
        </div>

        {/* Right: Insightful Move Suggestions & Commentary (Cols 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Game Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                {selectedGame.event} • {selectedGame.year}
              </span>
              <h3 className="text-lg font-bold text-white">{selectedGame.title}</h3>
              <p className="text-xs text-slate-400">{selectedGame.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">WHITE</span>
                <span className="font-bold text-slate-200">{selectedGame.white.name}</span>
                {selectedGame.white.title && (
                  <span className="text-[10px] text-amber-400 ml-1 font-mono">
                    ({selectedGame.white.title})
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">BLACK</span>
                <span className="font-bold text-slate-200">{selectedGame.black.name}</span>
                {selectedGame.black.title && (
                  <span className="text-[10px] text-amber-400 ml-1 font-mono">
                    ({selectedGame.black.title})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Opening: <strong className="text-slate-200">{selectedGame.openingName}</strong> ({selectedGame.eco})</span>
              <span className="font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                {selectedGame.result}
              </span>
            </div>
          </div>

          {/* Insightful Move Suggestions at Key Turning Points */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Insightful Move Suggestions</span>
              </h4>
              <span className="text-[10px] font-semibold text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Grandmaster Notes
              </span>
            </div>

            {currentKeyMoment ? (
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5 space-y-2.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-400" />
                    {currentKeyMoment.title}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Turning Point
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentKeyMoment.description}
                </p>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <strong className="text-emerald-400 block mb-0.5">Why this move was brilliant:</strong>
                  <span className="text-emerald-200/90 leading-relaxed">{currentKeyMoment.whyBrilliant}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <strong className="text-slate-400 block mb-0.5">Alternative Lines Refuted:</strong>
                  <span className="text-slate-300 leading-relaxed">{currentKeyMoment.alternativesConsidered}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400 italic">
                  Step through the moves using the navigation arrows or click a key moment below to inspect the critical ideas.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                  {selectedGame.keyMoments.map((km, i) => (
                    <button
                      key={i}
                      onClick={() => goToPly(km.moveIndex)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Jump:</span>
                      <strong className="text-white">{km.title.split(' ')[0]}</strong>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Move List Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Move Sequence
            </h4>
            <div className="max-h-48 overflow-y-auto p-1 font-mono text-xs flex flex-wrap gap-1">
              {parsedMoves.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPly(idx)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                    currentPly === idx
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : idx % 2 === 0
                      ? 'text-slate-200 hover:bg-slate-800'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}
                  {m.san}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom PGN Modal */}
      {showPgnModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" />
              <span>Import Custom PGN</span>
            </h3>
            <p className="text-xs text-slate-400">
              Paste standard Portable Game Notation (PGN) text here to analyze and replay any master game.
            </p>
            <textarea
              value={customPgnInput}
              onChange={(e) => setCustomPgnInput(e.target.value)}
              placeholder="1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6..."
              className="w-full h-36 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPgnModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomPgnSubmit}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow cursor-pointer"
              >
                Load Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
