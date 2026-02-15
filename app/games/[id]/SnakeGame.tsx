"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED_MS = 150;

type Dir = "up" | "down" | "left" | "right";
type Pos = { x: number; y: number };

function randomPos(): Pos {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

function spawnFood(snake: Pos[]): Pos {
  let food = randomPos();
  while (snake.some((s) => s.x === food.x && s.y === food.y)) {
    food = randomPos();
  }
  return food;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Pos[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Pos>(() => ({ x: 5, y: 5 }));
  const [nextDirection, setNextDirection] = useState<Dir>("right");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [speedMs, setSpeedMs] = useState(INITIAL_SPEED_MS);

  const reset = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(spawnFood([{ x: 10, y: 10 }]));
    setNextDirection("right");
    setScore(0);
    setGameOver(false);
    setStarted(true);
    setSpeedMs(INITIAL_SPEED_MS);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === " " || e.key === "Enter") reset();
        return;
      }
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setNextDirection((d) => (d !== "down" ? "up" : d));
          if (!started) setStarted(true);
          break;
        case "ArrowDown":
          e.preventDefault();
          setNextDirection((d) => (d !== "up" ? "down" : d));
          if (!started) setStarted(true);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setNextDirection((d) => (d !== "right" ? "left" : d));
          if (!started) setStarted(true);
          break;
        case "ArrowRight":
          e.preventDefault();
          setNextDirection((d) => (d !== "left" ? "right" : d));
          if (!started) setStarted(true);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, started, reset]);

  useEffect(() => {
    if (!started || gameOver) return;

    const id = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        let nx = head.x;
        let ny = head.y;
        switch (nextDirection) {
          case "up":
            ny = head.y - 1;
            break;
          case "down":
            ny = head.y + 1;
            break;
          case "left":
            nx = head.x - 1;
            break;
          case "right":
            nx = head.x + 1;
            break;
        }

        if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }
        if (prev.some((s) => s.x === nx && s.y === ny)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [{ x: nx, y: ny }, ...prev];
        const ate = food.x === nx && food.y === ny;
        if (ate) {
          setScore((s) => s + 1);
          setFood(spawnFood(newSnake));
          setSpeedMs((ms) => Math.max(80, ms - 5));
          return newSnake;
        }
        newSnake.pop();
        return newSnake;
      });
    }, speedMs);

    return () => clearInterval(id);
  }, [started, gameOver, nextDirection, food, speedMs]);

  const isFood = (x: number, y: number) => food.x === x && food.y === y;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-green-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px]" />
      </div>

      <Link
        href="/"
        className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors"
        style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}
      >
        ← 返回大厅
      </Link>

      <div
        className="relative rounded-2xl border-2 border-green-500/40 bg-black/50 backdrop-blur-sm p-6"
        style={{
          boxShadow:
            "0 0 25px rgba(34, 197, 94, 0.2), inset 0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-xl font-bold text-green-400"
            style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.5)" }}
          >
            贪吃蛇
          </h1>
          <span className="text-zinc-400 text-sm">
            得分: <span className="text-green-400 font-mono font-bold">{score}</span>
          </span>
        </div>

        <div
          className="grid gap-px rounded-lg overflow-hidden border border-green-500/30"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            width: GRID_SIZE * CELL_SIZE + GRID_SIZE - 1,
            height: GRID_SIZE * CELL_SIZE + GRID_SIZE - 1,
            background: "rgba(34, 197, 94, 0.1)",
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeIndex = snake.findIndex((s) => s.x === x && s.y === y);
            const head = snakeIndex === 0;
            const body = snakeIndex > 0;
            const isF = isFood(x, y);
            return (
              <div
                key={`${x}-${y}`}
                className="rounded-sm transition-colors duration-75"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  background: isF
                    ? "radial-gradient(circle, #fbbf24 40%, #f59e0b)"
                    : head
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : body
                        ? "rgba(34, 197, 94, 0.6)"
                        : "rgba(15, 15, 20, 0.9)",
                  boxShadow: head
                    ? "0 0 8px rgba(34, 197, 94, 0.8)"
                    : isF
                      ? "0 0 6px rgba(251, 191, 36, 0.8)"
                      : undefined,
                }}
              />
            );
          })}
        </div>

        {!started && (
          <p className="text-center text-zinc-500 text-sm mt-4">
            按方向键 ↑ ↓ ← → 开始
          </p>
        )}
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/80 flex flex-col items-center justify-center gap-4">
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
              className="px-6 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 transition-colors"
              style={{ boxShadow: "0 0 15px rgba(34, 197, 94, 0.2)" }}
            >
              再玩一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
