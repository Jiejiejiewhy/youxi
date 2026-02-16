"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const ROWS = 3;
const COLS = 3;
const GAME_DURATION_SEC = 30;
const MOLE_SHOW_MS = 900;
const MOLE_HIDE_MS = 600;

export default function WhackAMole() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SEC);
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION_SEC);
    setMoleIndex(null);
    setPlaying(false);
    setGameOver(false);
  }, []);

  // 计时
  useEffect(() => {
    if (!playing || gameOver) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, gameOver]);

  // 地鼠随机出现/消失
  useEffect(() => {
    if (!playing || gameOver) return;
    let active = true;
    const cycle = () => {
      if (!active) return;
      const idx = Math.floor(Math.random() * ROWS * COLS);
      setMoleIndex(idx);
      const t1 = setTimeout(() => {
        if (!active) return;
        setMoleIndex(null);
        const t2 = setTimeout(cycle, MOLE_HIDE_MS);
      }, MOLE_SHOW_MS);
    };
    const initialTimer = setTimeout(cycle, 400);
    return () => {
      active = false;
      clearTimeout(initialTimer);
    };
  }, [playing, gameOver]);

  const whack = useCallback(
    (index: number) => {
      if (!playing || gameOver) return;
      if (moleIndex === index) {
        setScore((s) => s + 1);
        setMoleIndex(null);
      }
    },
    [playing, gameOver, moleIndex]
  );

  const start = useCallback(() => {
    setPlaying(true);
    setGameOver(false);
    setTimeLeft(GAME_DURATION_SEC);
    setScore(0);
    setMoleIndex(null);
  }, []);

  const total = ROWS * COLS;
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-rose-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-pink-500/10 rounded-full blur-[80px]" />
      </div>
      <Link
        href="/"
        className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors"
        style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}
      >
        ← 返回大厅
      </Link>
      <div
        className="relative rounded-2xl border-2 border-rose-500/40 bg-black/50 backdrop-blur-sm p-6"
        style={{ boxShadow: "0 0 25px rgba(244, 63, 94, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-xl font-bold text-rose-400"
            style={{ textShadow: "0 0 10px rgba(244, 63, 94, 0.5)" }}
          >
            打地鼠
          </h1>
          <div className="flex gap-4 text-sm">
            <span className="text-zinc-400">
              得分: <span className="text-rose-400 font-mono font-bold">{score}</span>
            </span>
            {playing && !gameOver && (
              <span className="text-zinc-400">
                剩余: <span className="text-amber-400 font-mono font-bold">{timeLeft}</span> 秒
              </span>
            )}
          </div>
        </div>
        {!playing && !gameOver && (
          <div className="text-center py-6">
            <p className="text-zinc-400 mb-4">30 秒内尽量多敲地鼠！</p>
            <button
              type="button"
              onClick={start}
              className="px-6 py-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30 transition-colors font-medium"
              style={{ boxShadow: "0 0 15px rgba(244, 63, 94, 0.2)" }}
            >
              开始游戏
            </button>
          </div>
        )}
        {(playing || gameOver) && (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 72px)`,
              gridTemplateRows: `repeat(${ROWS}, 72px)`,
            }}
          >
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => whack(i)}
                disabled={gameOver}
                className="w-[72px] h-[72px] rounded-xl bg-rose-950/50 border-2 border-rose-700/50 flex items-center justify-center text-4xl transition-transform hover:scale-105 disabled:pointer-events-none"
                style={{ boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)" }}
              >
                {moleIndex === i ? "🐹" : ""}
              </button>
            ))}
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p
              className="text-2xl font-bold text-rose-400"
              style={{ textShadow: "0 0 15px rgba(244, 63, 94, 0.6)" }}
            >
              时间到！
            </p>
            <p className="text-zinc-400">得分: {score}</p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30 transition-colors"
              style={{ boxShadow: "0 0 15px rgba(244, 63, 94, 0.2)" }}
            >
              再玩一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
