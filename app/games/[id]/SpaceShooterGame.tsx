"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const AREA_W = 280;
const AREA_H = 320;
const SHIP_Y = AREA_H - 50;

export default function SpaceShooterGame() {
  const [shipX, setShipX] = useState(AREA_W / 2 - 16);
  const [bullets, setBullets] = useState<{ x: number; y: number }[]>([]);
  const [enemies, setEnemies] = useState<{ x: number; y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(true);
  const tickRef = useRef(0);

  const reset = useCallback(() => {
    setShipX(AREA_W / 2 - 16);
    setBullets([]);
    setEnemies([]);
    setScore(0);
    setGameOver(false);
    setPlaying(true);
    tickRef.current = 0;
  }, []);

  useEffect(() => {
    if (!playing || gameOver) return;
    const onKey = (e: KeyboardEvent) => {
      if ([" "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") setShipX((x) => Math.max(0, x - 12));
      if (e.key === "ArrowRight") setShipX((x) => Math.min(AREA_W - 32, x + 12));
      if (e.key === " ") {
        setBullets((b) => [...b.slice(-5), { x: shipX + 12, y: SHIP_Y - 20 }]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, gameOver, shipX]);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      tickRef.current++;
      setBullets((prev) => prev.map((b) => ({ ...b, y: b.y - 8 })).filter((b) => b.y > 0));
      setEnemies((prev) => {
        let next = prev.map((e) => ({ ...e, y: e.y + 2 }));
        const hit = next.filter((e) => bullets.some((b) => Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20));
        if (hit.length) {
          setScore((s) => s + hit.length);
          setBullets((b) => b.filter((bb) => !hit.some((h) => Math.abs(bb.x - h.x) < 20 && Math.abs(bb.y - h.y) < 20)));
          next = next.filter((e) => !hit.includes(e));
        }
        if (next.some((e) => e.y >= SHIP_Y - 20)) setGameOver(true);
        if (tickRef.current % 40 === 0) next = [...next, { x: Math.random() * (AREA_W - 24), y: 0 }];
        return next.slice(-15);
      });
    }, 50);
    return () => clearInterval(id);
  }, [gameOver, bullets]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-cyan-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(34, 211, 238, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-cyan-400" style={{ textShadow: "0 0 10px rgba(34, 211, 238, 0.5)" }}>太空射击</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-cyan-400 font-mono font-bold">{score}</span></span>
        </div>
        <div className="relative rounded-lg border border-cyan-500/30 overflow-hidden" style={{ width: AREA_W, height: AREA_H, background: "rgba(34, 211, 238, 0.04)" }}>
          <div className="absolute text-2xl" style={{ left: shipX, top: SHIP_Y }}>🚀</div>
          {bullets.map((b, i) => <div key={i} className="absolute w-1 h-4 bg-yellow-400 rounded" style={{ left: b.x, top: b.y }} />)}
          {enemies.map((e, i) => <div key={i} className="absolute text-xl" style={{ left: e.x, top: e.y }}>👾</div>)}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">← → 移动 空格 射击</p>
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-red-400" style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}>被击中了！</p>
            <p className="text-zinc-400">得分: {score}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
