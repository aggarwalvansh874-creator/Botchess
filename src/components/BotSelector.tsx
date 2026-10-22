import React from 'react';
import { BotProfile, PieceColor } from '../types/chess';
import { CHESS_BOTS } from '../data/bots';
import { Play, Sparkles, Swords, Clock } from 'lucide-react';

interface BotSelectorProps {
  selectedBot: BotProfile;
  onSelectBot: (bot: BotProfile) => void;
  playerColor: PieceColor | 'random';
  onChangePlayerColor: (color: PieceColor | 'random') => void;
  timeControlSeconds: number; // 0 for unlimited
  onChangeTimeControl: (seconds: number) => void;
  onStartGame: () => void;
}

export const BotSelector: React.FC<BotSelectorProps> = ({
  selectedBot,
  onSelectBot,
  playerColor,
  onChangePlayerColor,
  timeControlSeconds,
  onChangeTimeControl,
  onStartGame,
}) => {
  const timeOptions = [
    { label: 'Unlimited', seconds: 0 },
    { label: '3 min Blitz', seconds: 180 },
    { label: '5 min Rapid', seconds: 300 },
    { label: '10 min Classical', seconds: 600 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <Swords className="w-7 h-7 text-indigo-400" />
          <span>Select Your Bot Opponent</span>
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Challenge diverse chess AI personalities ranging from enthusiastic club players to the Grandmaster-crushing Deep Titan engine.
        </p>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CHESS_BOTS.map((bot) => {
          const isSelected = selectedBot.id === bot.id;
          const isStockUltra = bot.id === 'stockultra';
          return (
            <div
              key={bot.id}
              onClick={() => onSelectBot(bot)}
              className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isStockUltra
                  ? isSelected
                    ? 'bg-gradient-to-b from-rose-950/90 via-red-950/80 to-slate-950 border-rose-500 shadow-xl shadow-rose-600/30 ring-2 ring-rose-400'
                    : 'bg-gradient-to-b from-slate-900 via-rose-950/30 to-slate-950 border-rose-500/50 hover:border-rose-400 shadow-lg shadow-rose-950/50'
                  : isSelected
                  ? 'bg-gradient-to-b from-indigo-900/60 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {isStockUltra && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
                  Untouchable
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-3xl ${isStockUltra ? 'filter drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]' : ''}`}>
                    {bot.avatar}
                  </span>
                  <span
                    className={`text-xs font-mono font-black px-2 py-0.5 rounded-full border ${
                      isStockUltra
                        ? 'bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-sm'
                        : 'bg-slate-800 text-indigo-300 border-slate-700'
                    }`}
                  >
                    {bot.elo >= 1000000 ? '50,000,000 PTS' : `${bot.elo} ELO`}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1">
                  <span>{bot.name}</span>
                </h3>
                <span className={`text-[10px] uppercase tracking-wider font-semibold block mb-1.5 ${
                  isStockUltra ? 'text-rose-400 font-bold' : 'text-slate-400'
                }`}>
                  {bot.title}
                </span>

                <p className="text-xs text-slate-400 leading-snug line-clamp-3">
                  {bot.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
                <span className={isStockUltra ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {bot.difficulty}
                </span>
                {isSelected && (
                  <span className={`${isStockUltra ? 'text-rose-400' : 'text-indigo-400'} font-bold flex items-center gap-0.5`}>
                    <Sparkles className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Game Options (Color & Time Control) */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Play As */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Play As:
          </span>
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => onChangePlayerColor('w')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                playerColor === 'w'
                  ? 'bg-slate-100 text-slate-900 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚪ White
            </button>
            <button
              onClick={() => onChangePlayerColor('b')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                playerColor === 'b'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚫ Black
            </button>
            <button
              onClick={() => onChangePlayerColor('random')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                playerColor === 'random'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🎲 Random
            </button>
          </div>
        </div>

        {/* Time Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Clock:
          </span>
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
            {timeOptions.map((opt) => (
              <button
                key={opt.seconds}
                onClick={() => onChangeTimeControl(opt.seconds)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  timeControlSeconds === opt.seconds
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Game Action */}
        <button
          onClick={onStartGame}
          className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform transform active:scale-95 cursor-pointer text-sm"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Start Match vs {selectedBot.name}</span>
        </button>
      </div>
    </div>
  );
};
