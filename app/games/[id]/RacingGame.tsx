"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const LANE_W = 70;
const LANES = 3;
const SPEED = 5;

export default function RacingGame() {
  const [playerLane, setPlayerLane] = useState(1);
  const [cars, setCars] = useState<{ x: number; lane: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const tickRef = useRef(0);

  const reset = useCallback(() => {
    setPlayerLane(1);
    setCars([]);
    setScore(0);
    setGameOver(false);
    tickRef.current = 0;
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      tickRef.current++;
      setScore((s) => s + 1);
      setCars((prev) => {
        const next = prev.map((c) => ({ ...c, x: c.x - SPEED })).filter((c) => c.x > -40);
        if (tickRef.current % 60 === 0) next.push({ x: 280, lane: Math.floor(Math.random() * LANES) });
        return next;
      });
      setCars((prev) => {
        const hit = prev.some((c) => c.x <= 50 && c.x >= 20 && c.lane === playerLane);
        if (hit) setGameOver(true);
        return prev;
      });
    }, 50);
    return () => clearInterval(id);
  }, [gameOver, playerLane]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft" && playerLane > 0) setPlayerLane((l) => l - 1);
      if (e.key === "ArrowRight" && playerLane < LANES - 1) setPlayerLane((l) => l + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver, playerLane]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-red-600/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(220, 38, 38, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-red-400" style={{ textShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }}>赛车狂飙</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-red-400 font-mono font-bold">{score}</span></span>
        </div>
        <div className="relative rounded-lg border border-red-500/30 overflow-hidden" style={{ width: 260, height: LANES * LANE_W, background: "rgba(220, 38, 38, 0.06)" }}>
          {[0, 1, 2].map((lane) => (
            <div key={lane} className="absolute left-0 right-0 border-b border-red-500/20" style={{ top: lane * LANE_W, height: LANE_W }} />
          ))}
          <div className="absolute text-2xl transition-left duration-100" style={{ left: 30, top: playerLane * LANE_W + 18 }}>🏎️</div>
          {cars.map((c, i) => (
            <div key={i} className="absolute text-2xl" style={{ left: c.x, top: c.lane * LANE_W + 18 }}>🚗</div>
          ))}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">← → 变道 躲避来车</p>
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-red-400" style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}>撞车了！</p>
            <p className="text-zinc-400">得分: {score}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
