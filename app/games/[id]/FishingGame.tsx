"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const DURATION_SEC = 30;
const POND_W = 280;
const FISH_H = 32;

export default function FishingGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_SEC);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fishes, setFishes] = useState<{ id: number; x: number; y: number }[]>([]);
  const fishIdRef = useRef(0);

  const reset = useCallback(() => {
    setScore(0);
    setTimeLeft(DURATION_SEC);
    setPlaying(false);
    setGameOver(false);
    setFishes([]);
  }, []);

  useEffect(() => {
    if (!playing || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((left) => {
        if (left <= 1) { setGameOver(true); return 0; }
        return left - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, gameOver]);

  useEffect(() => {
    if (!playing || gameOver) return;
    const spawn = () => {
      setFishes((prev) => [...prev.slice(-8), { id: fishIdRef.current++, x: Math.random() * (POND_W - 40), y: 20 + Math.random() * 120 }]);
    };
    const id = setInterval(spawn, 800);
    return () => clearInterval(id);
  }, [playing, gameOver]);

  const catchFish = useCallback((id: number) => {
    if (!playing || gameOver) return;
    setFishes((prev) => prev.filter((f) => f.id !== id));
    setScore((s) => s + 1);
  }, [playing, gameOver]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-blue-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(59, 130, 246, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-blue-400" style={{ textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}>钓鱼达人</h1>
          <span className="text-zinc-400 text-sm">得分: {score} {playing && !gameOver && `| ${timeLeft}秒`}</span>
        </div>
        {!playing && !gameOver && (
          <div className="text-center py-4">
            <p className="text-zinc-400 mb-4">限时 {DURATION_SEC} 秒，点击鱼得分</p>
            <button type="button" onClick={() => setPlaying(true)} className="px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 font-medium">开始</button>
          </div>
        )}
        {(playing || gameOver) && (
          <div className="relative rounded-lg border border-blue-500/30 overflow-hidden" style={{ width: POND_W, height: 180, background: "linear-gradient(to bottom, rgba(59, 130, 246, 0.2), rgba(30, 64, 175, 0.3))" }}>
            {fishes.map((f) => (
              <button key={f.id} type="button" onClick={() => catchFish(f.id)} className="absolute text-2xl hover:scale-110 transition-transform" style={{ left: f.x, top: f.y }}>🐟</button>
            ))}
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-amber-400" style={{ textShadow: "0 0 15px rgba(245, 158, 11, 0.6)" }}>时间到！钓到 {score} 条</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
