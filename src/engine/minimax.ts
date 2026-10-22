import { Chess } from 'chess.js';
import { evaluatePosition } from './evaluator';

export interface SearchResult {
  bestMove: { from: string; to: string; promotion?: string; san: string } | null;
  score: number; // centipawns from White perspective
  depth: number;
  nodes: number;
  pv: string[];
}

const TT_FLAG_EXACT = 0;
const TT_FLAG_LOWERBOUND = 1;
const TT_FLAG_UPPERBOUND = 2;

interface TTEntry {
  depth: number;
  score: number;
  flag: number;
  bestMoveSan?: string;
}

const transpositionTable = new Map<string, TTEntry>();
const MAX_TT_SIZE = 150000;

const VICTIM_SCORES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

function scoreMove(move: any): number {
  let score = 0;
  // MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
  if (move.captured) {
    const victimVal = VICTIM_SCORES[move.captured] || 100;
    const attackerVal = VICTIM_SCORES[move.piece] || 100;
    score += 10000 + victimVal * 10 - attackerVal;
  }
  // Promotion bonus
  if (move.promotion) {
    score += 8000;
  }
  // Check bonus
  if (move.san?.includes('+')) {
    score += 500;
  }
  return score;
}

function orderMoves(moves: any[]): any[] {
  return moves.slice().sort((a, b) => scoreMove(b) - scoreMove(a));
}

// Quiescence Search: examines captures to avoid horizon effect
function quiescence(chess: Chess, alpha: number, beta: number, isMaximizing: boolean, qDepth = 4): number {
  const standPat = evaluatePosition(chess);

  if (qDepth === 0) return standPat;

  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    // Only look at capture moves
    const legalMoves = chess.moves({ verbose: true }).filter((m) => m.captured || m.promotion);
    const sortedMoves = orderMoves(legalMoves);

    for (const move of sortedMoves) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, false, qDepth - 1);
      chess.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (standPat < beta) beta = standPat;

    const legalMoves = chess.moves({ verbose: true }).filter((m) => m.captured || m.promotion);
    const sortedMoves = orderMoves(legalMoves);

    for (const move of sortedMoves) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, true, qDepth - 1);
      chess.undo();

      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

// Minimax with Alpha-Beta
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  stats: { nodes: number },
  deadline: number
): { score: number; bestMove: any } {
  stats.nodes++;

  if (Date.now() > deadline && depth > 2) {
    return { score: evaluatePosition(chess), bestMove: null };
  }

  const fen = chess.fen();
  const ttEntry = transpositionTable.get(fen);
  if (ttEntry && ttEntry.depth >= depth) {
    if (ttEntry.flag === TT_FLAG_EXACT) {
      return { score: ttEntry.score, bestMove: null };
    } else if (ttEntry.flag === TT_FLAG_LOWERBOUND && ttEntry.score > alpha) {
      alpha = ttEntry.score;
    } else if (ttEntry.flag === TT_FLAG_UPPERBOUND && ttEntry.score < beta) {
      beta = ttEntry.score;
    }
    if (alpha >= beta) {
      return { score: ttEntry.score, bestMove: null };
    }
  }

  if (chess.isGameOver()) {
    return { score: evaluatePosition(chess), bestMove: null };
  }

  if (depth === 0) {
    return { score: quiescence(chess, alpha, beta, isMaximizing), bestMove: null };
  }

  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) {
    return { score: evaluatePosition(chess), bestMove: null };
  }

  const sortedMoves = orderMoves(legalMoves);
  let bestMove = sortedMoves[0];
  const origAlpha = alpha;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of sortedMoves) {
      chess.move(move);
      const result = minimax(chess, depth - 1, alpha, beta, false, stats, deadline);
      chess.undo();

      if (result.score > maxEval) {
        maxEval = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break; // Beta cutoff
    }

    // Save to TT
    let flag = TT_FLAG_EXACT;
    if (maxEval <= origAlpha) flag = TT_FLAG_UPPERBOUND;
    else if (maxEval >= beta) flag = TT_FLAG_LOWERBOUND;

    if (transpositionTable.size < MAX_TT_SIZE) {
      transpositionTable.set(fen, { depth, score: maxEval, flag, bestMoveSan: bestMove?.san });
    }

    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    for (const move of sortedMoves) {
      chess.move(move);
      const result = minimax(chess, depth - 1, alpha, beta, true, stats, deadline);
      chess.undo();

      if (result.score < minEval) {
        minEval = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, result.score);
      if (beta <= alpha) break; // Alpha cutoff
    }

    let flag = TT_FLAG_EXACT;
    if (minEval <= origAlpha) flag = TT_FLAG_UPPERBOUND;
    else if (minEval >= beta) flag = TT_FLAG_LOWERBOUND;

    if (transpositionTable.size < MAX_TT_SIZE) {
      transpositionTable.set(fen, { depth, score: minEval, flag, bestMoveSan: bestMove?.san });
    }

    return { score: minEval, bestMove };
  }
}

// Iterative Deepening Search
export function findBestMove(
  chess: Chess,
  maxDepth = 4,
  maxTimeMs = 1200
): SearchResult {
  const stats = { nodes: 0 };
  const deadline = Date.now() + maxTimeMs;
  const isMaximizing = chess.turn() === 'w';

  let currentBestMove: any = null;
  let currentScore = evaluatePosition(chess);
  let reachedDepth = 1;

  for (let d = 1; d <= maxDepth; d++) {
    if (Date.now() >= deadline && d > 2) break;

    const res = minimax(chess, d, -Infinity, Infinity, isMaximizing, stats, deadline);
    if (res.bestMove) {
      currentBestMove = res.bestMove;
      currentScore = res.score;
      reachedDepth = d;
    }
  }

  // Extract PV
  const pv: string[] = [];
  if (currentBestMove) {
    pv.push(currentBestMove.san);
  }

  return {
    bestMove: currentBestMove ? {
      from: currentBestMove.from,
      to: currentBestMove.to,
      promotion: currentBestMove.promotion,
      san: currentBestMove.san,
    } : null,
    score: currentScore,
    depth: reachedDepth,
    nodes: stats.nodes,
    pv,
  };
}
