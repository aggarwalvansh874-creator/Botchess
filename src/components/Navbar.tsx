import React from 'react';
import { User } from 'firebase/auth';
import { BoardThemeId, BOARD_THEMES } from './ChessBoard';
import { sound } from '../lib/audio';
import { 
  Crown, 
  BookOpen, 
  Swords, 
  History, 
  Volume2, 
  VolumeX, 
  Palette, 
  LogIn, 
  User as UserIcon,
  Home
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'play' | 'historical' | 'profile';
  onSelectTab: (tab: 'home' | 'play' | 'historical' | 'profile') => void;
  user: User | null;
  onOpenProfile: () => void;
  onGoogleSignIn: () => void;
  boardTheme: BoardThemeId;
  onChangeBoardTheme: (theme: BoardThemeId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenProfile,
  onGoogleSignIn,
  boardTheme,
  onChangeBoardTheme,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              Bot<span className="text-amber-400">Chess</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block -mt-1 tracking-wider uppercase">
              Grandmaster Engine
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onSelectTab('play')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'play'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Play Bots</span>
          </button>

          <button
            onClick={() => onSelectTab('historical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'historical'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Historical Replays</span>
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'profile'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>My Games</span>
          </button>
        </nav>

        {/* Right Tools & Auth */}
        <div className="flex items-center gap-2">
          {/* Theme selector */}
          <div className="relative group">
            <select
              value={boardTheme}
              onChange={(e) => onChangeBoardTheme(e.target.value as BoardThemeId)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 font-medium cursor-pointer hover:border-slate-700"
              title="Board color theme"
            >
              {Object.entries(BOARD_THEMES).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Google Auth / Profile */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline truncate max-w-[100px]">
                {user.displayName || 'Player'}
              </span>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full border border-indigo-500/50"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold">
                  {user.displayName ? user.displayName[0] : 'P'}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onGoogleSignIn}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google Sign-In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 bg-slate-950 p-1">
        <button
          onClick={() => onSelectTab('home')}
          className={`py-1.5 px-2 text-[11px] font-bold flex items-center gap-1 ${
            currentTab === 'home' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Home className="w-3.5 h-3.5" /> Home
        </button>
        <button
          onClick={() => onSelectTab('play')}
          className={`py-1.5 px-2 text-[11px] font-bold flex items-center gap-1 ${
            currentTab === 'play' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Swords className="w-3.5 h-3.5" /> Play
        </button>
        <button
          onClick={() => onSelectTab('historical')}
          className={`py-1.5 px-2 text-[11px] font-bold flex items-center gap-1 ${
            currentTab === 'historical' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Historical
        </button>
        <button
          onClick={() => onSelectTab('profile')}
          className={`py-1.5 px-2 text-[11px] font-bold flex items-center gap-1 ${
            currentTab === 'profile' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <History className="w-3.5 h-3.5" /> Games
        </button>
      </div>
    </header>
  );
};
