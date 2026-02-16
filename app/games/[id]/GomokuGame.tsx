"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const SIZE = 15;
const CELL_PX = 28;

function checkWin(board: number[][], r: number, c: number, player: number): boolean {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (let t = 1; t <= 4; t++) {
      const nr = r + dr * t, nc = c + dc * t;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || board[nr][nc] !== player) break;
      count++;
    }
    for (let t = 1; t <= 4; t++) {
      const nr = r - dr * t, nc = c - dc * t;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE || board[nr][nc] !== player) break;
      count++;
    }
    if (count >= 5) return true;
  }
  return false;
}

export default function GomokuGame() {
  const [board, setBoard] = useState<number[][]>(() => Array(SIZE).fill(0).map(() => Array(SIZE).fill(0)));
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState<number | null>(null);

  const play = useCallback((r: number, c: number) => {
    if (winner || board[r][c]) return;
    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = turn;
      if (checkWin(next, r, c, turn)) setWinner(turn);
      return next;
    });
    setTurn((t) => 3 - t);
  }, [board, turn, winner]);

  const reset = useCallback(() => {
    setBoard(Array(SIZE).fill(0).map(() => Array(SIZE).fill(0)));
    setTurn(1);
    setWinner(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-slate-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-slate-500/10 rounded-full blur-[80px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-slate-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(71, 85, 105, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-300" style={{ textShadow: "0 0 10px rgba(148, 163, 184, 0.5)" }}>五子棋</h1>
          {!winner && <span className="text-zinc-400 text-sm">当前: {turn === 1 ? "黑子" : "白子"}</span>}
        </div>
        <div className="inline-block rounded-lg p-1 border border-slate-500/30" style={{ background: "rgba(71, 85, 105, 0.08)" }}>
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${SIZE}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${SIZE}, ${CELL_PX}px)` }}>
            {Array.from({ length: SIZE * SIZE }, (_, i) => {
              const r = Math.floor(i / SIZE), c = i % SIZE;
              const v = board[r][c];
              return (
                <button key={i} type="button" onClick={() => play(r, c)} disabled={!!winner}
                  className="border border-slate-600/50 flex items-center justify-center hover:bg-slate-500/20 transition-colors disabled:cursor-default"
                  style={{ width: CELL_PX, height: CELL_PX }}
                >
                  {v === 1 && <span className="w-4 h-4 rounded-full bg-black shadow-inner" />}
                  {v === 2 && <span className="w-4 h-4 rounded-full bg-white border border-slate-400 shadow-inner" />}
                </button>
              );
            })}
          </div>
        </div>
        {winner && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>{winner === 1 ? "黑方胜" : "白方胜"}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-slate-500/20 border border-slate-500/50 text-slate-300 hover:bg-slate-500/30">再玩一局</button>
          </div>
        )}
      </div>
    </div>
  );
}
