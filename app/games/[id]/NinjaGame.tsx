"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const GRID = 5;
const CELL_PX = 44;

export default function NinjaGame() {
  const [player, setPlayer] = useState({ r: 4, c: 2 });
  const [guards, setGuards] = useState<{ r: number; c: number }[]>([{ r: 0, c: 2 }, { r: 2, c: 0 }, { r: 2, c: 4 }]);
  const [won, setWon] = useState(false);
  const [caught, setCaught] = useState(false);

  const reset = useCallback(() => {
    setPlayer({ r: 4, c: 2 });
    setGuards([{ r: 0, c: 2 }, { r: 2, c: 0 }, { r: 2, c: 4 }]);
    setWon(false);
    setCaught(false);
  }, []);

  useEffect(() => {
    if (won || caught) return;
    const id = setInterval(() => {
      setGuards((prev) =>
        prev.map((g) => {
          const dr = player.r - g.r, dc = player.c - g.c;
          let nr = g.r, nc = g.c;
          if (Math.abs(dr) >= Math.abs(dc) && dr !== 0) nr += dr > 0 ? 1 : -1;
          else if (dc !== 0) nc += dc > 0 ? 1 : -1;
          nr = Math.max(0, Math.min(GRID - 1, nr));
          nc = Math.max(0, Math.min(GRID - 1, nc));
          if (nr === player.r && nc === player.c) setCaught(true);
          return { r: nr, c: nc };
        })
      );
    }, 600);
    return () => clearInterval(id);
  }, [player, won, caught]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won || caught) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      setPlayer((p) => {
        let nr = p.r, nc = p.c;
        if (e.key === "ArrowUp") nr--; else if (e.key === "ArrowDown") nr++; else if (e.key === "ArrowLeft") nc--; else if (e.key === "ArrowRight") nc++; else return p;
        nr = Math.max(0, Math.min(GRID - 1, nr));
        nc = Math.max(0, Math.min(GRID - 1, nc));
        if (guards.some((g) => g.r === nr && g.c === nc)) {
          setCaught(true);
          return p;
        }
        if (nr === 0 && nc === 2) setWon(true);
        return { r: nr, c: nc };
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [won, caught, guards]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-slate-600/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-slate-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(71, 85, 105, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <h1 className="text-xl font-bold text-slate-300 mb-4" style={{ textShadow: "0 0 10px rgba(148, 163, 184, 0.5)" }}>忍者传说</h1>
        <div className="grid gap-px rounded-lg border border-slate-500/30 overflow-hidden" style={{ gridTemplateColumns: `repeat(${GRID}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${GRID}, ${CELL_PX}px)` }}>
          {Array.from({ length: GRID * GRID }, (_, i) => {
            const r = Math.floor(i / GRID), c = i % GRID;
            const isPlayer = player.r === r && player.c === c;
            const isGuard = guards.some((g) => g.r === r && g.c === c);
            const isGoal = r === 0 && c === 2;
            return (
              <div key={i} className="flex items-center justify-center bg-slate-800/80" style={{ width: CELL_PX, height: CELL_PX }}>
                {isPlayer && <span className="text-2xl">🥷</span>}
                {isGuard && !isPlayer && <span className="text-xl">👁</span>}
                {isGoal && !isPlayer && !isGuard && <span className="text-lg text-green-400">出口</span>}
              </div>
            );
          })}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">方向键移动，到达顶部出口，避开守卫</p>
        {(won || caught) && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>{won ? "脱出成功！" : "被发现了！"}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-slate-500/20 border border-slate-500/50 text-slate-300 hover:bg-slate-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
