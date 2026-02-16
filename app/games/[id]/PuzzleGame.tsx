"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const SIZE = 3;
const CELL_PX = 72;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function isSolvable(order: number[]): boolean {
  let inv = 0;
  for (let i = 0; i < order.length; i++)
    for (let j = i + 1; j < order.length; j++)
      if (order[i] > order[j] && order[i] !== 0 && order[j] !== 0) inv++;
  return inv % 2 === 0;
}

export default function PuzzleGame() {
  const [tiles, setTiles] = useState<number[]>(() => {
    let order: number[];
    do {
      order = shuffle(Array.from({ length: SIZE * SIZE }, (_, i) => i));
    } while (!isSolvable(order));
    return order;
  });
  const [won, setWon] = useState(false);

  const emptyIdx = tiles.indexOf(0);
  const emptyR = Math.floor(emptyIdx / SIZE);
  const emptyC = emptyIdx % SIZE;

  const move = useCallback((idx: number) => {
    const r = Math.floor(idx / SIZE), c = idx % SIZE;
    if (Math.abs(r - emptyR) + Math.abs(c - emptyC) !== 1) return;
    setTiles((prev) => {
      const next = [...prev];
      [next[emptyIdx], next[idx]] = [next[idx], next[emptyIdx]];
      const done = next.every((v, i) => v === (i + 1) % (SIZE * SIZE));
      if (done) setWon(true);
      return next;
    });
  }, [emptyIdx, emptyR, emptyC]);

  const reset = useCallback(() => {
    let order: number[];
    do {
      order = shuffle(Array.from({ length: SIZE * SIZE }, (_, i) => i));
    } while (!isSolvable(order));
    setTiles(order);
    setWon(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(16, 185, 129, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <h1 className="text-xl font-bold text-emerald-400 mb-4" style={{ textShadow: "0 0 10px rgba(16, 185, 129, 0.5)" }}>拼图挑战</h1>
        <div className="grid gap-1 rounded-lg border border-emerald-500/30 p-1 inline-block" style={{ gridTemplateColumns: `repeat(${SIZE}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${SIZE}, ${CELL_PX}px)`, background: "rgba(16, 185, 129, 0.08)" }}>
          {tiles.map((v, i) => (
            v === 0 ? <div key={i} className="rounded-lg bg-zinc-800/80" style={{ width: CELL_PX, height: CELL_PX }} /> :
              <button key={i} type="button" onClick={() => move(i)} className="rounded-lg bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-bold text-xl flex items-center justify-center hover:bg-emerald-500/40 transition-colors" style={{ width: CELL_PX, height: CELL_PX }}>{v}</button>
          ))}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">点击空格相邻数字移动，按顺序排好 1～8</p>
        {won && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>完成！</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30">再玩一局</button>
          </div>
        )}
      </div>
    </div>
  );
}
