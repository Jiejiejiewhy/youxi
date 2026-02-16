"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const CELL = 44;
// 4x5 华容道简化：曹操 2x2，四个 1x2 竖，四个 1x2 横，若干 1x1。出口在 (3,2)-(4,2)
type Block = { id: number; w: number; h: number; r: number; c: number };
const INIT: Block[] = [
  { id: 0, w: 2, h: 2, r: 0, c: 1 }, // 曹操
  { id: 1, w: 1, h: 2, r: 0, c: 0 }, { id: 2, w: 1, h: 2, r: 0, c: 3 },
  { id: 3, w: 2, h: 1, r: 2, c: 0 }, { id: 4, w: 2, h: 1, r: 2, c: 2 },
  { id: 5, w: 1, h: 2, r: 2, c: 1 }, { id: 6, w: 1, h: 2, r: 2, c: 3 },
  { id: 7, w: 1, h: 1, r: 4, c: 0 }, { id: 8, w: 1, h: 1, r: 4, c: 1 }, { id: 9, w: 1, h: 1, r: 4, c: 3 },
];

function canMove(blocks: Block[], id: number, dr: number, dc: number): boolean {
  const b = blocks.find((x) => x.id === id)!;
  const nr = b.r + dr, nc = b.c + dc;
  if (nr < 0 || nc < 0 || nr + b.h > 5 || nc + b.w > 4) return false;
  for (const o of blocks) {
    if (o.id === id) continue;
    if (nr + b.h <= o.r || o.r + o.h <= nr || nc + b.w <= o.c || o.c + o.w <= nc) continue;
    return false;
  }
  return true;
}

export default function HuarongGame() {
  const [blocks, setBlocks] = useState<Block[]>(() => [...INIT]);
  const [selected, setSelected] = useState<number | null>(null);

  const move = useCallback((id: number, dr: number, dc: number) => {
    setBlocks((prev) => {
      if (!canMove(prev, id, dr, dc)) return prev;
      return prev.map((b) => b.id === id ? { ...b, r: b.r + dr, c: b.c + dc } : b);
    });
  }, []);

  const caoCao = blocks.find((b) => b.id === 0)!;
  const won = caoCao?.r === 3 && caoCao?.c === 1;

  const reset = useCallback(() => {
    setBlocks([...INIT]);
    setSelected(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won || selected === null) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp") move(selected, -1, 0);
      else if (e.key === "ArrowDown") move(selected, 1, 0);
      else if (e.key === "ArrowLeft") move(selected, 0, -1);
      else if (e.key === "ArrowRight") move(selected, 0, 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, won, move]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-stone-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-stone-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(120, 113, 108, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <h1 className="text-xl font-bold text-stone-300 mb-4" style={{ textShadow: "0 0 10px rgba(163, 163, 163, 0.5)" }}>华容道</h1>
        <div className="relative rounded-lg border border-stone-500/30 overflow-hidden" style={{ width: 4 * CELL, height: 5 * CELL, background: "rgba(120, 113, 108, 0.1)" }}>
          {blocks.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelected(b.id)}
              className={`absolute flex items-center justify-center rounded bg-amber-800/80 border text-amber-200 text-xs font-bold transition-all ${selected === b.id ? "border-yellow-400 border-2 shadow-lg" : "border-amber-600"}`}
              style={{ left: b.c * CELL + 2, top: b.r * CELL + 2, width: b.w * CELL - 4, height: b.h * CELL - 4, boxShadow: selected === b.id ? "0 0 15px rgba(250, 204, 21, 0.6)" : undefined }}
            >
              {b.id === 0 ? "曹" : b.w * b.h > 1 ? "将" : ""}
            </button>
          ))}
          <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-[88px] h-2 bg-green-600/60 rounded-t" style={{ left: CELL + 2 }} />
        </div>
        <p className="text-center text-zinc-500 text-sm mt-2">点击方块选中，然后用方向键移动，让曹操(大块)从下方出口离开</p>
        {won && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>曹操脱困！</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-stone-500/20 border border-stone-500/50 text-stone-300 hover:bg-stone-500/30">再玩一局</button>
          </div>
        )}
      </div>
    </div>
  );
}
