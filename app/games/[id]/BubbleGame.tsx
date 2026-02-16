"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const COLS = 9;
const ROWS = 10;
const CELL_PX = 28;
const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7"];

function getConnected(grid: (number | null)[][], r: number, c: number, color: number): [number, number][] {
  const out: [number, number][] = [];
  const vis = new Set<string>();
  const key = (rr: number, cc: number) => `${rr},${cc}`;
  function dfs(rr: number, cc: number) {
    if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS || grid[rr][cc] !== color || vis.has(key(rr, cc))) return;
    vis.add(key(rr, cc));
    out.push([rr, cc]);
    dfs(rr - 1, cc); dfs(rr + 1, cc); dfs(rr, cc - 1); dfs(rr, cc + 1);
  }
  dfs(r, c);
  return out;
}

function dropFloating(grid: (number | null)[][]): (number | null)[][] {
  const next = grid.map((row) => [...row]);
  for (let c = 0; c < COLS; c++) {
    const col = next.map((row) => row[c]).filter((v) => v !== null);
    const empty = ROWS - col.length;
    for (let r = 0; r < ROWS; r++) {
      next[r][c] = r < empty ? null : col[r - empty];
    }
  }
  return next;
}

export default function BubbleGame() {
  const [grid, setGrid] = useState<(number | null)[][]>(() =>
    Array(ROWS).fill(0).map(() => Array(COLS).fill(0).map(() => Math.floor(Math.random() * COLORS.length)))
  );
  const [score, setScore] = useState(0);
  const [nextColor, setNextColor] = useState(() => Math.floor(Math.random() * COLORS.length));

  const shoot = useCallback((col: number) => {
    setGrid((prev) => {
      let r = ROWS - 1;
      while (r >= 0 && prev[r][col] !== null) r--;
      if (r < 0) return prev;
      const next = prev.map((row) => [...row]);
      next[r][col] = nextColor;
      const group = getConnected(next, r, col, nextColor);
      if (group.length >= 3) {
        group.forEach(([rr, cc]) => { next[rr][cc] = null; });
        setScore((s) => s + group.length * 10);
      }
      return dropFloating(next);
    });
    setNextColor(Math.floor(Math.random() * COLORS.length));
  }, [nextColor]);

  const reset = useCallback(() => {
    setGrid(Array(ROWS).fill(0).map(() => Array(COLS).fill(0).map(() => Math.floor(Math.random() * COLORS.length))));
    setScore(0);
    setNextColor(Math.floor(Math.random() * COLORS.length));
  }, []);

  const remaining = grid.flat().filter((v) => v !== null).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-sky-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(14, 165, 233, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-sky-400" style={{ textShadow: "0 0 10px rgba(14, 165, 233, 0.5)" }}>泡泡龙</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-sky-400 font-mono font-bold">{score}</span></span>
        </div>
        <div className="rounded-lg border border-sky-500/30 p-1 inline-block" style={{ background: "rgba(14, 165, 233, 0.08)" }}>
          <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${ROWS}, ${CELL_PX}px)` }}>
            {grid.flat().map((v, i) => {
              const r = Math.floor(i / COLS), c = i % COLS;
              return (
                <button key={i} type="button" onClick={() => shoot(c)} className="rounded-full transition-opacity hover:opacity-90" style={{ width: CELL_PX, height: CELL_PX, background: v !== null ? COLORS[v] : "transparent", boxShadow: v !== null ? `0 0 8px ${COLORS[v]}80` : undefined }} />
              );
            })}
          </div>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-2">下次: <span className="inline-block w-5 h-5 rounded-full" style={{ background: COLORS[nextColor], verticalAlign: "middle" }} /></p>
        <p className="text-center text-zinc-500 text-sm mt-2">点击一列发射泡泡，三连同色消除</p>
        <button type="button" onClick={reset} className="mt-4 w-full py-2 rounded-lg bg-sky-500/20 border border-sky-500/50 text-sky-400 hover:bg-sky-500/30 text-sm">重新开始</button>
      </div>
    </div>
  );
}
