"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const PAIRS = 8;
const ROWS = 4;
const COLS = 4;
const CELL_PX = 64;
const FLIP_BACK_MS = 800;

const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function initCards(): { id: number; emoji: string }[] {
  const pairs = EMOJIS.slice(0, PAIRS).flatMap((emoji, i) => [
    { id: i * 2, emoji },
    { id: i * 2 + 1, emoji },
  ]);
  return shuffle(pairs);
}

export default function MemoryGame() {
  const [cards, setCards] = useState(() => initCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const isFlipped = useCallback(
    (index: number) => flipped.includes(index) || matched.has(cards[index].id),
    [flipped, matched, cards]
  );

  const handleClick = useCallback(
    (index: number) => {
      if (lock || isFlipped(index)) return;
      const emoji = cards[index].emoji;
      const id = cards[index].id;
      if (flipped.length === 0) {
        setFlipped([index]);
        return;
      }
      if (flipped.length === 1) {
        const firstIndex = flipped[0];
        const firstEmoji = cards[firstIndex].emoji;
        const firstId = cards[firstIndex].id;
        setFlipped([firstIndex, index]);
        setMoves((m) => m + 1);
        setLock(true);
        if (firstEmoji === emoji && firstId !== id) {
          setMatched((prev) => new Set(prev).add(firstId).add(id));
          setFlipped([]);
          setLock(false);
        } else {
          setTimeout(() => {
            setFlipped([]);
            setLock(false);
          }, FLIP_BACK_MS);
        }
      }
    },
    [flipped, lock, cards, isFlipped]
  );

  const won = matched.size === PAIRS;

  const reset = useCallback(() => {
    setCards(initCards());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLock(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[100px]" />
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
        className="relative rounded-2xl border-2 border-fuchsia-500/40 bg-black/50 backdrop-blur-sm p-6"
        style={{ boxShadow: "0 0 25px rgba(192, 132, 252, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-xl font-bold text-fuchsia-400"
            style={{ textShadow: "0 0 10px rgba(192, 132, 252, 0.5)" }}
          >
            记忆翻牌
          </h1>
          <span className="text-zinc-400 text-sm">
            步数: <span className="text-fuchsia-400 font-mono font-bold">{moves}</span>
          </span>
        </div>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${COLS}, ${CELL_PX}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL_PX}px)`,
          }}
        >
          {cards.map((card, index) => (
            <button
              key={`${card.id}-${index}`}
              type="button"
              onClick={() => handleClick(index)}
              disabled={lock || matched.has(card.id)}
              className="rounded-xl border-2 border-fuchsia-500/40 flex items-center justify-center text-3xl transition-all duration-300 hover:scale-105 disabled:pointer-events-none"
              style={{
                width: CELL_PX,
                height: CELL_PX,
                background: isFlipped(index)
                  ? "linear-gradient(135deg, rgba(192, 132, 252, 0.4), rgba(236, 72, 153, 0.3))"
                  : "rgba(192, 132, 252, 0.15)",
                boxShadow: isFlipped(index) ? "0 0 15px rgba(192, 132, 252, 0.4)" : "inset 0 0 15px rgba(0,0,0,0.3)",
              }}
            >
              {isFlipped(index) ? card.emoji : "?"}
            </button>
          ))}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">翻开两张相同的牌即可消除</p>
        {won && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p
              className="text-2xl font-bold text-green-400"
              style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}
            >
              全部配对成功！
            </p>
            <p className="text-zinc-400">用了 {moves} 步</p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/30 transition-colors"
              style={{ boxShadow: "0 0 15px rgba(192, 132, 252, 0.2)" }}
            >
              再玩一局
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
