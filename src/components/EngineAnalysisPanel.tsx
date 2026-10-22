import React from 'react';
import { Cpu, Zap, AlertTriangle, ShieldCheck, Compass, Eye, EyeOff } from 'lucide-react';
import { TacticalAnalysis, BotProfile, PieceSymbol } from '../types/chess';
import { ChessPiece } from './ChessPiece';

interface EngineAnalysisPanelProps {
  analysis: TacticalAnalysis;
  bot: BotProfile;
  botComment?: string;
  isEngineThinking?: boolean;
  showBestMoveArrow: boolean;
  onToggleBestMoveArrow: () => void;
  showStrategicTips: boolean;
  onToggleStrategicTips: () => void;
}

export const EngineAnalysisPanel: React.FC<EngineAnalysisPanelProps> = ({
  analysis,
  bot,
  botComment,
  isEngineThinking = false,
  showBestMoveArrow,
  onToggleBestMoveArrow,
  showStrategicTips,
  onToggleStrategicTips,
}) => {
  const evalScore = analysis.isMate
    ? (analysis.evalCp > 0 ? `#M${analysis.mateIn}` : `#-M${analysis.mateIn}`)
    : (analysis.evalCp > 0 ? `+${(analysis.evalCp / 100).toFixed(2)}` : (analysis.evalCp / 100).toFixed(2));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
      {/* Bot Persona Banner & Speech */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 flex items-start gap-3">
        <div className="text-3xl p-1 bg-slate-800/90 rounded-lg border border-slate-700/60 shadow">
          {bot.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-bold text-slate-100 truncate flex items-center gap-1.5">
              <span>{bot.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                bot.id === 'stockultra'
                  ? 'bg-rose-500/25 text-rose-300 border-rose-500/60 font-black'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}>
                {bot.elo >= 1000000 ? '50,000,000 PTS' : `${bot.elo} ELO`}
              </span>
            </h4>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${
              bot.id === 'stockultra' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}>
              {bot.title}
            </span>
          </div>

          <p className="text-xs text-slate-300 italic mt-1 leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800">
            "{botComment || bot.quips.start[0]}"
          </p>

          {bot.id === 'stockultra' && (
            <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-500/15 to-amber-500/15 border border-rose-500/30 text-[10px] text-rose-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Absolute Untouchable Protocol: 0 Pieces Conceded</span>
            </div>
          )}
        </div>
      </div>

      {/* Engine Status & Win Probability Meter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Engine Evaluation</span>
            {isEngineThinking && (
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping ml-1" />
            )}
          </span>
          <span className="font-mono font-bold text-sm text-cyan-300">{evalScore}</span>
        </div>

        {/* Win Probability Bar */}
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          <div
            className="bg-slate-200 transition-all duration-300"
            style={{ width: `${analysis.winChanceWhite}%` }}
            title={`White win chance: ${analysis.winChanceWhite}%`}
          />
          <div
            className="bg-slate-700 transition-all duration-300 flex-1"
            title={`Black win chance: ${100 - analysis.winChanceWhite}%`}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>White: {analysis.winChanceWhite}%</span>
          <span>Black: {100 - analysis.winChanceWhite}%</span>
        </div>
      </div>

      {/* Captured Pieces & Material Imbalance */}
      <div className="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800/80 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Material Imbalance
          </span>
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                analysis.materialDifference > 0
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : analysis.materialDifference < 0
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {analysis.materialDifference > 0
                ? `+${analysis.materialDifference} White`
                : analysis.materialDifference < 0
                ? `+${Math.abs(analysis.materialDifference)} Black`
                : 'Equal'}
            </span>
          </div>
        </div>

        {/* Captured mini-icons */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-0.5 h-4">
            {analysis.capturedPieces.black.slice(0, 8).map((p, i) => (
              <div key={i} className="w-3.5 h-3.5">
                <ChessPiece type={p} color="b" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-0.5 h-4">
            {analysis.capturedPieces.white.slice(0, 8).map((p, i) => (
              <div key={i} className="w-3.5 h-3.5">
                <ChessPiece type={p} color="w" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Move & Hint Controls */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <button
          onClick={onToggleBestMoveArrow}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
            showBestMoveArrow
              ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {showBestMoveArrow ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showBestMoveArrow ? 'Hide Engine Arrow' : 'Show Engine Arrow'}</span>
        </button>

        <button
          onClick={onToggleStrategicTips}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
            showStrategicTips
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Tips</span>
        </button>
      </div>

      {/* Strategic Analysis & Tactical Warnings */}
      {showStrategicTips && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80 animate-in fade-in duration-200">
          {analysis.threats.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Tactical Threats</span>
              </div>
              <ul className="text-xs text-red-300/90 space-y-1 list-disc list-inside">
                {analysis.threats.map((threat, i) => (
                  <li key={i}>{threat}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.strategicAdvice.length > 0 && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strategic Guidance</span>
              </div>
              <ul className="text-xs text-indigo-200/90 space-y-1 list-disc list-inside">
                {analysis.strategicAdvice.map((advice, i) => (
                  <li key={i}>{advice}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
