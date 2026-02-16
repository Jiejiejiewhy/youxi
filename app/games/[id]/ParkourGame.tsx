"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const LANE_W = 50;
const JUMP_MS = 400;
const SPEED = 6;

export default function ParkourGame() {
  const [playerY, setPlayerY] = useState(1);
  const [obstacles, setObstacles] = useState<{ x: number; lane: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [sliding, setSliding] = useState(false);
  const tickRef = useRef(0);

  const reset = useCallback(() => {
    setPlayerY(1);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setSliding(false);
    tickRef.current = 0;
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      tickRef.current++;
      setScore((s) => s + 1);
      setObstacles((prev) => {
        const next = prev.map((o) => ({ ...o, x: o.x - SPEED })).filter((o) => o.x > -30);
        if (tickRef.current % 50 === 0) next.push({ x: 280, lane: Math.floor(Math.random() * 3) });
        return next;
      });
      setObstacles((prev) => {
        const hit = prev.some((o) => o.x <= 45 && o.x >= 25 && o.lane === playerY);
        if (hit) setGameOver(true);
        return prev;
      });
    }, 50);
    return () => clearInterval(id);
  }, [gameOver, playerY]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp" && playerY > 0 && !sliding) {
        setSliding(true);
        setPlayerY(0);
        setTimeout(() => { setPlayerY(1); setSliding(false); }, JUMP_MS);
      }
      if (e.key === "ArrowDown" && playerY < 2) {
        setSliding(true);
        setPlayerY(2);
        setTimeout(() => { setPlayerY(1); setSliding(false); }, 350);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver, playerY, sliding]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-orange-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(249, 115, 22, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-orange-400" style={{ textShadow: "0 0 10px rgba(249, 115, 22, 0.5)" }}>跑酷冒险</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-orange-400 font-mono font-bold">{score}</span></span>
        </div>
        <div className="relative rounded-lg border border-orange-500/30 overflow-hidden" style={{ width: 280, height: 150, background: "rgba(249, 115, 22, 0.06)" }}>
          {[0, 1, 2].map((lane) => (
            <div key={lane} className="absolute left-0 right-0 border-b border-orange-500/20" style={{ top: lane * LANE_W, height: LANE_W }} />
          ))}
          <div className="absolute rounded bg-amber-500 transition-all duration-100" style={{ left: 25, top: playerY * LANE_W + 15, width: 22, height: 22 }} />
          {obstacles.map((o, i) => (
            <div key={i} className="absolute rounded bg-red-600" style={{ left: o.x, top: o.lane * LANE_W + 12, width: 24, height: 26 }} />
          ))}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">↑ 跳跃 ↓ 滑铲 躲避障碍</p>
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-red-400" style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}>失败</p>
            <p className="text-zinc-400">得分: {score}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
