import React, { useState, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPiece } from './ChessPiece';
import { PieceColor, PieceSymbol } from '../types/chess';

export type BoardThemeId = 'wood' | 'emerald' | 'cyber' | 'slate';

interface BoardTheme {
  name: string;
  light: string;
  dark: string;
  highlightSelected: string;
  highlightLastMove: string;
  border: string;
}

export const BOARD_THEMES: Record<BoardThemeId, BoardTheme> = {
  emerald: {
    name: 'Tournament Emerald',
    light: '#ebecd0',
    dark: '#779556',
    highlightSelected: 'rgba(247, 247, 105, 0.55)',
    highlightLastMove: 'rgba(186, 202, 68, 0.45)',
    border: 'border-emerald-950',
  },
  wood: {
    name: 'Classic Walnut',
    light: '#f0d9b5',
    dark: '#b58863',
    highlightSelected: 'rgba(255, 230, 110, 0.55)',
    highlightLastMove: 'rgba(205, 170, 100, 0.45)',
    border: 'border-amber-950',
  },
  cyber: {
    name: 'Cyber Obsidian',
    light: '#334155',
    dark: '#0f172a',
    highlightSelected: 'rgba(56, 189, 248, 0.45)',
    highlightLastMove: 'rgba(99, 102, 241, 0.35)',
    border: 'border-slate-800',
  },
  slate: {
    name: 'Nordic Slate',
    light: '#cbd5e1',
    dark: '#64748b',
    highlightSelected: 'rgba(253, 224, 71, 0.55)',
    highlightLastMove: 'rgba(148, 163, 184, 0.45)',
    border: 'border-slate-700',
  },
};

interface ChessBoardProps {
  chess: Chess;
  orientation?: PieceColor;
  onMove?: (from: Square, to: Square, promotion?: PieceSymbol) => void;
  lastMove?: { from: string; to: string } | null;
  bestMoveArrow?: { from: string; to: string } | null;
  showBestMoveArrow?: boolean;
  interactive?: boolean;
  theme?: BoardThemeId;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  orientation = 'w',
  onMove,
  lastMove,
  bestMoveArrow,
  showBestMoveArrow = false,
  interactive = true,
  theme = 'emerald',
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const currentTheme = BOARD_THEMES[theme] || BOARD_THEMES.emerald;
  const board = chess.board();
  const turn = chess.turn();
  const isCheck = chess.inCheck();

  // Find King square in check
  let checkSquare: Square | null = null;
  if (isCheck) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          checkSquare = piece.square as Square;
        }
      }
    }
  }

  // Legal moves from selected square
  const legalMovesForSelected = selectedSquare
    ? chess.moves({ square: selectedSquare, verbose: true })
    : [];

  const legalTargetSquares = new Set(legalMovesForSelected.map((m) => m.to));

  const handleSquareClick = (square: Square) => {
    if (!interactive) return;

    // If already selected, check if clicked square is a legal destination
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      const move = legalMovesForSelected.find((m) => m.to === square);
      if (move) {
        // Check for promotion
        const piece = chess.get(selectedSquare);
        const isPromotion =
          piece?.type === 'p' &&
          ((piece.color === 'w' && square[1] === '8') ||
            (piece.color === 'b' && square[1] === '1'));

        if (isPromotion) {
          setPendingPromotion({ from: selectedSquare, to: square });
          return;
        }

        if (onMove) {
          onMove(selectedSquare, square);
        }
        setSelectedSquare(null);
        return;
      }
    }

    // Otherwise, select piece if it matches the side to move
    const piece = chess.get(square);
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  };

  const handlePromotionSelect = (promoPiece: PieceSymbol) => {
    if (pendingPromotion && onMove) {
      onMove(pendingPromotion.from, pendingPromotion.to, promoPiece);
    }
    setPendingPromotion(null);
    setSelectedSquare(null);
  };

  // Convert square like "e4" to pixel coordinates for SVG Arrow overlay
  const getSquareCoordinates = (squareStr: string) => {
    const file = squareStr.charCodeAt(0) - 97; // 0 to 7
    const rank = parseInt(squareStr[1], 10) - 1; // 0 to 7

    const col = orientation === 'w' ? file : 7 - file;
    const row = orientation === 'w' ? 7 - rank : rank;

    // percentage center
    return {
      x: col * 12.5 + 6.25,
      y: row * 12.5 + 6.25,
    };
  };

  const ranks = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const files = orientation === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

  return (
    <div className="relative select-none w-full aspect-square max-w-[620px] mx-auto shadow-2xl rounded-xl overflow-hidden border-4 border-slate-800">
      <div
        ref={boardRef}
        className="w-full h-full grid grid-cols-8 grid-rows-8 relative"
      >
        {ranks.map((rank, rIdx) =>
          files.map((file, fIdx) => {
            const square = `${file}${rank}` as Square;
            const isLight = (rIdx + fIdx) % 2 === 0;
            const piece = chess.get(square);
            const isSelected = selectedSquare === square;
            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
            const isLegalTarget = legalTargetSquares.has(square);
            const isCaptureTarget = isLegalTarget && piece !== null;
            const isInCheck = checkSquare === square;

            // Background color logic
            let bgStyle = isLight ? currentTheme.light : currentTheme.dark;

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                style={{ backgroundColor: bgStyle }}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-75`}
              >
                {/* Last move highlight */}
                {isLastMove && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: currentTheme.highlightLastMove }}
                  />
                )}

                {/* Selected square highlight */}
                {isSelected && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: currentTheme.highlightSelected }}
                  />
                )}

                {/* Check warning red glow on King */}
                {isInCheck && (
                  <div className="absolute inset-0 bg-red-600/60 animate-pulse pointer-events-none rounded-sm" />
                )}

                {/* Legal Move Dot */}
                {isLegalTarget && !isCaptureTarget && (
                  <div className="absolute w-3.5 h-3.5 rounded-full bg-slate-900/35 pointer-events-none z-10" />
                )}

                {/* Capture Ring Indicator */}
                {isCaptureTarget && (
                  <div className="absolute inset-1.5 rounded-full border-4 border-slate-900/35 pointer-events-none z-10" />
                )}

                {/* Chess Piece */}
                {piece && (
                  <div className="w-[86%] h-[86%] z-20 flex items-center justify-center filter drop-shadow-md">
                    <ChessPiece type={piece.type} color={piece.color} />
                  </div>
                )}

                {/* Coordinates */}
                {fIdx === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[10px] sm:text-xs font-bold pointer-events-none font-mono opacity-65 ${
                      isLight ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {rIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-bold pointer-events-none font-mono opacity-65 ${
                      isLight ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    {file}
                  </span>
                )}
              </div>
            );
          })
        )}

        {/* Engine Best Move Arrow Overlay */}
        {showBestMoveArrow && bestMoveArrow && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
            <defs>
              <marker
                id="arrowhead-best"
                markerWidth="6"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="#10B981" fillOpacity="0.85" />
              </marker>
            </defs>
            {(() => {
              const start = getSquareCoordinates(bestMoveArrow.from);
              const end = getSquareCoordinates(bestMoveArrow.to);
              return (
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead-best)"
                />
              );
            })()}
          </svg>
        )}
      </div>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl text-center max-w-xs w-full">
            <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">
              Choose Promotion
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {(['q', 'r', 'b', 'n'] as PieceSymbol[]).map((pieceType) => (
                <button
                  key={pieceType}
                  onClick={() => handlePromotionSelect(pieceType)}
                  className="p-3 bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500 rounded-lg flex items-center justify-center transition-all cursor-pointer aspect-square"
                >
                  <ChessPiece type={pieceType} color={chess.turn()} className="w-10 h-10" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
