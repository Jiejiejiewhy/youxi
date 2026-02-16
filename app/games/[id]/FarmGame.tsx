"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const PLOTS = 6;
type Plot = "empty" | "seed" | "growing" | "ready";

export default function FarmGame() {
  const [plots, setPlots] = useState<Plot[]>(Array(PLOTS).fill("empty"));
  const [coins, setCoins] = useState(10);
  const [selected, setSelected] = useState<number | null>(null);

  const plant = useCallback((i: number) => {
    setPlots((prev) => {
      if (prev[i] !== "empty") return prev;
      const n = [...prev];
      n[i] = "seed";
      return n;
    });
    setCoins((c) => {
      if (c < 2) return c;
      return c - 2;
    });
    setSelected(null);
    
    const t1 = setTimeout(() => {
      setPlots((prev) => {
        const n = [...prev];
        if (n[i] === "seed") n[i] = "growing";
        return n;
      });
    }, 1000);
    
    const t2 = setTimeout(() => {
      setPlots((prev) => {
        const n = [...prev];
        if (n[i] === "growing") n[i] = "ready";
        return n;
      });
    }, 3000);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const harvest = useCallback((i: number) => {
    setPlots((prev) => {
      if (prev[i] !== "ready") return prev;
      const n = [...prev];
      n[i] = "empty";
      return n;
    });
    setCoins((c) => c + 5);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-lime-600/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-lime-600/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(101, 163, 13, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-lime-400" style={{ textShadow: "0 0 10px rgba(101, 163, 13, 0.5)" }}>种田模拟</h1>
          <span className="text-zinc-400 text-sm">金币: <span className="text-amber-400 font-mono font-bold">{coins}</span></span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {plots.map((p, i) => (
            <button key={i} type="button" onClick={() => { if (p === "empty") plant(i); else if (p === "ready") harvest(i); }}
              className="rounded-xl border-2 border-lime-600/40 h-24 flex items-center justify-center text-3xl transition-colors hover:bg-lime-500/10"
              style={{ background: p === "empty" ? "rgba(101, 163, 13, 0.1)" : p === "seed" ? "rgba(139, 69, 19, 0.3)" : p === "growing" ? "rgba(34, 197, 94, 0.2)" : "rgba(234, 179, 8, 0.2)" }}
            >
              {p === "empty" && "🟫"}
              {p === "seed" && "🌱"}
              {p === "growing" && "🌿"}
              {p === "ready" && "🌾"}
            </button>
          ))}
        </div>
        <p className="text-center text-zinc-500 text-sm">空地点击种植(2金币)，成熟后点击收获(5金币)</p>
      </div>
    </div>
  );
}
