"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function PetGame() {
  const [happy, setHappy] = useState(80);
  const [full, setFull] = useState(70);
  const [mood, setMood] = useState<"normal" | "happy" | "sad">("normal");

  useEffect(() => {
    const id = setInterval(() => {
      setHappy((h) => Math.max(0, h - 0.5));
      setFull((f) => Math.max(0, f - 0.3));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const h = happy; const f = full;
    if (h >= 70 && f >= 60) setMood("happy");
    else if (h < 40 || f < 40) setMood("sad");
    else setMood("normal");
  }, [happy, full]);

  const feed = useCallback(() => setFull((f) => Math.min(100, f + 15)), []);
  const play = useCallback(() => setHappy((h) => Math.min(100, h + 15)), []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-amber-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(245, 158, 11, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <h1 className="text-xl font-bold text-amber-400 mb-4" style={{ textShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}>养宠物</h1>
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="text-6xl">{mood === "happy" ? "😺" : mood === "sad" ? "😿" : "🐱"}</div>
          <div className="w-48">
            <p className="text-zinc-400 text-sm mb-1">快乐: {Math.round(happy)}%</p>
            <div className="h-2 rounded-full bg-zinc-700 overflow-hidden"><div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${happy}%` }} /></div>
          </div>
          <div className="w-48">
            <p className="text-zinc-400 text-sm mb-1">饱食: {Math.round(full)}%</p>
            <div className="h-2 rounded-full bg-zinc-700 overflow-hidden"><div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${full}%` }} /></div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button type="button" onClick={feed} className="px-6 py-3 rounded-xl bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30">喂食</button>
          <button type="button" onClick={play} className="px-6 py-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30">玩耍</button>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">喂食增加饱食，玩耍增加快乐</p>
      </div>
    </div>
  );
}
