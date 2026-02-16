"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const IDIOMS: [string, string][] = [
  ["一心一意", "意气风发"], ["发愤图强", "强词夺理"], ["理直气壮", "壮志凌云"],
  ["云开日出", "出生入死"], ["死里逃生", "生龙活虎"], ["虎头蛇尾", "尾大不掉"],
  ["掉以轻心", "心口如一"], ["一马当先", "先见之明"], ["明明白白", "白手起家"],
  ["家喻户晓", "晓以利害"],
];

export default function IdiomGame() {
  const [round, setRound] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const [question, answer] = IDIOMS[round % IDIOMS.length];
  const lastChar = question.slice(-1);

  const submit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const correct = trimmed === answer;
    if (correct) {
      setScore((s) => s + 1);
      setFeedback(`正确！下一题：${answer} → 接最后一个字`);
      setInput("");
      setRound((r) => r + 1);
    } else {
      setFeedback(`不对哦，参考答案：${answer}`);
    }
  }, [input, answer]);

  const reset = useCallback(() => {
    setRound(0);
    setInput("");
    setFeedback("");
    setScore(0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-600/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-amber-600/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(217, 119, 6, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-amber-500" style={{ textShadow: "0 0 10px rgba(217, 119, 6, 0.5)" }}>成语接龙</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-amber-400 font-mono font-bold">{score}</span></span>
        </div>
        <p className="text-zinc-400 mb-2">上一词：<span className="text-amber-300 font-medium">{question}</span></p>
        <p className="text-zinc-500 text-sm mb-4">请接以「{lastChar}」开头的四字成语</p>
        <div className="flex gap-2 mb-4">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
            className="flex-1 rounded-lg bg-zinc-800 border border-amber-600/40 px-4 py-2 text-white placeholder-zinc-500" placeholder="输入成语" maxLength={4} />
          <button type="button" onClick={submit} className="px-4 py-2 rounded-lg bg-amber-600/30 border border-amber-500 text-amber-400 hover:bg-amber-600/40">提交</button>
        </div>
        {feedback && <p className="text-sm text-cyan-400 mb-4">{feedback}</p>}
        <button type="button" onClick={reset} className="w-full py-2 rounded-lg bg-amber-600/20 border border-amber-600/50 text-amber-400 hover:bg-amber-600/30 text-sm">重新开始</button>
      </div>
    </div>
  );
}
