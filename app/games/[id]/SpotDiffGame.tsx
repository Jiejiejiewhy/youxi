"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const SIZE = 4;
const CELL_PX = 56;
const DIFF_COUNT = 3;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function SpotDiffGame() {
  const [diffs, setDiffs] = useState(() => {
    const all = Array.from({ length: SIZE * SIZE }, (_, i) => i);
    return shuffle(all).slice(0, DIFF_COUNT);
  });
  const [found, setFound] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null);

  const handleClick = useCallback((index: number) => {
    if (found.has(index)) return;
    if (diffs.includes(index)) {
      setFound((prev) => new Set(prev).add(index));
      setWrong(null);
    } else {
      setWrong(index);
      setTimeout(() => setWrong(null), 400);
    }
  }, [diffs, found]);

  const reset = useCallback(() => {
    const all = Array.from({ length: SIZE * SIZE }, (_, i) => i);
    setDiffs(shuffle(all).slice(0, DIFF_COUNT));
    setFound(new Set());
    setWrong(null);
  }, []);

  const won = found.size === DIFF_COUNT;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-amber-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(234, 179, 8, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-amber-400" style={{ textShadow: "0 0 10px rgba(234, 179, 8, 0.5)" }}>找不同</h1>
          <span className="text-zinc-400 text-sm">已找 {found.size}/{DIFF_COUNT}</span>
        </div>
        <p className="text-zinc-500 text-sm mb-2">左图与右图有 {DIFF_COUNT} 处不同，点击右图中的不同之处</p>
        <div className="flex gap-4">
          <div className="grid gap-px rounded-lg overflow-hidden border border-amber-500/30" style={{ gridTemplateColumns: `repeat(${SIZE}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${SIZE}, ${CELL_PX}px)` }}>
            {Array.from({ length: SIZE * SIZE }, (_, i) => (
              <div key={i} className="bg-zinc-800" style={{ width: CELL_PX, height: CELL_PX, background: diffs.includes(i) ? "#f59e0b" : "#27272a" }} />
            ))}
          </div>
          <div className="grid gap-px rounded-lg overflow-hidden border border-amber-500/30" style={{ gridTemplateColumns: `repeat(${SIZE}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${SIZE}, ${CELL_PX}px)` }}>
            {Array.from({ length: SIZE * SIZE }, (_, i) => (
              <button key={i} type="button" onClick={() => handleClick(i)}
                className={`transition-colors ${wrong === i ? "bg-red-500" : found.has(i) ? "bg-green-500" : "bg-zinc-700 hover:bg-zinc-600"}`}
                style={{ width: CELL_PX, height: CELL_PX }}
              />
            ))}
          </div>
        </div>
        {won && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>全部找到！</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30">再玩一局</button>
          </div>
        )}
      </div>
    </div>
  );
}
