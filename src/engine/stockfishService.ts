import { Chess } from 'chess.js';
import { findBestMove, SearchResult } from './minimax';

class StockfishEngineService {
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private initPromise: Promise<boolean> | null = null;
  private currentCallback: ((data: { bestMove: string; evalCp: number; mate?: number; pv: string[] }) => void) | null = null;
  private isAnalyzing: boolean = false;

  constructor() {
    this.init();
  }

  public async init(): Promise<boolean> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }

      try {
        // Load Stockfish 10 via CDN web worker
        const workerBlob = new Blob([
          `importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.0/stockfish.js');`
        ], { type: 'application/javascript' });

        const workerUrl = URL.createObjectURL(workerBlob);
        this.worker = new Worker(workerUrl);

        this.worker.onmessage = (e) => {
          const line = typeof e.data === 'string' ? e.data : '';
          
          if (line === 'uciok' || line === 'readyok') {
            this.isReady = true;
            resolve(true);
          }

          if (line.startsWith('bestmove')) {
            const parts = line.split(' ');
            const bestMoveUci = parts[1];
            if (this.currentCallback) {
              this.currentCallback({
                bestMove: bestMoveUci,
                evalCp: this.lastEvalCp,
                mate: this.lastMate,
                pv: this.lastPv,
              });
              this.currentCallback = null;
              this.isAnalyzing = false;
            }
          }

          if (line.startsWith('info depth')) {
            // parse score cp or mate
            const scoreCpMatch = line.match(/score cp (-?\d+)/);
            const scoreMateMatch = line.match(/score mate (-?\d+)/);
            const pvMatch = line.match(/ pv (.*)$/);

            if (scoreCpMatch) {
              this.lastEvalCp = parseInt(scoreCpMatch[1], 10);
              this.lastMate = undefined;
            } else if (scoreMateMatch) {
              this.lastMate = parseInt(scoreMateMatch[1], 10);
              this.lastEvalCp = this.lastMate > 0 ? 30000 - this.lastMate : -30000 - this.lastMate;
            }

            if (pvMatch) {
              this.lastPv = pvMatch[1].split(' ').slice(0, 5);
            }
          }
        };

        this.worker.onerror = () => {
          this.isReady = false;
          resolve(false);
        };

        this.worker.postMessage('uci');
        this.worker.postMessage('isready');

        // Timeout fallback after 3 seconds if CDN worker is blocked
        setTimeout(() => {
          if (!this.isReady) {
            resolve(false);
          }
        }, 3000);
      } catch {
        this.isReady = false;
        resolve(false);
      }
    });

    return this.initPromise;
  }

  private lastEvalCp: number = 0;
  private lastMate?: number;
  private lastPv: string[] = [];

  public async evaluate(
    chess: Chess,
    depth = 12,
    maxTimeMs = 1200
  ): Promise<{
    bestMove: { from: string; to: string; promotion?: string; san?: string } | null;
    score: number;
    depth: number;
    mate?: number;
    pv: string[];
  }> {
    const ready = await this.init();

    // If Stockfish worker is available, use it for 3500+ GM depth
    if (ready && this.worker) {
      try {
        const fen = chess.fen();
        const turn = chess.turn();

        return await new Promise((resolve) => {
          const timeoutId = setTimeout(() => {
            // fallback if worker took too long
            const fallback = findBestMove(chess, 4, 600);
            resolve({
              bestMove: fallback.bestMove,
              score: fallback.score,
              depth: fallback.depth,
              pv: fallback.pv,
            });
          }, maxTimeMs + 500);

          this.currentCallback = (data) => {
            clearTimeout(timeoutId);
            if (!data.bestMove || data.bestMove === '(none)') {
              const fallback = findBestMove(chess, 4, 600);
              resolve({
                bestMove: fallback.bestMove,
                score: fallback.score,
                depth: fallback.depth,
                pv: fallback.pv,
              });
              return;
            }

            const from = data.bestMove.substring(0, 2);
            const to = data.bestMove.substring(2, 4);
            const promotion = data.bestMove.length > 4 ? data.bestMove.substring(4, 5) : undefined;

            // Stockfish reports eval from current side's perspective; convert to White perspective
            let whitePerspectiveScore = data.evalCp;
            if (turn === 'b') {
              whitePerspectiveScore = -data.evalCp;
            }

            resolve({
              bestMove: { from, to, promotion },
              score: whitePerspectiveScore,
              depth,
              mate: data.mate,
              pv: data.pv,
            });
          };

          this.worker!.postMessage(`position fen ${fen}`);
          this.worker!.postMessage(`go depth ${depth} movetime ${maxTimeMs}`);
        });
      } catch {
        // Fallback
      }
    }

    // High performance built-in minimax fallback
    const result: SearchResult = findBestMove(chess, Math.min(depth, 5), maxTimeMs);
    return {
      bestMove: result.bestMove,
      score: result.score,
      depth: result.depth,
      pv: result.pv,
    };
  }

  public stop() {
    if (this.worker && this.isReady) {
      this.worker.postMessage('stop');
    }
  }
}

export const stockfish = new StockfishEngineService();
