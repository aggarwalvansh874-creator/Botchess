export type PieceColor = 'w' | 'b';
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface BotProfile {
  id: string;
  name: string;
  title: string;
  elo: number;
  avatar: string;
  description: string;
  playStyle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master' | 'Grandmaster' | 'Engine Overlord' | 'Singularity God';
  colorTheme: string;
  engineDepth: number;
  blunderRate: number; // 0 to 1
  quips: {
    start: string[];
    win: string[];
    loss: string[];
    blunderCaught: string[];
    goodMove: string[];
  };
}

export type MoveQuality = 'brilliant' | 'great' | 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'book';

export interface EvaluatedMove {
  san: string;
  from: string;
  to: string;
  color: PieceColor;
  fenBefore: string;
  fenAfter: string;
  evalBefore: number; // centipawns or mate score
  evalAfter: number;
  bestMoveSan?: string;
  quality: MoveQuality;
  explanation?: string;
}

export interface StoredGame {
  id: string;
  userId: string;
  date: string;
  timestamp: number;
  botId: string;
  botName: string;
  botElo: number;
  playerColor: PieceColor;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  pgn: string;
  movesCount: number;
  playerAccuracy: number;
  botAccuracy: number;
  blundersCount: number;
  mistakesCount: number;
  brilliantCount: number;
  evalHistory: number[];
  moves: EvaluatedMove[];
}

export interface HistoricalGame {
  id: string;
  title: string;
  subtitle: string;
  event: string;
  year: number;
  white: { name: string; title: string; elo?: number };
  black: { name: string; title: string; elo?: number };
  result: '1-0' | '0-1' | '1/2-1/2';
  eco: string;
  openingName: string;
  pgn: string;
  description: string;
  keyMoments: {
    moveIndex: number; // 0-based move half-step
    title: string;
    description: string;
    whyBrilliant: string;
    alternativesConsidered: string;
  }[];
}

export interface TacticalAnalysis {
  evalCp: number;
  isMate: boolean;
  mateIn?: number;
  bestMove?: { from: string; to: string; san?: string; promotion?: string };
  bestLine: string[];
  winChanceWhite: number; // 0 - 100
  threats: string[];
  strategicAdvice: string[];
  materialDifference: number; // positive = white advantage
  capturedPieces: {
    white: PieceSymbol[];
    black: PieceSymbol[];
  };
}
