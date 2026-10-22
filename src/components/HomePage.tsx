import React from 'react';
import { User } from 'firebase/auth';
import { BotProfile, StoredGame, PieceColor } from '../types/chess';
import { CHESS_BOTS } from '../data/bots';
import { HISTORICAL_GAMES } from '../data/historicalGames';
import { 
  Play, 
  Swords, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ArrowUpRight, 
  ShieldCheck, 
  RotateCcw,
  Zap,
  LogIn
} from 'lucide-react';

interface HomePageProps {
  onStartNewGame: (bot: BotProfile, color: PieceColor | 'random', timeControlSeconds: number) => void;
  onSelectTab: (tab: 'home' | 'play' | 'historical' | 'profile') => void;
  onReviewGame: (game: StoredGame) => void;
  recentGames: StoredGame[];
  user: User | null;
  onGoogleSignIn: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartNewGame,
  onSelectTab,
  onReviewGame,
  recentGames,
  user,
  onGoogleSignIn,
}) => {
  const [selectedBot, setSelectedBot] = React.useState<BotProfile>(CHESS_BOTS[0]); // Deep Titan default
  const [selectedColor, setSelectedColor] = React.useState<PieceColor | 'random'>('w');
  const [timeSeconds, setTimeSeconds] = React.useState<number>(0);

  // Compute stats
  const totalGames = recentGames.length;
  const wins = recentGames.filter((g) => g.result === 'win').length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const avgAccuracy = totalGames > 0
    ? (recentGames.reduce((acc, g) => acc + (g.playerAccuracy || 0), 0) / totalGames).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Grandmaster AI Engine & Historical Replay Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Out-calculate Grandmasters. <br />
            <span className="bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Master the 64 Squares.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Battle against <strong className="text-rose-400 font-black">StockUltra (50,000,000 PTS)</strong>, Deep Titan, and master-crafted bot personalities. 
            Experience absolute tactical calculation, real-time positional analysis, and historical masteries.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onStartNewGame(selectedBot, selectedColor, timeSeconds)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-transform transform active:scale-95 cursor-pointer text-sm"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start New Game</span>
            </button>

            <button
              onClick={() => onSelectTab('historical')}
              className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Historical Replays</span>
            </button>

            {!user && (
              <button
                onClick={onGoogleSignIn}
                className="px-4 py-3 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-semibold rounded-xl text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Google Sync</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick New Game Setup Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-indigo-400" />
              <span>New Game Quick Start</span>
            </h2>
            <p className="text-xs text-slate-400">
              Pick your opponent, choose your color, and jump straight onto the board.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('play')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View All {CHESS_BOTS.length} Bots</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Bots Picker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CHESS_BOTS.slice(0, 4).map((bot) => {
            const isSelected = selectedBot.id === bot.id;
            const isStockUltra = bot.id === 'stockultra';
            return (
              <div
                key={bot.id}
                onClick={() => setSelectedBot(bot)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isStockUltra
                    ? isSelected
                      ? 'bg-gradient-to-b from-rose-950/90 to-slate-900 border-rose-500 shadow-md ring-1 ring-rose-400'
                      : 'bg-slate-950/70 border-rose-500/40 hover:border-rose-400'
                    : isSelected
                    ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-1 ring-indigo-400'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-2xl ${isStockUltra ? 'filter drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : ''}`}>
                    {bot.avatar}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isStockUltra
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-indigo-300'
                  }`}>
                    {bot.elo >= 1000000 ? '50,000,000 PTS' : `${bot.elo} ELO`}
                  </span>
                </div>
                <div className="mt-2">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{bot.name}</h4>
                  <span className={`text-[9px] uppercase tracking-wider block ${
                    isStockUltra ? 'text-rose-400 font-bold' : 'text-slate-400'
                  }`}>
                    {bot.difficulty}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Options Row */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Side:
            </span>
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedColor('w')}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                  selectedColor === 'w' ? 'bg-slate-100 text-slate-900 shadow' : 'text-slate-400'
                }`}
              >
                White
              </button>
              <button
                onClick={() => setSelectedColor('b')}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                  selectedColor === 'b' ? 'bg-slate-800 text-white shadow' : 'text-slate-400'
                }`}
              >
                Black
              </button>
              <button
                onClick={() => setSelectedColor('random')}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                  selectedColor === 'random' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Random
              </button>
            </div>
          </div>

          <button
            onClick={() => onStartNewGame(selectedBot, selectedColor, timeSeconds)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-transform transform active:scale-95 cursor-pointer ml-auto"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Match vs {selectedBot.name}</span>
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Previous Games on Left, Historical Legends on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Previous Games (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Your Recent Games</span>
              </h3>
              <p className="text-xs text-slate-400">
                Review your moves, check blunder reports, and improve your gameplay.
              </p>
            </div>

            <button
              onClick={() => onSelectTab('profile')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>All History</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {recentGames.length === 0 ? (
            <div className="text-center py-10 bg-slate-950/50 rounded-xl border border-dashed border-slate-800 p-6 space-y-2">
              <Swords className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-300">No games recorded yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Play a game against any bot to store and review your game history here!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentGames.slice(0, 4).map((game) => (
                <div
                  key={game.id}
                  className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono ${
                        game.result === 'win'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : game.result === 'loss'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {game.result}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{game.botName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {game.botElo} ELO
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{game.date}</span>
                        <span>•</span>
                        <span>{game.movesCount} plies</span>
                        <span>•</span>
                        <span className="text-cyan-400 font-semibold">{game.playerAccuracy.toFixed(1)}% Acc</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onReviewGame(game)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Review</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Historical Replay Highlights (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Historical Masterpieces</span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore legendary games with move suggestions.
              </p>
            </div>

            <button
              onClick={() => onSelectTab('historical')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Library</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {HISTORICAL_GAMES.slice(0, 3).map((hist) => (
              <div
                key={hist.id}
                onClick={() => onSelectTab('historical')}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 rounded-xl p-3.5 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] text-amber-400/90 font-mono mb-1">
                  <span>{hist.event} • {hist.year}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {hist.result}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {hist.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {hist.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
