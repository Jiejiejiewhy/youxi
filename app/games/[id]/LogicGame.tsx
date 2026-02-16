"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const PUZZLE = {
  q: "三人 A、B、C，其中一人说真话。A说：B说谎。B说：C说谎。C说：A、B都说谎。谁说了真话？",
  options: ["A", "B", "C"],
  answer: 1, // B
};

export default function LogicGame() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [round, setRound] = useState(0);

  const puzzles = [PUZZLE];
  const p = puzzles[round % puzzles.length];

  const submit = useCallback(() => {
    if (selected === null) return;
    setRevealed(true);
  }, [selected]);

  const reset = useCallback(() => {
    setSelected(null);
    setRevealed(false);
    setRound((r) => r + 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-violet-500/40 bg-black/50 backdrop-blur-sm p-6 max-w-md" style={{ boxShadow: "0 0 25px rgba(139, 92, 246, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <h1 className="text-xl font-bold text-violet-400 mb-4" style={{ textShadow: "0 0 10px rgba(139, 92, 246, 0.5)" }}>逻辑谜题</h1>
        <p className="text-zinc-300 mb-6">{p.q}</p>
        <div className="space-y-2 mb-4">
          {p.options.map((opt, i) => (
            <button key={i} type="button" onClick={() => !revealed && setSelected(i)}
              className={`w-full py-3 rounded-lg border text-left px-4 transition-colors ${selected === i ? "border-violet-400 bg-violet-500/20" : "border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10"}`}
            >
              {opt}
              {revealed && i === p.answer && <span className="ml-2 text-green-400">✓ 正确</span>}
              {revealed && selected === i && i !== p.answer && <span className="ml-2 text-red-400">✗</span>}
            </button>
          ))}
        </div>
        {!revealed && <button type="button" onClick={submit} disabled={selected === null} className="w-full py-2 rounded-lg bg-violet-500/20 border border-violet-500/50 text-violet-400 hover:bg-violet-500/30 disabled:opacity-50">确认</button>}
        {revealed && <button type="button" onClick={reset} className="w-full py-2 rounded-lg bg-violet-500/20 border border-violet-500/50 text-violet-400 hover:bg-violet-500/30">下一题</button>}
      </div>
    </div>
  );
}
