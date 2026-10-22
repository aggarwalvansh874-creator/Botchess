import { Chess } from 'chess.js';
import type { PieceSymbol, TacticalAnalysis } from '../types/chess';

// Standard PeSTO Piece-Square Tables (middlegame & endgame)
const mg_pawn_table = [
    0,   0,   0,   0,   0,   0,   0,   0,
   98, 134,  61,  95,  68, 126,  34, -11,
   -6,   7,  26,  31,  65,  56,  25, -20,
  -14,  13,   6,  21,  23,  12,  17, -23,
  -27,  -2,  -5,  12,  17,   6,  10, -25,
  -26,  -4,  -4, -10,   3,   3,  33, -12,
  -35,  -1, -20, -23, -15,  24,  38, -22,
    0,   0,   0,   0,   0,   0,   0,   0,
];

const eg_pawn_table = [
    0,   0,   0,   0,   0,   0,   0,   0,
  178, 173, 158, 134, 147, 132, 165, 187,
   94, 100,  85,  67,  56,  53,  82,  84,
   32,  24,  13,   5,  -2,   4,  17,  17,
   13,   9,  -3,  -7,  -7,  -8,   3,  -1,
    4,   7,  -6,   1,   0,  -5,  -1,  -8,
   13,   8,   8,  10,  13,   0,   2,  -7,
    0,   0,   0,   0,   0,   0,   0,   0,
];

const mg_knight_table = [
  -167, -89, -34, -49,  61, -97, -15, -107,
   -73, -41,  72,  36,  23,  62,   7,  -17,
   -47,  60,  37,  65,  84, 129,  73,   44,
    -9,  17,  19,  53,  37,  69,  18,   22,
   -13,   4,  16,  13,  28,  19,  21,   -8,
   -23,  -9,  12,  10,  19,  17,  25,  -16,
   -29, -53, -12,  -3,  -1,  18, -14,  -19,
  -105, -21, -58, -33, -17, -28, -19,  -23,
];

const eg_knight_table = [
  -58, -38, -13, -28, -31, -27, -63, -99,
  -25,  -8, -25,  -2,  -9, -25, -24, -52,
  -24, -20,  10,   9,  -1,  -9, -19, -41,
  -17,   3,  22,  22,  22,  11,   8, -18,
  -18,  -6,  16,  25,  16,  17,   4, -18,
  -23,  -3,  -1,  15,  10,  -3, -20, -22,
  -42, -20, -10,  -5,  -2, -20, -23, -44,
  -29, -51, -23, -15, -22, -18, -50, -64,
];

const mg_bishop_table = [
  -29,   4, -82, -37, -25, -42,   7,  -8,
  -26,  16, -18, -13,  30,  59,  18, -47,
  -16,  37,  43,  40,  35,  50,  37,  -2,
   -4,   5,  19,  50,  37,  37,   7,  -2,
   -6,  13,  13,  26,  34,  12,  10,   4,
    0,  15,  15,  15,  14,  27,  18,  10,
    4,  15,  16,   0,   7,  21,  33,   1,
  -33,  -3, -14, -21, -13, -12, -39, -21,
];

const eg_bishop_table = [
  -14, -21, -11,  -8,  -7,  -9, -17, -24,
   -8,  -4,   7, -12,  -3, -13,  -4, -14,
    2,  -8,   0,  -1,  -2,   6,   0,   4,
   -3,   9,  12,   9,  14,  10,   3,   2,
   -6,   3,  13,  19,   7,  10,  -3,  -9,
  -12,  -3,   8,  10,  13,   3,  -7, -15,
  -14, -18,  -7,  -1,   4,  -9, -15, -27,
  -23,  -9, -23,  -5,  -9, -16,  -5, -17,
];

const mg_rook_table = [
   32,  42,  32,  51,  63,   9,  31,  43,
   27,  32,  58,  62,  80,  67,  26,  44,
   -5,  19,  26,  36,  17,  45,  61,  16,
  -24, -11,   7,  26,  24,  35,  -8, -20,
  -36, -26, -12,  -1,   9,  -7,   6, -23,
  -45, -25, -16, -17,   3,   0,  -5, -33,
  -44, -16, -20,  -9,  -1,  11,  -6, -71,
  -19, -13,   1,  17,  16,   7, -37, -26,
];

const eg_rook_table = [
  13, 10, 18, 15, 12,  12,   8,   5,
  11, 13, 13, 11, -3,   3,   8,   3,
   7,  7,  7,  5,  4,  -3,  -5,  -3,
   4,  3, 13,  1,  2,   1,  -1,   2,
   3,  5,  8,  4, -5,  -6,  -8, -11,
  -4,  0, -5, -1, -7, -12,  -8, -16,
  -6, -6,  0,  2, -9,  -9, -11,  -3,
  -9,  2,  3, -1, -5, -13,   4, -20,
];

const mg_queen_table = [
  -28,   0,  29,  12,  59,  44,  43,  45,
  -24, -39,  -5,   1, -16,  57,  28,  54,
  -13, -17,   7,   8,  29,  56,  47,  57,
  -27, -27, -16, -16,  -1,  17,  -2,   1,
   -9, -26,  -9, -10,  -2,  -4,   3,  -3,
  -14,   2, -11,  -2,  -5,   2,  14,   5,
  -35,  -8,  11,   2,   8,  15,  -3,   1,
   -1, -18,  -9,  10, -15, -25, -48, -18,
];

const eg_queen_table = [
  -9,  22,  22,  27,  27,  19,  10,  20,
 -17,  20,  32,  41,  58,  25,  30,   0,
 -20,   6,   9,  49,  47,  35,  19,   9,
   3,  22,  24,  45,  57,  40,  57,  36,
 -18,  28,  19,  47,  31,  34,  39,  18,
 -16, -27,  15,   6,   9,  17,  10,   5,
 -22, -23, -30, -16, -16, -23, -36, -32,
 -33, -28, -22, -43,  -5, -32, -20, -41,
];

const mg_king_table = [
  -65,  23,  16, -15, -56, -34,   2,  13,
   29,  -1, -20,  -7,  -8,  -4, -38, -29,
   -9,  24,   2, -16, -20,   6,  22, -22,
  -17, -20, -12, -27, -30, -25, -14, -36,
  -49,  -1, -27, -39, -46, -44, -33, -51,
  -14, -14, -22, -46, -44, -30, -15, -27,
    1,   7,  -8, -64, -43, -16,   9,   8,
  -15,  36,  12, -54,   8, -28,  24,  14,
];

const eg_king_table = [
  -74, -35, -18, -18, -11,  15,   4, -17,
  -12,  17,  14,  17,  17,  38,  23,  11,
   10,  17,  23,  15,  20,  45,  44,  13,
   -8,  22,  24,  27,  26,  33,  26,   3,
  -18,  -4,  21,  24,  27,  23,   9, -11,
  -19,  -3,  11,  21,  23,  16,   7,  -9,
  -27, -11,   4,  13,  14,   4,  -5, -17,
  -53, -34, -21, -11, -28, -14, -24, -43,
];

const PIECE_VALUES: Record<PieceSymbol, { mg: number; eg: number }> = {
  p: { mg: 82, eg: 94 },
  n: { mg: 337, eg: 281 },
  b: { mg: 365, eg: 297 },
  r: { mg: 477, eg: 512 },
  q: { mg: 1025, eg: 936 },
  k: { mg: 0, eg: 0 },
};

const GAME_PHASE_WEIGHTS: Record<PieceSymbol, number> = {
  p: 0,
  n: 1,
  b: 1,
  r: 2,
  q: 4,
  k: 0,
};

const TOTAL_PHASE = 24;

export function evaluatePosition(chess: Chess): number {
  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -30000 : 30000;
    }
    return 0; // Draw
  }

  let mgWhite = 0;
  let mgBlack = 0;
  let egWhite = 0;
  let egBlack = 0;
  let gamePhase = 0;

  let whiteBishops = 0;
  let blackBishops = 0;

  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const type = piece.type;
      const isWhite = piece.color === 'w';

      // Phase weight
      gamePhase += GAME_PHASE_WEIGHTS[type];

      // Material
      const val = PIECE_VALUES[type];
      if (isWhite) {
        mgWhite += val.mg;
        egWhite += val.eg;
        if (type === 'b') whiteBishops++;
      } else {
        mgBlack += val.mg;
        egBlack += val.eg;
        if (type === 'b') blackBishops++;
      }

      // PST
      const squareIdx = isWhite ? (7 - r) * 8 + c : r * 8 + c;
      let mgPst = 0;
      let egPst = 0;

      switch (type) {
        case 'p':
          mgPst = mg_pawn_table[squareIdx];
          egPst = eg_pawn_table[squareIdx];
          break;
        case 'n':
          mgPst = mg_knight_table[squareIdx];
          egPst = eg_knight_table[squareIdx];
          break;
        case 'b':
          mgPst = mg_bishop_table[squareIdx];
          egPst = eg_bishop_table[squareIdx];
          break;
        case 'r':
          mgPst = mg_rook_table[squareIdx];
          egPst = eg_rook_table[squareIdx];
          break;
        case 'q':
          mgPst = mg_queen_table[squareIdx];
          egPst = eg_queen_table[squareIdx];
          break;
        case 'k':
          mgPst = mg_king_table[squareIdx];
          egPst = eg_king_table[squareIdx];
          break;
      }

      if (isWhite) {
        mgWhite += mgPst;
        egWhite += egPst;
      } else {
        mgBlack += mgPst;
        egBlack += egPst;
      }
    }
  }

  // Bishop pair bonus
  if (whiteBishops >= 2) {
    mgWhite += 35;
    egWhite += 50;
  }
  if (blackBishops >= 2) {
    mgBlack += 35;
    egBlack += 50;
  }

  // Tapered evaluation interpolation
  const mgPhase = Math.min(24, gamePhase);
  const egPhase = 24 - mgPhase;
  const mgScore = mgWhite - mgBlack;
  const egScore = egWhite - egBlack;

  const score = (mgScore * mgPhase + egScore * egPhase) / TOTAL_PHASE;
  return Math.round(score);
}

// Full tactical & strategic breakdown generator
export function analyzePositionTactics(chess: Chess, currentEvalCp: number): TacticalAnalysis {
  const threats: string[] = [];
  const strategicAdvice: string[] = [];
  const capturedPieces = getCapturedPieces(chess);
  const materialDiff = getMaterialDifference(chess);

  const isCheck = chess.inCheck();
  const turn = chess.turn();
  const side = turn === 'w' ? 'White' : 'Black';
  const otherSide = turn === 'w' ? 'Black' : 'White';

  if (isCheck) {
    threats.push(`${side}'s King is in check! Immediate response required.`);
  }

  // Material evaluation advice
  if (Math.abs(materialDiff) >= 3) {
    const leader = materialDiff > 0 ? 'White' : 'Black';
    strategicAdvice.push(`${leader} has a significant material advantage (+${Math.abs(materialDiff)} pts). Simplify into an endgame.`);
  } else if (materialDiff === 0) {
    strategicAdvice.push('Material is strictly balanced. The outcome hinges on tactical initiative and piece activity.');
  }

  // King safety analysis
  const board = chess.board();
  let whiteKingPos = '';
  let blackKingPos = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p?.type === 'k') {
        const sq = String.fromCharCode(97 + c) + (8 - r);
        if (p.color === 'w') whiteKingPos = sq;
        else blackKingPos = sq;
      }
    }
  }

  if (['e1'].includes(whiteKingPos) && chess.history().length > 12) {
    strategicAdvice.push("White's king remains uncastled in the center; beware of open files.");
  }
  if (['e8'].includes(blackKingPos) && chess.history().length > 12) {
    strategicAdvice.push("Black's king is still uncastled in the center; consider opening diagonals to strike.");
  }

  // Center control check (e4, d4, e5, d5)
  const centerSquares = ['e4', 'd4', 'e5', 'd5'];
  let whiteCenterPawns = 0;
  let blackCenterPawns = 0;
  centerSquares.forEach((sq) => {
    const p = chess.get(sq as any);
    if (p?.type === 'p') {
      if (p.color === 'w') whiteCenterPawns++;
      else blackCenterPawns++;
    }
  });

  if (whiteCenterPawns > blackCenterPawns) {
    strategicAdvice.push('White controls the central space, restricting opponent knight maneuvers.');
  } else if (blackCenterPawns > whiteCenterPawns) {
    strategicAdvice.push('Black has seized valuable central space.');
  }

  // Win probability calculation (Lichess formula)
  const winChanceWhite = Math.round(50 + 50 * (2 / (1 + Math.exp(-0.00368208 * currentEvalCp)) - 1));

  return {
    evalCp: currentEvalCp,
    isMate: Math.abs(currentEvalCp) > 20000,
    mateIn: Math.abs(currentEvalCp) > 20000 ? (30000 - Math.abs(currentEvalCp)) : undefined,
    bestLine: [],
    winChanceWhite: Math.max(0, Math.min(100, winChanceWhite)),
    threats,
    strategicAdvice,
    materialDifference: materialDiff,
    capturedPieces,
  };
}

export function getCapturedPieces(chess: Chess): { white: PieceSymbol[]; black: PieceSymbol[] } {
  const fullSet: Record<PieceSymbol, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
  const currentWhite: Record<PieceSymbol, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
  const currentBlack: Record<PieceSymbol, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.color === 'w') currentWhite[piece.type]++;
        else currentBlack[piece.type]++;
      }
    }
  }

  const whiteCaptured: PieceSymbol[] = [];
  const blackCaptured: PieceSymbol[] = [];

  (['q', 'r', 'b', 'n', 'p'] as PieceSymbol[]).forEach((type) => {
    const missingWhite = Math.max(0, fullSet[type] - currentWhite[type]);
    const missingBlack = Math.max(0, fullSet[type] - currentBlack[type]);

    for (let i = 0; i < missingWhite; i++) whiteCaptured.push(type);
    for (let i = 0; i < missingBlack; i++) blackCaptured.push(type);
  });

  return {
    white: whiteCaptured, // White pieces captured by Black
    black: blackCaptured, // Black pieces captured by White
  };
}

export function getMaterialDifference(chess: Chess): number {
  const simpleVals: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  let whiteSum = 0;
  let blackSum = 0;

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.color === 'w') whiteSum += simpleVals[piece.type];
        else blackSum += simpleVals[piece.type];
      }
    }
  }
  return whiteSum - blackSum;
}
