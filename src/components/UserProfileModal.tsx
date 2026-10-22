import React from 'react';
import { User } from 'firebase/auth';
import { StoredGame } from '../types/chess';
import { loginWithGoogle, logoutUser } from '../lib/auth';
import { 
  X, 
  LogOut, 
  Trophy, 
  Flame, 
  Target, 
  Swords, 
  Trash2, 
  ExternalLink,
  Shield,
  Clock
} from 'lucide-react';

interface UserProfileModalProps {
  user: User | null;
  games: StoredGame[];
  onClose: () => void;
  onReviewGame: (game: StoredGame) => void;
  onDeleteGame: (gameId: string) => void;
  onNewGameWithBot: (botId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  games,
  onClose,
  onReviewGame,
  onDeleteGame,
  onNewGameWithBot,
}) => {
  // Aggregate stats
  const totalGames = games.length;
  const wins = games.filter((g) => g.result === 'win').length;
  const losses = games.filter((g) => g.result === 'loss').length;
  const draws = games.filter((g) => g.result === 'draw').length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  const totalAccuracySum = games.reduce((acc, g) => acc + (g.playerAccuracy || 0), 0);
  const avgAccuracy = totalGames > 0 ? (totalAccuracySum / totalGames).toFixed(1) : '0.0';

  // Highest bot defeated
  const wonGames = games.filter((g) => g.result === 'win');
  let highestBotDefeated = 'None';
  let highestEloDefeated = 0;
  wonGames.forEach((g) => {
    if (g.botElo > highestEloDefeated) {
      highestEloDefeated = g.botElo;
      highestBotDefeated = `${g.botName} (${g.botElo >= 1000000 ? '50,000,000 PTS' : `${g.botElo} ELO`})`;
    }
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center text-lg font-bold text-indigo-300">
                {user?.displayName ? user.displayName[0].toUpperCase() : '👤'}
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{user?.displayName || 'Chess Contender (Guest)'}</span>
                {user && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Google Synced
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {user?.email || 'Sign in with Google to sync your career stats across devices'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={async () => {
                  await logoutUser();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await loginWithGoogle();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <span>Google Sign-In</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4 sm:p-5 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/40">
          <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Games Played
            </span>
            <span className="text-2xl font-extrabold text-white font-mono">{totalGames}</span>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {wins}W • {losses}L • {draws}D
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Win Rate
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{winRate}%</span>
            <div className="text-[10px] text-emerald-500/80 mt-0.5">Across all bots</div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Avg. Accuracy
            </span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{avgAccuracy}%</span>
            <div className="text-[10px] text-cyan-500/80 mt-0.5">Engine evaluated</div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Best Defeated
            </span>
            <span className="text-sm font-bold text-amber-300 block truncate" title={highestBotDefeated}>
              {highestBotDefeated}
            </span>
            <div className="text-[10px] text-amber-500/80 mt-0.5">Highest ELO win</div>
          </div>
        </div>

        {/* Stored Previous Games List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Career Game History & Review</span>
            </h4>
            <span className="text-xs text-slate-500">
              {games.length} {games.length === 1 ? 'game' : 'games'} recorded
            </span>
          </div>

          {games.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl p-6">
              <Swords className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h5 className="text-sm font-bold text-slate-300">No games recorded yet</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Start a new match against any bot. Your games will be saved here automatically with complete engine analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {games.map((g) => (
                <div
                  key={g.id}
                  className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono ${
                        g.result === 'win'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : g.result === 'loss'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {g.result}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{g.botName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {g.botElo >= 1000000 ? '50,000,000 PTS' : `${g.botElo} ELO`}
                        </span>
                        <span className="text-xs text-slate-500">
                          • {g.playerColor === 'w' ? 'White' : 'Black'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{g.date}</span>
                        <span>•</span>
                        <span>{g.movesCount} moves</span>
                        <span>•</span>
                        <span className="text-cyan-400 font-semibold">{g.playerAccuracy.toFixed(1)}% Acc</span>
                        <span>•</span>
                        <span className="text-slate-500 italic">({g.reason})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onReviewGame(g)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Delete this game record?')) {
                          onDeleteGame(g.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete game"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
