"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 11;
const CELL_PX = 28;
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export default function TankGame() {
  const [player, setPlayer] = useState({ x: 5, y: 9, dir: "up" as keyof typeof DIRS });
  const [enemies, setEnemies] = useState<{ x: number; y: number }[]>([{ x: 2, y: 1 }, { x: 5, y: 1 }, { x: 8, y: 1 }]);
  const [bullets, setBullets] = useState<{ x: number; y: number; dx: number; dy: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);
  const base = { x: 5, y: 9 };

  const reset = useCallback(() => {
    setPlayer({ x: 5, y: 9, dir: "up" });
    setEnemies([{ x: 2, y: 1 }, { x: 5, y: 1 }, { x: 8, y: 1 }]);
    setBullets([]);
    setScore(0);
    setGameOver(null);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp") setPlayer((p) => ({ ...p, dir: "up", y: Math.max(0, p.y - 1) }));
      if (e.key === "ArrowDown") setPlayer((p) => ({ ...p, dir: "down", y: Math.min(GRID - 1, p.y + 1) }));
      if (e.key === "ArrowLeft") setPlayer((p) => ({ ...p, dir: "left", x: Math.max(0, p.x - 1) }));
      if (e.key === "ArrowRight") setPlayer((p) => ({ ...p, dir: "right", x: Math.min(GRID - 1, p.x + 1) }));
      if (e.key === " ") {
        setPlayer((p) => {
          const [bdx, bdy] = DIRS[p.dir];
          setBullets((b) => [...b.slice(-3), { x: p.x, y: p.y, dx: bdx, dy: bdy }]);
          return p;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setBullets((prev) =>
        prev.map((b) => ({ ...b, x: b.x + b.dx, y: b.y + b.dy })).filter((b) => b.x >= 0 && b.x < GRID && b.y >= 0 && b.y < GRID)
      );
      setEnemies((prev) => {
        let next = prev.map((e) => ({ ...e, y: e.y + (e.y < player.y ? 1 : -1) }));
        const hit = next.filter((e) => bullets.some((b) => b.x === e.x && b.y === e.y));
        if (hit.length) { setScore((s) => s + hit.length); setBullets((b) => b.filter((bb) => !hit.some((h) => bb.x === h.x && bb.y === h.y))); next = next.filter((e) => !hit.some((h) => h.x === e.x && h.y === e.y)); }
        if (next.some((e) => e.x === base.x && e.y === base.y)) setGameOver("lose");
        return next;
      });
      if (enemies.length === 0) setGameOver("win");
    }, 200);
    return () => clearInterval(id);
  }, [gameOver, player, bullets, enemies.length]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-lime-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-lime-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(34, 197, 94, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-lime-400" style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.5)" }}>坦克大战</h1>
          <span className="text-zinc-400 text-sm">击毁: {score}</span>
        </div>
        <div className="grid gap-px rounded-lg border border-lime-500/30 overflow-hidden" style={{ gridTemplateColumns: `repeat(${GRID}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${GRID}, ${CELL_PX}px)` }}>
          {Array.from({ length: GRID * GRID }, (_, i) => {
            const x = i % GRID, y = Math.floor(i / GRID);
            const isPlayer = player.x === x && player.y === y;
            const isEnemy = enemies.some((e) => e.x === x && e.y === y);
            const isBase = base.x === x && base.y === y;
            const isBullet = bullets.some((b) => Math.round(b.x) === x && Math.round(b.y) === y);
            return (
              <div key={i} className="bg-zinc-800/80 flex items-center justify-center" style={{ width: CELL_PX, height: CELL_PX }}>
                {isPlayer && <span className="text-lg">🚀</span>}
                {isEnemy && !isPlayer && <span className="text-lg">🔴</span>}
                {isBase && !isPlayer && <span className="text-sm text-amber-400">基</span>}
                {isBullet && !isPlayer && !isEnemy && <span className="text-amber-400">•</span>}
              </div>
            );
          })}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">方向键移动 空格射击 保护基地消灭敌坦</p>
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>{gameOver === "win" ? "胜利！" : "基地被毁"}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-lime-500/20 border border-lime-500/50 text-lime-400 hover:bg-lime-500/30">再战</button>
          </div>
        )}
      </div>
    </div>
  );
}
