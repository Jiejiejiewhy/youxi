"use client";

import Link from "next/link";
import { useState } from "react";
import { GAMES } from "./games/data";

const CATEGORIES = [
  { id: "all", label: "全部" },
  { id: "动作", label: "动作" },
  { id: "益智", label: "益智" },
  { id: "休闲", label: "休闲" },
] as const;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredGames =
    activeCategory === "all"
      ? GAMES
      : GAMES.filter((g) => g.tags.includes(activeCategory));

  return (
    <div className="min-h-screen bg-[#0d0d12] text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0d0d12]/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white shrink-0"
            >
              GAME LOBBY
            </Link>
            <nav className="flex flex-wrap gap-1 sm:gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGames.map((game) => (
            <Link
              key={game.id}
              href={game.path}
              className="group block rounded-2xl overflow-hidden bg-[#16161c] border border-white/10 transition-all duration-300 hover:scale-[1.04] hover:border-cyan-400/60 hover:shadow-[0_0_28px_rgba(34,211,238,0.35)] hover:shadow-cyan-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d12]"
            >
              <div
                className={`aspect-[4/3] bg-gradient-to-br ${game.iconColor} flex items-center justify-center text-5xl border-b border-white/5`}
                aria-hidden
              >
                {game.icon}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {game.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                  {game.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <p className="text-center text-zinc-500 py-12">
            该分类下暂无游戏
          </p>
        )}
      </main>
    </div>
  );
}
