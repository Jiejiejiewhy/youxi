"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const TARGET_R = 80;
const HIT_MS = 300;

export default function ShootingGame() {
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [target, setTarget] = useState({ x: 100, y: 100 });
  const [hit, setHit] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const ROUNDS_MAX = 10;

  const nextTarget = useCallback(() => {
    setTarget({
      x: 80 + Math.random() * 120,
      y: 60 + Math.random() * 100,
    });
    setHit(false);
  }, []);

  useEffect(() => {
    if (rounds === 0) nextTarget();
  }, [rounds, nextTarget]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (gameOver || hit) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const dx = x - target.x, dy = y - target.y;
    if (dx * dx + dy * dy <= TARGET_R * TARGET_R) {
      setScore((s) => s + 1);
      setHit(true);
      setTimeout(() => {
        const newRounds = rounds + 1;
        if (newRounds >= ROUNDS_MAX) {
          setGameOver(true);
        } else {
          setRounds(newRounds);
          nextTarget();
        }
      }, HIT_MS);
    } else {
      setTimeout(() => {
        const newRounds = rounds + 1;
        if (newRounds >= ROUNDS_MAX) {
          setGameOver(true);
        } else {
          setRounds(newRounds);
          nextTarget();
        }
      }, HIT_MS);
    }
  }, [target, gameOver, hit, rounds, nextTarget]);

  const reset = useCallback(() => {
    setScore(0);
    setRounds(0);
    setGameOver(false);
    nextTarget();
  }, [nextTarget]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-rose-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-rose-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(244, 63, 94, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-rose-400" style={{ textShadow: "0 0 10px rgba(244, 63, 94, 0.5)" }}>射击靶场</h1>
          <span className="text-zinc-400 text-sm">第 {rounds}/{ROUNDS_MAX} 发 · 命中: {score}</span>
        </div>
        {!gameOver && (
          <div className="relative rounded-lg border border-rose-500/30 cursor-crosshair overflow-hidden" style={{ width: 280, height: 220, background: "rgba(244, 63, 94, 0.06)" }} onClick={handleClick}>
            <div className="absolute rounded-full border-4 border-rose-400 bg-rose-500/20 transition-opacity" style={{ left: target.x - TARGET_R, top: target.y - TARGET_R, width: TARGET_R * 2, height: TARGET_R * 2, opacity: hit ? 0.3 : 1 }} />
            <div className="absolute rounded-full bg-rose-600/40" style={{ left: target.x - 12, top: target.y - 12, width: 24, height: 24 }} />
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-amber-400" style={{ textShadow: "0 0 15px rgba(245, 158, 11, 0.6)" }}>得分: {score} / {ROUNDS_MAX}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
