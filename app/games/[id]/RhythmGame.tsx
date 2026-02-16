"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const LANES = 4;
const FALL_SPEED = 3;
const HIT_ZONE = 40;

export default function RhythmGame() {
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState<{ id: number; lane: number; y: number }[]>([]);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const idRef = useRef(0);

  const reset = useCallback(() => {
    setScore(0);
    setNotes([]);
    setPlaying(false);
    setGameOver(false);
  }, []);

  useEffect(() => {
    if (!playing || gameOver) return;
    const id = setInterval(() => {
      setNotes((prev) => [
        ...prev.slice(-15),
        { id: idRef.current++, lane: Math.floor(Math.random() * LANES), y: 0 },
      ]);
    }, 600);
    return () => clearInterval(id);
  }, [playing, gameOver]);

  useEffect(() => {
    if (!playing || gameOver) return;
    const id = setInterval(() => {
      setNotes((prev) => prev.map((n) => ({ ...n, y: n.y + FALL_SPEED })).filter((n) => n.y < 200));
    }, 30);
    return () => clearInterval(id);
  }, [playing, gameOver]);

  const hit = useCallback((lane: number) => {
    setNotes((prev) => {
      const near = prev.find((n) => n.lane === lane && n.y >= 120 - HIT_ZONE && n.y <= 120 + HIT_ZONE);
      if (near) {
        setScore((s) => s + 1);
        return prev.filter((n) => n.id !== near.id);
      }
      return prev;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-pink-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(236, 72, 153, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-pink-400" style={{ textShadow: "0 0 10px rgba(236, 72, 153, 0.5)" }}>节奏大师</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-pink-400 font-mono font-bold">{score}</span></span>
        </div>
        {!playing && !gameOver && (
          <div className="text-center py-6">
            <p className="text-zinc-400 mb-4">音符落下时在对应轨道按键击中</p>
            <button type="button" onClick={() => setPlaying(true)} className="px-6 py-3 rounded-xl bg-pink-500/20 border border-pink-500/50 text-pink-400 hover:bg-pink-500/30 font-medium">开始</button>
          </div>
        )}
        {(playing || gameOver) && (
          <>
            <div className="relative rounded-lg border border-pink-500/30 overflow-hidden" style={{ width: 240, height: 200, background: "rgba(236, 72, 153, 0.06)" }}>
              {[0, 1, 2, 3].map((lane) => (
                <div key={lane} className="absolute top-0 bottom-0 border-r border-pink-500/20" style={{ left: lane * 60, width: 60 }} />
              ))}
              <div className="absolute left-0 right-0 h-1 bg-pink-400/60" style={{ top: 119 }} />
              {notes.map((n) => (
                <div key={n.id} className="absolute w-12 h-8 rounded bg-pink-500 flex items-center justify-center text-white text-sm font-bold" style={{ left: n.lane * 60 + 6, top: n.y }}>♪</div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2, 3].map((lane) => (
                <button key={lane} type="button" onClick={() => hit(lane)} className="w-14 h-12 rounded-lg bg-pink-500/30 border border-pink-500 text-pink-400 font-bold">D{lane + 1}</button>
              ))}
            </div>
          </>
        )}
        <button type="button" onClick={reset} className="mt-4 w-full py-2 rounded-lg bg-pink-500/20 border border-pink-500/50 text-pink-400 hover:bg-pink-500/30 text-sm">重新开始</button>
      </div>
    </div>
  );
}
