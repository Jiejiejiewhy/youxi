"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const PLAYER_X = 80;
const ENEMY_X = 260;
const PUNCH_MS = 200;

export default function FighterGame() {
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [punching, setPunching] = useState(false);
  const [enemyPunching, setEnemyPunching] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);

  const punch = useCallback(() => {
    if (gameOver || punching || enemyPunching) return;
    setPunching(true);
    setTimeout(() => {
      setEnemyHp((h) => {
        const next = Math.max(0, h - 15);
        if (next <= 0) setGameOver("win");
        return next;
      });
      setPunching(false);
    }, PUNCH_MS);
  }, [gameOver, punching, enemyPunching]);

  useEffect(() => {
    if (gameOver || enemyHp <= 0) return;
    const id = setInterval(() => {
      setEnemyPunching(true);
      setTimeout(() => {
        setPlayerHp((h) => {
          const d = blocking ? 3 : 12;
          const next = Math.max(0, h - d);
          if (next <= 0) setGameOver("lose");
          return next;
        });
        setEnemyPunching(false);
      }, PUNCH_MS);
    }, 1200);
    return () => clearInterval(id);
  }, [gameOver, enemyHp, blocking]);

  const reset = useCallback(() => {
    setPlayerHp(100);
    setEnemyHp(100);
    setPunching(false);
    setEnemyPunching(false);
    setBlocking(false);
    setGameOver(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-red-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(239, 68, 68, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <h1 className="text-xl font-bold text-red-400 mb-4" style={{ textShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }}>格斗小子</h1>
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-400 text-sm">HP: {playerHp}</span>
          <span className="text-red-400 text-sm">敌方: {enemyHp}</span>
        </div>
        <div className="relative h-48 rounded-lg border border-red-500/30 flex items-end justify-around pb-4" style={{ background: "rgba(239, 68, 68, 0.06)", width: 320 }}>
          <div className="flex flex-col items-center gap-2">
            <div className={`text-5xl transition-transform ${punching ? "translate-x-4" : ""}`}>🥋</div>
            <div className="flex gap-2">
              <button type="button" onClick={punch} disabled={!!gameOver || punching} className="px-4 py-2 rounded bg-red-500/30 border border-red-500 text-red-400 text-sm disabled:opacity-50">出拳</button>
              <button type="button" onMouseDown={() => setBlocking(true)} onMouseUp={() => setBlocking(false)} onMouseLeave={() => setBlocking(false)} disabled={!!gameOver} className="px-4 py-2 rounded bg-zinc-500/30 border border-zinc-500 text-zinc-400 text-sm disabled:opacity-50">格挡</button>
            </div>
          </div>
          <div className={`text-5xl transition-transform ${enemyPunching ? "-translate-x-4" : ""}`}>👊</div>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">出拳攻击，按住格挡减少伤害</p>
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>{gameOver === "win" ? "胜利！" : "失败"}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30">再战</button>
          </div>
        )}
      </div>
    </div>
  );
}
