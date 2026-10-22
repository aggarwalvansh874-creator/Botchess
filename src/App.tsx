import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import confetti from 'canvas-confetti';
import { User } from 'firebase/auth';

import { 
  BotProfile, 
  PieceColor, 
  PieceSymbol, 
  StoredGame, 
  EvaluatedMove, 
  TacticalAnalysis, 
  MoveQuality 
} from './types/chess';
import { CHESS_BOTS } from './data/bots';
import { evaluatePosition, analyzePositionTactics } from './engine/evaluator';
import { stockfish } from './engine/stockfishService';
import { calculateStockUltraMove } from './engine/stockUltraEngine';
import { sound } from './lib/audio';
import { subscribeToAuth, loginWithGoogle } from './lib/auth';
import { saveGameToDb, loadUserGames, deleteGameFromDb } from './lib/db';

import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ChessBoard, BoardThemeId } from './components/ChessBoard';
import { EvalBar } from './components/EvalBar';
import { MoveHistory } from './components/MoveHistory';
import { EngineAnalysisPanel } from './components/EngineAnalysisPanel';
import { BotSelector } from './components/BotSelector';
import { HistoricalReplayView } from './components/HistoricalReplayView';
import { GameReviewModal } from './components/GameReviewModal';
import { UserProfileModal } from './components/UserProfileModal';

import { 
  RotateCcw, 
  Flag, 
  Handshake, 
  Sparkles, 
  Volume2, 
  ArrowLeftRight, 
  Play, 
  Trophy, 
  Award,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<'home' | 'play' | 'historical' | 'profile'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<StoredGame[]>([]);
  const [boardTheme, setBoardTheme] = useState<BoardThemeId>('emerald');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedGameForReview, setSelectedGameForReview] = useState<StoredGame | null>(null);

  // Active Match State
  const [chess] = useState<Chess>(() => new Chess());
  const [selectedBot, setSelectedBot] = useState<BotProfile>(CHESS_BOTS[0]);
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [timeControlSeconds, setTimeControlSeconds] = useState<number>(0);
  const [playerTimeRemaining, setPlayerTimeRemaining] = useState<number>(0);
  const [botTimeRemaining, setBotTimeRemaining] = useState<number>(0);

  const [evaluatedMoves, setEvaluatedMoves] = useState<EvaluatedMove[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
  const [displayFen, setDisplayFen] = useState<string>(chess.fen());
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [gameReason, setGameReason] = useState<string>('');
  const [botComment, setBotComment] = useState<string>(selectedBot.quips.start[0]);

  const [isEngineThinking, setIsEngineThinking] = useState<boolean>(false);
  const [showBestMoveArrow, setShowBestMoveArrow] = useState<boolean>(false);
  const [showStrategicTips, setShowStrategicTips] = useState<boolean>(false);
  const [tacticalAnalysis, setTacticalAnalysis] = useState<TacticalAnalysis>(() =>
    analyzePositionTactics(chess, evaluatePosition(chess))
  );

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      loadUserGames(currentUser ? currentUser.uid : null).then(setGames);
    });
    return () => unsubscribe();
  }, []);

  // Update sound state
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  // Clock countdown timer
  useEffect(() => {
    if (timeControlSeconds <= 0 || isGameOver) return;

    const timer = setInterval(() => {
      const turn = chess.turn();
      if (turn === playerColor) {
        setPlayerTimeRemaining((prev) => {
          if (prev <= 1000) {
            handleGameOver('loss', 'Timeout');
            return 0;
          }
          return prev - 1000;
        });
      } else {
        setBotTimeRemaining((prev) => {
          if (prev <= 1000) {
            handleGameOver('win', 'Bot Timeout');
            return 0;
          }
          return prev - 1000;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeControlSeconds, isGameOver, playerColor, chess]);

  // Start a fresh game match
  const handleStartGame = useCallback((
    bot: BotProfile = selectedBot,
    chosenColor: PieceColor | 'random' = 'w',
    clockSeconds: number = 0
  ) => {
    chess.reset();
    const assignedColor = chosenColor === 'random' ? (Math.random() > 0.5 ? 'w' : 'b') : chosenColor;

    setSelectedBot(bot);
    setPlayerColor(assignedColor);
    setTimeControlSeconds(clockSeconds);
    setPlayerTimeRemaining(clockSeconds * 1000);
    setBotTimeRemaining(clockSeconds * 1000);

    setEvaluatedMoves([]);
    setCurrentMoveIndex(-1);
    setDisplayFen(chess.fen());
    setLastMove(null);
    setIsGameOver(false);
    setGameResult(null);
    setGameReason('');
    setShowBestMoveArrow(false);

    const initialEval = evaluatePosition(chess);
    setTacticalAnalysis(analyzePositionTactics(chess, initialEval));

    const startQuip = bot.quips.start[Math.floor(Math.random() * bot.quips.start.length)];
    setBotComment(startQuip);
    setCurrentTab('play');

    // If player is Black, Bot makes first move
    if (assignedColor === 'b') {
      setTimeout(() => {
        makeBotMove(bot);
      }, 500);
    }
  }, [chess, selectedBot]);

  // Handle Game Over
  const handleGameOver = useCallback((result: 'win' | 'loss' | 'draw', reason: string) => {
    setIsGameOver(true);
    setGameResult(result);
    setGameReason(reason);

    if (result === 'win') {
      sound.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      const winComment = selectedBot.quips.loss[Math.floor(Math.random() * selectedBot.quips.loss.length)] || 'Defeat accepted.';
      setBotComment(winComment);
    } else if (result === 'loss') {
      sound.playDefeat();
      const lossComment = selectedBot.quips.win[Math.floor(Math.random() * selectedBot.quips.win.length)] || 'Checkmate verified.';
      setBotComment(lossComment);
    }

    // Calculate accuracy scores
    let playerMovesCount = 0;
    let botMovesCount = 0;
    let playerAccSum = 0;
    let botAccSum = 0;
    let blunders = 0;
    let mistakes = 0;
    let brilliants = 0;

    evaluatedMoves.forEach((m) => {
      let moveScore = 100;
      if (m.quality === 'great') moveScore = 95;
      else if (m.quality === 'good') moveScore = 85;
      else if (m.quality === 'inaccuracy') moveScore = 65;
      else if (m.quality === 'mistake') {
        moveScore = 40;
        if (m.color === playerColor) mistakes++;
      } else if (m.quality === 'blunder') {
        moveScore = 15;
        if (m.color === playerColor) blunders++;
      } else if (m.quality === 'brilliant') {
        moveScore = 100;
        if (m.color === playerColor) brilliants++;
      }

      if (m.color === playerColor) {
        playerMovesCount++;
        playerAccSum += moveScore;
      } else {
        botMovesCount++;
        botAccSum += moveScore;
      }
    });

    const playerAccuracy = playerMovesCount > 0 ? playerAccSum / playerMovesCount : 80;
    const botAccuracy = botMovesCount > 0 ? botAccSum / botMovesCount : 90;

    const stored: StoredGame = {
      id: `game-${Date.now()}`,
      userId: user?.uid || 'guest',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      botId: selectedBot.id,
      botName: selectedBot.name,
      botElo: selectedBot.elo,
      playerColor,
      result,
      reason,
      pgn: chess.pgn(),
      movesCount: evaluatedMoves.length,
      playerAccuracy,
      botAccuracy,
      blundersCount: blunders,
      mistakesCount: mistakes,
      brilliantCount: brilliants,
      evalHistory: evaluatedMoves.map((m) => m.evalAfter),
      moves: evaluatedMoves,
    };

    // Save game
    saveGameToDb(stored, user?.uid).then(() => {
      loadUserGames(user?.uid).then(setGames);
    });
  }, [evaluatedMoves, playerColor, selectedBot, user, chess]);

  // Execute bot move with Grandmaster-crushing engine calculations
  const makeBotMove = async (bot: BotProfile) => {
    if (chess.isGameOver()) return;
    setIsEngineThinking(true);

    try {
      const evalBefore = evaluatePosition(chess);
      const isBlunderingMove = bot.blunderRate > 0 && Math.random() < bot.blunderRate;

      let chosenMoveUci: { from: string; to: string; promotion?: string } | null = null;

      if (bot.id === 'stockultra') {
        // 50,000,000 ELO God Engine with Absolute Untouchable Protocol
        const ultraDecision = await calculateStockUltraMove(chess);
        chosenMoveUci = ultraDecision.move;
        if (ultraDecision.explanation) {
          setBotComment(ultraDecision.explanation);
        }
      } else if (isBlunderingMove) {
        // Occasionally pick random legal move for low-rated bots
        const legalMoves = chess.moves({ verbose: true });
        const randomChoice = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        chosenMoveUci = {
          from: randomChoice.from,
          to: randomChoice.to,
          promotion: randomChoice.promotion,
        };
      } else {
        // Use Stockfish 3500+ GM depth calculation
        const engineResult = await stockfish.evaluate(chess, bot.engineDepth, 1000);
        chosenMoveUci = engineResult.bestMove;
      }

      if (!chosenMoveUci) {
        const legalMoves = chess.moves({ verbose: true });
        chosenMoveUci = legalMoves[0];
      }

      if (chosenMoveUci) {
        const fenBefore = chess.fen();
        const moveObj = chess.move({
          from: chosenMoveUci.from,
          to: chosenMoveUci.to,
          promotion: chosenMoveUci.promotion || 'q',
        });

        if (moveObj) {
          const fenAfter = chess.fen();
          const evalAfter = evaluatePosition(chess);

          if (moveObj.captured) sound.playCapture();
          else if (moveObj.flags.includes('k') || moveObj.flags.includes('q')) sound.playCastle();
          else if (chess.inCheck()) sound.playCheck();
          else sound.playMove();

          setLastMove({ from: moveObj.from, to: moveObj.to });
          setDisplayFen(fenAfter);

          const evaluated: EvaluatedMove = {
            san: moveObj.san,
            from: moveObj.from,
            to: moveObj.to,
            color: moveObj.color,
            fenBefore,
            fenAfter,
            evalBefore,
            evalAfter,
            quality: 'best',
          };

          setEvaluatedMoves((prev) => [...prev, evaluated]);
          setCurrentMoveIndex((prev) => prev + 1);

          const newAnalysis = analyzePositionTactics(chess, evalAfter);
          newAnalysis.bestMove = chosenMoveUci;
          setTacticalAnalysis(newAnalysis);

          // Check for Game Over
          if (chess.isGameOver()) {
            if (chess.isCheckmate()) {
              handleGameOver('loss', 'Checkmate');
            } else if (chess.isStalemate()) {
              handleGameOver('draw', 'Stalemate');
            } else if (chess.isThreefoldRepetition()) {
              handleGameOver('draw', 'Threefold Repetition');
            } else {
              handleGameOver('draw', 'Draw');
            }
          }
        }
      }
    } catch (err) {
      console.error('Bot move failed:', err);
    } finally {
      setIsEngineThinking(false);
    }
  };

  // Handle Player Move
  const handlePlayerMove = async (from: Square, to: Square, promotion?: PieceSymbol) => {
    if (isGameOver || isEngineThinking) return;
    if (chess.turn() !== playerColor) return;

    // Check if move is legal
    const legalMoves = chess.moves({ verbose: true });
    const isLegal = legalMoves.some(
      (m) => m.from === from && m.to === to && (!promotion || m.promotion === promotion)
    );

    if (!isLegal) return;

    const fenBefore = chess.fen();
    const evalBefore = evaluatePosition(chess);

    // Evaluate best move candidate
    const topAnalysis = await stockfish.evaluate(chess, 6, 400);

    const moveResult = chess.move({ from, to, promotion: promotion || 'q' });
    if (!moveResult) return;

    const fenAfter = chess.fen();
    const evalAfter = evaluatePosition(chess);

    // Play sounds
    if (moveResult.captured) sound.playCapture();
    else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) sound.playCastle();
    else if (chess.inCheck()) sound.playCheck();
    else sound.playMove();

    setLastMove({ from: moveResult.from, to: moveResult.to });
    setDisplayFen(fenAfter);

    // Calculate move quality
    // For white, eval decrease is bad; for black, eval increase is bad
    const diff = playerColor === 'w' ? evalBefore - evalAfter : evalAfter - evalBefore;
    let quality: MoveQuality = 'good';

    if (diff <= 15) quality = 'best';
    else if (diff <= 50) quality = 'great';
    else if (diff <= 130) quality = 'inaccuracy';
    else if (diff <= 280) {
      quality = 'mistake';
      const mistakeQuip = selectedBot.quips.blunderCaught[Math.floor(Math.random() * selectedBot.quips.blunderCaught.length)];
      if (mistakeQuip) setBotComment(mistakeQuip);
    } else {
      quality = 'blunder';
      const blunderQuip = selectedBot.quips.blunderCaught[Math.floor(Math.random() * selectedBot.quips.blunderCaught.length)];
      if (blunderQuip) setBotComment(blunderQuip);
    }

    // Check if brilliant move (e.g. piece sacrifice leading to huge advantage)
    if (moveResult.captured && diff <= 10 && Math.abs(evalAfter) > 200) {
      quality = 'brilliant';
      const goodQuip = selectedBot.quips.goodMove[Math.floor(Math.random() * selectedBot.quips.goodMove.length)];
      if (goodQuip) setBotComment(goodQuip);
    }

    const evalMove: EvaluatedMove = {
      san: moveResult.san,
      from: moveResult.from,
      to: moveResult.to,
      color: moveResult.color,
      fenBefore,
      fenAfter,
      evalBefore,
      evalAfter,
      bestMoveSan: topAnalysis.bestMove?.san,
      quality,
    };

    setEvaluatedMoves((prev) => [...prev, evalMove]);
    setCurrentMoveIndex((prev) => prev + 1);

    const newAnalysis = analyzePositionTactics(chess, evalAfter);
    setTacticalAnalysis(newAnalysis);

    // Check if Game Over
    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        handleGameOver('win', 'Checkmate');
      } else if (chess.isStalemate()) {
        handleGameOver('draw', 'Stalemate');
      } else if (chess.isThreefoldRepetition()) {
        handleGameOver('draw', 'Threefold Repetition');
      } else {
        handleGameOver('draw', 'Draw');
      }
      return;
    }

    // Trigger Bot Move
    setTimeout(() => {
      makeBotMove(selectedBot);
    }, 400);
  };

  // Inspect move in history
  const handleSelectMoveInHistory = (index: number) => {
    if (index === -1) {
      setDisplayFen(new Chess().fen());
      setCurrentMoveIndex(-1);
      setLastMove(null);
    } else if (index >= 0 && index < evaluatedMoves.length) {
      const target = evaluatedMoves[index];
      setDisplayFen(target.fenAfter);
      setCurrentMoveIndex(index);
      setLastMove({ from: target.from, to: target.to });
    }
  };

  // Active chess instance for board view
  const displayChess = new Chess(displayFen);

  // Format time (mm:ss)
  const formatTime = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onGoogleSignIn={async () => {
          try {
            await loginWithGoogle();
          } catch (e) {
            console.error('Google Auth Error:', e);
          }
        }}
        boardTheme={boardTheme}
        onChangeBoardTheme={setBoardTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main App Container */}
      <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
        {/* TAB 1: HOME PAGE */}
        {currentTab === 'home' && (
          <HomePage
            onStartNewGame={(bot, color, timeSecs) => handleStartGame(bot, color, timeSecs)}
            onSelectTab={setCurrentTab}
            onReviewGame={(game) => setSelectedGameForReview(game)}
            recentGames={games}
            user={user}
            onGoogleSignIn={async () => {
              try {
                await loginWithGoogle();
              } catch (e) {
                console.error(e);
              }
            }}
          />
        )}

        {/* TAB 2: PLAY BOTS (MATCH WORKSPACE) */}
        {currentTab === 'play' && (
          <div className="space-y-6">
            {/* Top Match Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1 bg-slate-950 rounded-xl border border-slate-800">
                  {selectedBot.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-white">{selectedBot.name}</h2>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      selectedBot.id === 'stockultra'
                        ? 'bg-rose-500/25 text-rose-300 border-rose-500/60 font-black'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}>
                      {selectedBot.elo >= 1000000 ? '50,000,000 PTS' : `${selectedBot.elo} ELO`}
                    </span>
                    <span className={`text-xs font-semibold hidden sm:inline ${
                      selectedBot.id === 'stockultra' ? 'text-amber-400 font-bold' : 'text-slate-400'
                    }`}>
                      ({selectedBot.title})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    You play as <strong className="text-slate-200">{playerColor === 'w' ? 'White' : 'Black'}</strong> •{' '}
                    {timeControlSeconds > 0 ? `${timeControlSeconds / 60}m Timer` : 'Casual'}
                  </p>
                </div>
              </div>

              {/* In-game clock & quick actions */}
              <div className="flex items-center gap-2">
                {timeControlSeconds > 0 && (
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
                    <div className="px-2 py-1 rounded bg-slate-800 text-slate-200">
                      Bot: {formatTime(botTimeRemaining)}
                    </div>
                    <div className="px-2 py-1 rounded bg-indigo-600 text-white font-bold">
                      You: {formatTime(playerTimeRemaining)}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleStartGame(selectedBot, playerColor, timeControlSeconds)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  title="Restart Game"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Resign this game?')) {
                      handleGameOver('loss', 'Resignation');
                    }
                  }}
                  disabled={isGameOver}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-500/30 disabled:opacity-40"
                  title="Resign Game"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Resign</span>
                </button>
              </div>
            </div>

            {/* Play Workspace Grid: Board (Center/Left), Notation & Analysis (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Chessboard Area (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex gap-2 sm:gap-4 items-stretch justify-center">
                  {/* Dynamic Eval Bar */}
                  <EvalBar
                    evalCp={tacticalAnalysis.evalCp}
                    orientation={playerColor}
                    isMate={tacticalAnalysis.isMate}
                    mateIn={tacticalAnalysis.mateIn}
                  />

                  {/* Interactive Chess Board */}
                  <div className="flex-1 max-w-[580px]">
                    <ChessBoard
                      chess={displayChess}
                      orientation={playerColor}
                      onMove={handlePlayerMove}
                      lastMove={lastMove}
                      bestMoveArrow={tacticalAnalysis.bestMove ? {
                        from: tacticalAnalysis.bestMove.from,
                        to: tacticalAnalysis.bestMove.to,
                      } : null}
                      showBestMoveArrow={showBestMoveArrow}
                      interactive={!isGameOver && currentMoveIndex === evaluatedMoves.length - 1}
                      theme={boardTheme}
                    />
                  </div>
                </div>

                {/* Game End Announcement Card */}
                {isGameOver && (
                  <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {gameResult === 'win' ? <Trophy className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">
                          {gameResult === 'win'
                            ? 'Victory! Checkmate Delivered!'
                            : gameResult === 'loss'
                            ? 'Defeat. The Engine Prevails.'
                            : 'Peace on the Board. Draw.'}
                        </h3>
                        <p className="text-xs text-slate-300">
                          Match concluded via {gameReason}. Game record saved to your profile history.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const latestSaved = games[0];
                          if (latestSaved) setSelectedGameForReview(latestSaved);
                        }}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-colors cursor-pointer"
                      >
                        Review Game Analysis
                      </button>

                      <button
                        onClick={() => handleStartGame(selectedBot, playerColor, timeControlSeconds)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Play Rematch
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Engine Analysis & Move History (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Engine Analysis & Tactical Tips */}
                <EngineAnalysisPanel
                  analysis={tacticalAnalysis}
                  bot={selectedBot}
                  botComment={botComment}
                  isEngineThinking={isEngineThinking}
                  showBestMoveArrow={showBestMoveArrow}
                  onToggleBestMoveArrow={() => setShowBestMoveArrow(!showBestMoveArrow)}
                  showStrategicTips={showStrategicTips}
                  onToggleStrategicTips={() => setShowStrategicTips(!showStrategicTips)}
                />

                {/* Move History Notation */}
                <div className="h-[280px]">
                  <MoveHistory
                    moves={evaluatedMoves}
                    currentMoveIndex={currentMoveIndex}
                    onSelectMove={handleSelectMoveInHistory}
                    pgn={chess.pgn()}
                  />
                </div>
              </div>
            </div>

            {/* Bot Switcher Drawer */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <BotSelector
                selectedBot={selectedBot}
                onSelectBot={(bot) => {
                  setSelectedBot(bot);
                  handleStartGame(bot, playerColor, timeControlSeconds);
                }}
                playerColor={playerColor}
                onChangePlayerColor={(c) => {
                  if (c === 'random') {
                    setPlayerColor(Math.random() > 0.5 ? 'w' : 'b');
                  } else {
                    setPlayerColor(c);
                  }
                }}
                timeControlSeconds={timeControlSeconds}
                onChangeTimeControl={setTimeControlSeconds}
                onStartGame={() => handleStartGame(selectedBot, playerColor, timeControlSeconds)}
              />
            </div>
          </div>
        )}

        {/* TAB 3: HISTORICAL REPLAY MODE */}
        {currentTab === 'historical' && (
          <HistoricalReplayView boardTheme={boardTheme} />
        )}

        {/* TAB 4: MY GAMES / PROFILE */}
        {currentTab === 'profile' && (
          <div className="space-y-6">
            <UserProfileModal
              user={user}
              games={games}
              onClose={() => setCurrentTab('home')}
              onReviewGame={(g) => setSelectedGameForReview(g)}
              onDeleteGame={(id) => deleteGameFromDb(id, user?.uid).then(() => loadUserGames(user?.uid).then(setGames))}
              onNewGameWithBot={(botId) => {
                const b = CHESS_BOTS.find((bot) => bot.id === botId) || CHESS_BOTS[0];
                handleStartGame(b, 'w', 0);
              }}
            />
          </div>
        )}
      </main>

      {/* Game Review Modal Overlay */}
      {selectedGameForReview && (
        <GameReviewModal
          game={selectedGameForReview}
          onClose={() => setSelectedGameForReview(null)}
          boardTheme={boardTheme}
        />
      )}

      {/* User Profile Modal Overlay */}
      {isProfileOpen && (
        <UserProfileModal
          user={user}
          games={games}
          onClose={() => setIsProfileOpen(false)}
          onReviewGame={(g) => {
            setIsProfileOpen(false);
            setSelectedGameForReview(g);
          }}
          onDeleteGame={(id) => deleteGameFromDb(id, user?.uid).then(() => loadUserGames(user?.uid).then(setGames))}
          onNewGameWithBot={(botId) => {
            setIsProfileOpen(false);
            const b = CHESS_BOTS.find((bot) => bot.id === botId) || CHESS_BOTS[0];
            handleStartGame(b, 'w', 0);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        BotChess • Grandmaster Engine & Strategic Replay System • Real-Time Positional Analysis
      </footer>
    </div>
  );
}
