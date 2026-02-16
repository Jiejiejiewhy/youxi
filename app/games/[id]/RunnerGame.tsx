"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const LANE_W = 60;
const LANES = 3;
const OBSTACLE_H = 24;
const JUMP_DURATION = 600;
const SPEED = 8;

export default function RunnerGame() {
  const [playerY, setPlayerY] = useState(1);
  const [obstacles, setObstacles] = useState<{ x: number; lane: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [jumping, setJumping] = useState(false);
  const tickRef = useRef(0);
  const obsIdRef = useRef(0);

  const reset = useCallback(() => {
    setPlayerY(1);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setJumping(false);
    tickRef.current = 0;
    obsIdRef.current = 0;
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      tickRef.current++;
      setScore((s) => s + 1);
      setObstacles((prev) => {
        const next = prev.map((o) => ({ ...o, x: o.x - SPEED })).filter((o) => o.x > -40);
        if (tickRef.current % 45 === 0) next.push({ x: 320, lane: Math.floor(Math.random() * LANES) });
        return next;
      });
      setObstacles((prev) => {
        const hit = prev.some((o) => o.x <= 50 && o.x >= 20 && o.lane === playerY);
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
      if (e.key === "ArrowUp" && playerY > 0 && !jumping) {
        setJumping(true);
        setPlayerY(0);
        setTimeout(() => { setPlayerY(1); setJumping(false); }, JUMP_DURATION);
      }
      if (e.key === "ArrowDown" && playerY < LANES - 1 && !jumping) {
        setJumping(true);
        setPlayerY(2);
        setTimeout(() => { setPlayerY(1); setJumping(false); }, JUMP_DURATION);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver, playerY, jumping]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-yellow-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(234, 179, 8, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-yellow-400" style={{ textShadow: "0 0 10px rgba(234, 179, 8, 0.5)" }}>极速跑酷</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-yellow-400 font-mono font-bold">{score}</span></span>
        </div>
        <div className="relative rounded-lg border border-yellow-500/30 overflow-hidden" style={{ width: 320, height: LANES * LANE_W, background: "rgba(234, 179, 8, 0.06)" }}>
          {[0, 1, 2].map((lane) => (
            <div key={lane} className="absolute left-0 right-0 border-b border-yellow-500/20" style={{ top: lane * LANE_W, height: LANE_W }} />
          ))}
          <div className="absolute rounded-lg bg-amber-400 transition-top duration-150" style={{ left: 30, top: playerY * LANE_W + 18, width: 24, height: 24, boxShadow: "0 0 12px rgba(251, 191, 36, 0.8)" }} />
          {obstacles.map((o, i) => (
            <div key={i} className="absolute rounded bg-red-500" style={{ left: o.x, top: o.lane * LANE_W + 12, width: 20, height: OBSTACLE_H }} />
          ))}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">↑ 上移 ↓ 下移 躲避障碍</p>
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-red-400" style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}>撞到了！</p>
            <p className="text-zinc-400">得分: {score}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
