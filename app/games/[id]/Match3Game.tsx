"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const SIZE = 8;
const CELL_PX = 36;
const COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7"];

function findMatches(grid: number[][]): [number, number][] {
  const match: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 2; c++) {
      const v = grid[r][c];
      if (v === grid[r][c + 1] && v === grid[r][c + 2]) {
        match.push([r, c], [r, c + 1], [r, c + 2]);
      }
    }
  }
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 2; r++) {
      const v = grid[r][c];
      if (v === grid[r + 1][c] && v === grid[r + 2][c]) {
        match.push([r, c], [r + 1, c], [r + 2, c]);
      }
    }
  }
  return [...new Set(match.map(([r, c]) => `${r},${c}`))].map((s) => {
    const [r, c] = s.split(",").map(Number);
    return [r, c] as [number, number];
  });
}

function dropGems(grid: number[][]): number[][] {
  const next = grid.map((row) => [...row]);
  for (let c = 0; c < SIZE; c++) {
    const col = next.map((row) => row[c]).filter((v) => v >= 0);
    const fill = Array(SIZE - col.length).fill(-1).concat(col);
    for (let r = 0; r < SIZE; r++) next[r][c] = fill[r] >= 0 ? fill[r] : Math.floor(Math.random() * COLORS.length);
  }
  return next;
}

export default function Match3Game() {
  const [grid, setGrid] = useState<number[][]>(() =>
    Array(SIZE).fill(0).map(() => Array(SIZE).fill(0).map(() => Math.floor(Math.random() * COLORS.length)))
  );
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const swap = useCallback((r1: number, c1: number, r2: number, c2: number) => {
    const dr = Math.abs(r1 - r2), dc = Math.abs(c1 - c2);
    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        [next[r1][c1], next[r2][c2]] = [next[r2][c2], next[r1][c1]];
        const matches = findMatches(next);
        if (matches.length === 0) {
          [next[r1][c1], next[r2][c2]] = [next[r2][c2], next[r1][c1]];
          return prev;
        }
        matches.forEach(([r, c]) => { next[r][c] = -1; });
        setScore((s) => s + matches.length * 10);
        return dropGems(next);
      });
    }
    setSelected(null);
  }, []);

  const handleCell = useCallback((r: number, c: number) => {
    if (selected) {
      if (selected[0] === r && selected[1] === c) setSelected(null);
      else { swap(selected[0], selected[1], r, c); setSelected(null); }
    } else setSelected([r, c]);
  }, [selected, swap]);

  const reset = useCallback(() => {
    setGrid(Array(SIZE).fill(0).map(() => Array(SIZE).fill(0).map(() => Math.floor(Math.random() * COLORS.length))));
    setScore(0);
    setSelected(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-yellow-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(234, 179, 8, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-yellow-400" style={{ textShadow: "0 0 10px rgba(234, 179, 8, 0.5)" }}>消消乐</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-yellow-400 font-mono font-bold">{score}</span></span>
        </div>
        <div className="rounded-lg border border-yellow-500/30 p-1 inline-block" style={{ background: "rgba(234, 179, 8, 0.06)" }}>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SIZE}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${SIZE}, ${CELL_PX}px)` }}>
            {grid.flat().map((v, i) => {
              const r = Math.floor(i / SIZE), c = i % SIZE;
              const isSel = selected?.[0] === r && selected?.[1] === c;
              return (
                <button key={i} type="button" onClick={() => handleCell(r, c)}
                  className={`rounded-lg transition-all ${isSel ? "ring-2 ring-yellow-400 scale-110" : ""}`}
                  style={{ width: CELL_PX, height: CELL_PX, background: v >= 0 ? COLORS[v] : "#1f2937", boxShadow: v >= 0 ? `0 0 8px ${COLORS[v]}80` : undefined }}
                />
              );
            })}
          </div>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">点击两个相邻方块交换，三连消除</p>
        <button type="button" onClick={reset} className="mt-2 w-full py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 text-sm">重新开始</button>
      </div>
    </div>
  );
}
