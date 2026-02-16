"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const BASKET_W = 60;
const AREA_W = 260;
const AREA_H = 280;
const FRUITS = ["🍎", "🍊", "🍋", "🍇", "🍓"];
const DURATION = 30;

export default function FruitCatchGame() {
  const [basketX, setBasketX] = useState(AREA_W / 2 - BASKET_W / 2);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [drops, setDrops] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const idRef = useRef(0);

  const reset = useCallback(() => {
    setBasketX(AREA_W / 2 - BASKET_W / 2);
    setScore(0);
    setTimeLeft(DURATION);
    setPlaying(false);
    setGameOver(false);
    setDrops([]);
  }, []);

  useEffect(() => {
    if (!playing || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((left) => (left <= 1 ? (setGameOver(true), 0) : left - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [playing, gameOver]);

  useEffect(() => {
    if (!playing || gameOver) return;
    const id = setInterval(() => {
      setDrops((prev) => [...prev.slice(-12), { id: idRef.current++, x: Math.random() * (AREA_W - 30), y: 0, emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)] }]);
    }, 600);
    return () => clearInterval(id);
  }, [playing, gameOver]);

  useEffect(() => {
    if (!playing || gameOver) return;
    const id = setInterval(() => {
      setDrops((prev) =>
        prev.map((d) => ({ ...d, y: d.y + 3 })).filter((d) => {
          if (d.y > AREA_H - 30 && d.x >= basketX - 10 && d.x <= basketX + BASKET_W + 10) {
            setScore((s) => s + 1);
            return false;
          }
          return d.y < AREA_H + 20;
        })
      );
    }, 50);
    return () => clearInterval(id);
  }, [playing, gameOver, basketX]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setBasketX((x) => Math.max(0, x - 15));
      if (e.key === "ArrowRight") setBasketX((x) => Math.min(AREA_W - BASKET_W, x + 15));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-rose-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-rose-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(244, 63, 94, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-rose-400" style={{ textShadow: "0 0 10px rgba(244, 63, 94, 0.5)" }}>接水果</h1>
          <span className="text-zinc-400 text-sm">得分: {score} {playing && !gameOver && `| ${timeLeft}秒`}</span>
        </div>
        {!playing && !gameOver && (
          <div className="text-center py-4">
            <p className="text-zinc-400 mb-4">限时 {DURATION} 秒，← → 移动篮子接水果</p>
            <button type="button" onClick={() => setPlaying(true)} className="px-6 py-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30 font-medium">开始</button>
          </div>
        )}
        {(playing || gameOver) && (
          <div className="relative rounded-lg border border-rose-500/30 overflow-hidden" style={{ width: AREA_W, height: AREA_H, background: "rgba(244, 63, 94, 0.06)" }}>
            {drops.map((d) => (
              <div key={d.id} className="absolute text-2xl" style={{ left: d.x, top: d.y }}>{d.emoji}</div>
            ))}
            <div className="absolute rounded-lg bg-rose-500/80 border-2 border-rose-400 text-center text-lg" style={{ left: basketX, bottom: 10, width: BASKET_W, height: 24 }}>🧺</div>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-amber-400" style={{ textShadow: "0 0 15px rgba(245, 158, 11, 0.6)" }}>时间到！接到 {score} 个</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
