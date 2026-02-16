"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const SIZE = 4;
const CELL_PX = 72;
const GAP = 8;

type Dir = "up" | "down" | "left" | "right";

function initGrid(): number[][] {
  const grid = Array(SIZE)
    .fill(0)
    .map(() => Array(SIZE).fill(0));
  addRandom(grid);
  addRandom(grid);
  return grid;
}

function addRandom(grid: number[][]): void {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slideLeft(grid: number[][]): { grid: number[][]; changed: boolean; score: number } {
  let score = 0;
  let changed = false;
  const next = grid.map((row) => {
    const filtered = row.filter((v) => v !== 0);
    const merged: number[] = [];
    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        score += filtered[i] * 2;
        i++;
        changed = true;
      } else {
        merged.push(filtered[i]);
      }
    }
    const newRow = [...merged, ...Array(SIZE - merged.length).fill(0)];
    if (newRow.join(",") !== row.join(",")) changed = true;
    return newRow;
  });
  return { grid: next, changed, score };
}

function slideRight(grid: number[][]): { grid: number[][]; changed: boolean; score: number } {
  const reversed = grid.map((row) => [...row].reverse());
  const { grid: left, changed, score } = slideLeft(reversed);
  return { grid: left.map((row) => row.reverse()), changed, score };
}

function transpose(grid: number[][]): number[][] {
  return grid[0].map((_, c) => grid.map((row) => row[c]));
}

function slideUp(grid: number[][]): { grid: number[][]; changed: boolean; score: number } {
  const trans = transpose(grid);
  const { grid: left, changed, score } = slideLeft(trans);
  return { grid: transpose(left), changed, score };
}

function slideDown(grid: number[][]): { grid: number[][]; changed: boolean; score: number } {
  const trans = transpose(grid);
  const { grid: right, changed, score } = slideRight(trans);
  return { grid: transpose(right), changed, score };
}

function canMove(grid: number[][]): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

const CELL_COLORS: Record<number, string> = {
  0: "bg-zinc-700/50",
  2: "bg-amber-500/90 text-amber-950",
  4: "bg-amber-400 text-amber-950",
  8: "bg-orange-400 text-white",
  16: "bg-orange-500 text-white",
  32: "bg-red-400 text-white",
  64: "bg-red-500 text-white",
  128: "bg-yellow-300 text-yellow-950",
  256: "bg-yellow-400 text-yellow-950",
  512: "bg-yellow-500 text-white",
  1024: "bg-amber-300 text-amber-950",
  2048: "bg-amber-200 text-amber-950",
  4096: "bg-amber-100 text-amber-900",
};

function cellBg(n: number): string {
  return CELL_COLORS[n] ?? "bg-violet-400 text-white";
}

export default function Game2048() {
  const [grid, setGrid] = useState<number[][]>(() => initGrid());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
  }, []);

  const move = useCallback(
    (dir: Dir) => {
      if (gameOver) return;
      setGrid((prevGrid) => {
        let result: { grid: number[][]; changed: boolean; score: number };
        switch (dir) {
          case "left":
            result = slideLeft(prevGrid.map((r) => [...r]));
            break;
          case "right":
            result = slideRight(prevGrid.map((r) => [...r]));
            break;
          case "up":
            result = slideUp(prevGrid.map((r) => [...r]));
            break;
          case "down":
            result = slideDown(prevGrid.map((r) => [...r]));
            break;
        }
        if (!result.changed) return prevGrid;
        setScore((s) => s + result.score);
        addRandom(result.grid);
        if (!canMove(result.grid)) setGameOver(true);
        return result.grid;
      });
    },
    [gameOver]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === " " || e.key === "Enter") reset();
        return;
      }
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          move("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          move("right");
          break;
        case "ArrowUp":
          e.preventDefault();
          move("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          move("down");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move, gameOver, reset]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-orange-500/10 rounded-full blur-[80px]" />
      </div>

      <Link
        href="/"
        className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors"
        style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}
      >
        ← 返回大厅
      </Link>

      <div
        className="relative rounded-2xl border-2 border-amber-500/40 bg-black/50 backdrop-blur-sm p-6"
        style={{
          boxShadow:
            "0 0 25px rgba(245, 158, 11, 0.2), inset 0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-xl font-bold text-amber-400"
            style={{ textShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}
          >
            2048
          </h1>
          <span className="text-zinc-400 text-sm">
            得分: <span className="text-amber-400 font-mono font-bold">{score}</span>
          </span>
        </div>

        <div
          className="rounded-xl p-2 border border-amber-500/30 inline-block"
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            boxShadow: "0 0 15px rgba(245, 158, 11, 0.15)",
          }}
        >
          <div
            className="grid gap-[8px]"
            style={{
              gridTemplateColumns: `repeat(${SIZE}, ${CELL_PX}px)`,
              gridTemplateRows: `repeat(${SIZE}, ${CELL_PX}px)`,
            }}
          >
            {grid.flat().map((value, i) => (
              <div
                key={i}
                className={`rounded-lg flex items-center justify-center font-bold text-2xl transition-all duration-150 ${cellBg(value)}`}
                style={{
                  width: CELL_PX,
                  height: CELL_PX,
                  boxShadow: value ? "0 0 12px rgba(245, 158, 11, 0.2)" : undefined,
                }}
              >
                {value > 0 ? value : ""}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-4">
          方向键 ↑ ↓ ← → 移动方块
        </p>

        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p
              className="text-2xl font-bold text-red-400"
              style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}
            >
              游戏结束
            </p>
            <p className="text-zinc-400">得分: {score}</p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30 transition-colors"
              style={{ boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)" }}
            >
              再玩一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
