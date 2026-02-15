"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getGameById } from "../data";
import TetrisGame from "./TetrisGame";
import MinesweeperGame from "./MinesweeperGame";
import SudokuGame from "./SudokuGame";
import WhackAMole from "./WhackAMole";
import MemoryGame from "./MemoryGame";

// ---------- 贪吃蛇 ----------
const SNAKE_GRID = 20;
const SNAKE_CELL = 18;
const SNAKE_SPEED_MS = 150;

type SnakeDir = "up" | "down" | "left" | "right";
type SnakePos = { x: number; y: number };

function snakeRandomPos(): SnakePos {
  return { x: Math.floor(Math.random() * SNAKE_GRID), y: Math.floor(Math.random() * SNAKE_GRID) };
}

function snakeSpawnFood(snake: SnakePos[]): SnakePos {
  let food = snakeRandomPos();
  while (snake.some((s) => s.x === food.x && s.y === food.y)) food = snakeRandomPos();
  return food;
}

function SnakeGameInner() {
  const [snake, setSnake] = useState<SnakePos[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<SnakePos>(() => ({ x: 5, y: 5 }));
  const [nextDir, setNextDir] = useState<SnakeDir>("right");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [speedMs, setSpeedMs] = useState(SNAKE_SPEED_MS);

  const reset = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(snakeSpawnFood([{ x: 10, y: 10 }]));
    setNextDir("right");
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setSpeedMs(SNAKE_SPEED_MS);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === " " || e.key === "Enter") reset();
        return;
      }
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setNextDir((d) => (d !== "down" ? "up" : d));
          if (!started) setStarted(true);
          break;
        case "ArrowDown":
          e.preventDefault();
          setNextDir((d) => (d !== "up" ? "down" : d));
          if (!started) setStarted(true);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setNextDir((d) => (d !== "right" ? "left" : d));
          if (!started) setStarted(true);
          break;
        case "ArrowRight":
          e.preventDefault();
          setNextDir((d) => (d !== "left" ? "right" : d));
          if (!started) setStarted(true);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver, started, reset]);

  useEffect(() => {
    if (!started || gameOver) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        let nx = head.x,
          ny = head.y;
        switch (nextDir) {
          case "up": ny = head.y - 1; break;
          case "down": ny = head.y + 1; break;
          case "left": nx = head.x - 1; break;
          case "right": nx = head.x + 1; break;
        }
        if (nx < 0 || nx >= SNAKE_GRID || ny < 0 || ny >= SNAKE_GRID) {
          setGameOver(true);
          return prev;
        }
        if (prev.some((s) => s.x === nx && s.y === ny)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [{ x: nx, y: ny }, ...prev];
        if (food.x === nx && food.y === ny) {
          setScore((s) => s + 1);
          setFood(snakeSpawnFood(newSnake));
          setSpeedMs((ms) => Math.max(80, ms - 5));
          return newSnake;
        }
        newSnake.pop();
        return newSnake;
      });
    }, speedMs);
    return () => clearInterval(id);
  }, [started, gameOver, nextDir, food, speedMs]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-green-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>
        ← 返回大厅
      </Link>
      <div className="relative rounded-2xl border-2 border-green-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(34, 197, 94, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-green-400" style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.5)" }}>贪吃蛇</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-green-400 font-mono font-bold">{score}</span></span>
        </div>
        <div
          className="grid gap-px rounded-lg overflow-hidden border border-green-500/30"
          style={{
            gridTemplateColumns: `repeat(${SNAKE_GRID}, ${SNAKE_CELL}px)`,
            gridTemplateRows: `repeat(${SNAKE_GRID}, ${SNAKE_CELL}px)`,
            width: SNAKE_GRID * SNAKE_CELL + SNAKE_GRID - 1,
            height: SNAKE_GRID * SNAKE_CELL + SNAKE_GRID - 1,
            background: "rgba(34, 197, 94, 0.1)",
          }}
        >
          {Array.from({ length: SNAKE_GRID * SNAKE_GRID }, (_, i) => {
            const x = i % SNAKE_GRID, y = Math.floor(i / SNAKE_GRID);
            const idx = snake.findIndex((s) => s.x === x && s.y === y);
            const head = idx === 0, body = idx > 0, isF = food.x === x && food.y === y;
            return (
              <div
                key={`${x}-${y}`}
                className="rounded-sm transition-colors duration-75"
                style={{
                  width: SNAKE_CELL,
                  height: SNAKE_CELL,
                  background: isF ? "radial-gradient(circle, #fbbf24 40%, #f59e0b)" : head ? "linear-gradient(135deg, #22c55e, #16a34a)" : body ? "rgba(34, 197, 94, 0.6)" : "rgba(15, 15, 20, 0.9)",
                  boxShadow: head ? "0 0 8px rgba(34, 197, 94, 0.8)" : isF ? "0 0 6px rgba(251, 191, 36, 0.8)" : undefined,
                }}
              />
            );
          })}
        </div>
        {!started && <p className="text-center text-zinc-500 text-sm mt-4">按方向键 ↑ ↓ ← → 开始</p>}
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/80 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-red-400" style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}>游戏结束</p>
            <p className="text-zinc-400">得分: {score}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 transition-colors" style={{ boxShadow: "0 0 15px rgba(34, 197, 94, 0.2)" }}>再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- 2048 ----------
const G2048_SIZE = 4;
const G2048_CELL = 72;

function g2048Init(): number[][] {
  const grid = Array(G2048_SIZE).fill(0).map(() => Array(G2048_SIZE).fill(0));
  g2048AddRandom(grid);
  g2048AddRandom(grid);
  return grid;
}

function g2048AddRandom(grid: number[][]): void {
  const empty: [number, number][] = [];
  for (let r = 0; r < G2048_SIZE; r++) for (let c = 0; c < G2048_SIZE; c++) if (grid[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function g2048SlideLeft(grid: number[][]): { grid: number[][]; changed: boolean; score: number } {
  let score = 0, changed = false;
  const next = grid.map((row) => {
    const filtered = row.filter((v) => v !== 0);
    const merged: number[] = [];
    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        score += filtered[i] * 2;
        i++;
        changed = true;
      } else merged.push(filtered[i]);
    }
    const newRow = [...merged, ...Array(G2048_SIZE - merged.length).fill(0)];
    if (newRow.join(",") !== row.join(",")) changed = true;
    return newRow;
  });
  return { grid: next, changed, score };
}

function g2048SlideRight(grid: number[][]): { grid: number[][]; changed: boolean; score: number } {
  const rev = grid.map((r) => [...r].reverse());
  const { grid: left, changed, score } = g2048SlideLeft(rev);
  return { grid: left.map((r) => r.reverse()), changed, score };
}

function g2048Transpose(grid: number[][]): number[][] {
  return grid[0].map((_, c) => grid.map((row) => row[c]));
}

function g2048SlideUp(grid: number[][]): { grid: number[][]; changed: boolean; score: number } {
  const t = g2048Transpose(grid);
  const { grid: left, changed, score } = g2048SlideLeft(t);
  return { grid: g2048Transpose(left), changed, score };
}

function g2048SlideDown(grid: number[][]): { grid: number[][]; changed: boolean; score: number } {
  const t = g2048Transpose(grid);
  const { grid: right, changed, score } = g2048SlideRight(t);
  return { grid: g2048Transpose(right), changed, score };
}

function g2048CanMove(grid: number[][]): boolean {
  for (let r = 0; r < G2048_SIZE; r++) {
    for (let c = 0; c < G2048_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < G2048_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < G2048_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

const G2048_COLORS: Record<number, string> = {
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

function g2048CellBg(n: number): string {
  return G2048_COLORS[n] ?? "bg-violet-400 text-white";
}

function Game2048Inner() {
  const [grid, setGrid] = useState<number[][]>(() => g2048Init());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => {
    setGrid(g2048Init());
    setScore(0);
    setGameOver(false);
  }, []);

  const move = useCallback((dir: "up" | "down" | "left" | "right") => {
    if (gameOver) return;
    let result: { grid: number[][]; changed: boolean; score: number };
    const copy = grid.map((r) => [...r]);
    switch (dir) {
      case "left": result = g2048SlideLeft(copy); break;
      case "right": result = g2048SlideRight(copy); break;
      case "up": result = g2048SlideUp(copy); break;
      case "down": result = g2048SlideDown(copy); break;
    }
    if (!result.changed) return;
    setScore((s) => s + result.score);
    g2048AddRandom(result.grid);
    setGrid(result.grid);
    if (!g2048CanMove(result.grid)) setGameOver(true);
  }, [grid, gameOver]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === " " || e.key === "Enter") reset();
        return;
      }
      switch (e.key) {
        case "ArrowLeft": e.preventDefault(); move("left"); break;
        case "ArrowRight": e.preventDefault(); move("right"); break;
        case "ArrowUp": e.preventDefault(); move("up"); break;
        case "ArrowDown": e.preventDefault(); move("down"); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, gameOver, reset]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-orange-500/10 rounded-full blur-[80px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>
        ← 返回大厅
      </Link>
      <div className="relative rounded-2xl border-2 border-amber-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(245, 158, 11, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-amber-400" style={{ textShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}>2048</h1>
          <span className="text-zinc-400 text-sm">得分: <span className="text-amber-400 font-mono font-bold">{score}</span></span>
        </div>
        <div className="rounded-xl p-2 border border-amber-500/30 inline-block" style={{ background: "rgba(245, 158, 11, 0.08)", boxShadow: "0 0 15px rgba(245, 158, 11, 0.15)" }}>
          <div className="grid gap-[8px]" style={{ gridTemplateColumns: `repeat(${G2048_SIZE}, ${G2048_CELL}px)`, gridTemplateRows: `repeat(${G2048_SIZE}, ${G2048_CELL}px)` }}>
            {grid.flat().map((value, i) => (
              <div
                key={i}
                className={`rounded-lg flex items-center justify-center font-bold text-2xl transition-all duration-150 ${g2048CellBg(value)}`}
                style={{ width: G2048_CELL, height: G2048_CELL, boxShadow: value ? "0 0 12px rgba(245, 158, 11, 0.2)" : undefined }}
              >
                {value > 0 ? value : ""}
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">方向键 ↑ ↓ ← → 移动方块</p>
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-red-400" style={{ textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}>游戏结束</p>
            <p className="text-zinc-400">得分: {score}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30 transition-colors" style={{ boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)" }}>再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- 占位页 ----------
function GamePlaceholderInner({ gameId, title }: { gameId: string; title?: string }) {
  const displayTitle = title ?? gameId.replace(/-/g, " ");
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-fuchsia-500/10 rounded-full blur-[80px]" />
      </div>
      <div className="relative rounded-2xl border-2 border-cyan-500/40 bg-black/50 backdrop-blur-sm p-10 md:p-14 text-center max-w-md" style={{ boxShadow: "0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 50px rgba(0,0,0,0.4)" }}>
        <div className="text-6xl mb-6 opacity-90" style={{ filter: "drop-shadow(0 0 12px rgba(34, 211, 238, 0.4))" }} aria-hidden>🚧</div>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}>{displayTitle}</h1>
        <p className="text-cyan-300/90 text-lg font-medium mb-6" style={{ textShadow: "0 0 15px rgba(34, 211, 238, 0.4)" }}>游戏开发中，敬请期待</p>
        <p className="text-zinc-500 text-sm mb-8">我们正在努力打造这款游戏，很快就能和大家见面啦。</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 hover:border-cyan-400/60 transition-all duration-200" style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)" }}>返回大厅</Link>
      </div>
    </div>
  );
}

// ---------- 动态页入口 ----------
export default function GamePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  if (id === "snake") return <SnakeGameInner />;
  if (id === "2048") return <Game2048Inner />;
  if (id === "tetris") return <TetrisGame />;
  if (id === "minesweeper") return <MinesweeperGame />;
  if (id === "sudoku") return <SudokuGame />;
  if (id === "whack-a-mole") return <WhackAMole />;
  if (id === "memory") return <MemoryGame />;

  const game = getGameById(id);
  return <GamePlaceholderInner gameId={id} title={game?.title} />;
}
