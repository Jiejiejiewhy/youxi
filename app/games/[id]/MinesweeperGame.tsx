"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const ROWS = 9;
const COLS = 9;
const MINES = 10;
const CELL_PX = 32;

type CellState = "hidden" | "revealed" | "flagged";

function getNeighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
    }
  }
  return out;
}

function placeMines(excludeR: number, excludeC: number): boolean[][] {
  const mines = Array(ROWS)
    .fill(0)
    .map(() => Array(COLS).fill(false));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (mines[r][c]) continue;
    if (r === excludeR && c === excludeC) continue;
    mines[r][c] = true;
    placed++;
  }
  return mines;
}

function countAdjacentMines(mines: boolean[][], r: number, c: number): number {
  return getNeighbors(r, c).filter(([nr, nc]) => mines[nr][nc]).length;
}

function revealRecursive(
  mines: boolean[][],
  counts: number[][],
  revealed: boolean[][],
  r: number,
  c: number
): boolean[][] {
  const next = revealed.map((row) => [...row]);
  const stack: [number, number][] = [[r, c]];
  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!;
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS || next[cr][cc]) continue;
    next[cr][cc] = true;
    if (counts[cr][cc] === 0 && !mines[cr][cc]) {
      for (const [nr, nc] of getNeighbors(cr, cc)) stack.push([nr, nc]);
    }
  }
  return next;
}

const NUM_COLORS: Record<number, string> = {
  1: "text-blue-400",
  2: "text-green-500",
  3: "text-red-500",
  4: "text-indigo-400",
  5: "text-amber-600",
  6: "text-cyan-400",
  7: "text-zinc-300",
  8: "text-zinc-400",
};

export default function MinesweeperGame() {
  const [mines, setMines] = useState<boolean[][] | null>(null);
  const [counts, setCounts] = useState<number[][]>([]);
  const [revealed, setRevealed] = useState<boolean[][]>(() =>
    Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(false))
  );
  const [flagged, setFlagged] = useState<boolean[][]>(() =>
    Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(false))
  );
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);
  const [started, setStarted] = useState(false);

  const reset = useCallback(() => {
    setMines(null);
    setCounts([]);
    setRevealed(
      Array(ROWS)
        .fill(0)
        .map(() => Array(COLS).fill(false))
    );
    setFlagged(
      Array(ROWS)
        .fill(0)
        .map(() => Array(COLS).fill(false))
    );
    setGameOver(null);
    setStarted(false);
  }, []);

  const initOnFirstClick = useCallback((clickR: number, clickC: number) => {
    const newMines = placeMines(clickR, clickC);
    const newCounts = Array(ROWS)
      .fill(0)
      .map((_, r) =>
        Array(COLS)
          .fill(0)
          .map((_, c) => countAdjacentMines(newMines, r, c))
      );
    setMines(newMines);
    setCounts(newCounts);
    setStarted(true);
    return { mines: newMines, counts: newCounts };
  }, []);

  const handleReveal = useCallback(
    (r: number, c: number) => {
      if (gameOver || flagged[r][c]) return;
      let gridMines = mines;
      let gridCounts = counts;
      if (!started) {
        const init = initOnFirstClick(r, c);
        gridMines = init.mines;
        gridCounts = init.counts;
      }
      if (gridMines![r][c]) {
        setRevealed((prev) => {
          const next = prev.map((row) => [...row]);
          for (let rr = 0; rr < ROWS; rr++) for (let cc = 0; cc < COLS; cc++) if (gridMines![rr][cc]) next[rr][cc] = true;
          return next;
        });
        setGameOver("lose");
        return;
      }
      setRevealed((prev) => {
        const next = revealRecursive(gridMines!, gridCounts!, prev, r, c);
        const total = ROWS * COLS - MINES;
        let rev = 0;
        for (let rr = 0; rr < ROWS; rr++) for (let cc = 0; cc < COLS; cc++) if (next[rr][cc]) rev++;
        if (rev === total) setGameOver("win");
        return next;
      });
    },
    [gameOver, flagged, mines, counts, started, initOnFirstClick]
  );



  const handleRightClick = useCallback(
    (e: React.MouseEvent, r: number, c: number) => {
      e.preventDefault();
      if (gameOver || revealed[r][c]) return;
      setFlagged((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = !next[r][c];
        return next;
      });
    },
    [gameOver, revealed]
  );

  const flagCount = flagged.flat().filter(Boolean).length;
  const displayCounts = mines ? counts : Array(ROWS).fill(0).map(() => Array(COLS).fill(0));

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-zinc-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-slate-500/10 rounded-full blur-[80px]" />
      </div>
      <Link
        href="/"
        className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors"
        style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}
      >
        ← 返回大厅
      </Link>
      <div
        className="relative rounded-2xl border-2 border-zinc-500/40 bg-black/50 backdrop-blur-sm p-6"
        style={{ boxShadow: "0 0 25px rgba(113, 113, 122, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-xl font-bold text-zinc-300"
            style={{ textShadow: "0 0 10px rgba(161, 161, 170, 0.5)" }}
          >
            扫雷
          </h1>
          <span className="text-zinc-400 text-sm">
            剩余: <span className="text-amber-400 font-mono font-bold">{MINES - flagCount}</span> 雷
          </span>
        </div>
        <div
          className="rounded-lg overflow-hidden border border-zinc-500/30 inline-block"
          style={{
            background: "rgba(113, 113, 122, 0.08)",
            boxShadow: "0 0 15px rgba(113, 113, 122, 0.15)",
          }}
        >
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: `repeat(${COLS}, ${CELL_PX}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${CELL_PX}px)`,
            }}
          >
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              const r = Math.floor(i / COLS);
              const c = i % COLS;
              const rev = revealed[r][c];
              const flag = flagged[r][c];
              const isMine = mines?.[r]?.[c];
              const count = displayCounts[r]?.[c] ?? 0;
              return (
                <button
                  key={i}
                  type="button"
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  onClick={() => handleReveal(r, c)}
                  className={`flex items-center justify-center text-sm font-bold rounded-sm transition-colors select-none ${
                    rev
                      ? "bg-zinc-800/80 text-zinc-200 cursor-default"
                      : "bg-zinc-700/80 hover:bg-zinc-600/80 cursor-pointer border border-zinc-600/50"
                  }`}
                  style={{
                    width: CELL_PX,
                    height: CELL_PX,
                    boxShadow: rev ? undefined : "inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  {rev && isMine && <span className="text-red-500">💣</span>}
                  {rev && !isMine && count > 0 && (
                    <span className={NUM_COLORS[count] ?? "text-zinc-300"}>{count}</span>
                  )}
                  {!rev && flag && <span className="text-amber-400">🚩</span>}
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">左键翻开 · 右键标记雷</p>
        {gameOver === "lose" && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p
              className="text-2xl font-bold text-red-400"
              style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}
            >
              踩雷了！
            </p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 rounded-lg bg-zinc-500/20 border border-zinc-500/50 text-zinc-300 hover:bg-zinc-500/30 transition-colors"
              style={{ boxShadow: "0 0 15px rgba(113, 113, 122, 0.2)" }}
            >
              再玩一次
            </button>
          </div>
        )}
        {gameOver === "win" && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p
              className="text-2xl font-bold text-green-400"
              style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}
            >
              恭喜过关！
            </p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 rounded-lg bg-zinc-500/20 border border-zinc-500/50 text-zinc-300 hover:bg-zinc-500/30 transition-colors"
              style={{ boxShadow: "0 0 15px rgba(113, 113, 122, 0.2)" }}
            >
              再玩一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
