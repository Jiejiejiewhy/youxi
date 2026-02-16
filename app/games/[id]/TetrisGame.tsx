"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COLS = 10;
const ROWS = 20;
const CELL_PX = 22;
const INITIAL_FALL_MS = 700;
const MIN_FALL_MS = 100;

// 7 种方块形状 [行][列]，1 为有格
const SHAPES: number[][][] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
];

const SHAPE_COLORS = [
  "#22d3ee", // I cyan
  "#fbbf24", // O yellow
  "#a78bfa", // T purple
  "#34d399", // S green
  "#f87171", // Z red
  "#60a5fa", // J blue
  "#fb923c", // L orange
];

function rotateShape(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0]?.length ?? 0;
  const next: number[][] = [];
  for (let c = 0; c < cols; c++) {
    next[c] = [];
    for (let r = rows - 1; r >= 0; r--) next[c].push(shape[r][c]);
  }
  return next;
}

type Piece = { shape: number[][]; color: string; r: number; c: number };

function randomPiece(): Piece {
  const i = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[i].map((row) => [...row]),
    color: SHAPE_COLORS[i],
    r: 0,
    c: Math.floor((COLS - (SHAPES[i][0]?.length ?? 0)) / 2),
  };
}

function overlap(board: number[][], piece: Piece, dr = 0, dc = 0): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const nr = piece.r + r + dr;
      const nc = piece.c + c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return true;
      if (board[nr]?.[nc]) return true;
    }
  }
  return false;
}

function merge(board: number[][], piece: Piece): number[][] {
  const next = board.map((row) => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const nr = piece.r + r;
        const nc = piece.c + c;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) next[nr][nc] = 1;
      }
    }
  }
  return next;
}

function clearLines(board: number[][]): { board: number[][]; lines: number } {
  let lines = 0;
  let next = board.map((row) => [...row]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (next[r].every((v) => v !== 0)) {
      next = [Array(COLS).fill(0), ...next.slice(0, r), ...next.slice(r + 1)];
      lines++;
      r++;
    }
  }
  return { board: next, lines };
}

const LINE_SCORE = [0, 100, 300, 500, 800];

export default function TetrisGame() {
  const [board, setBoard] = useState<number[][]>(() =>
    Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(0))
  );
  const [piece, setPiece] = useState<Piece | null>(() => randomPiece());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [fallMs, setFallMs] = useState(INITIAL_FALL_MS);

  const spawn = useCallback(
    (useBoard?: number[][]): Piece | null => {
      const grid = useBoard ?? board;
      const next = randomPiece();
      if (overlap(grid, next)) return null;
      return next;
    },
    [board]
  );

  const reset = useCallback(() => {
    setBoard(
      Array(ROWS)
        .fill(0)
        .map(() => Array(COLS).fill(0))
    );
    setPiece(randomPiece());
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setFallMs(INITIAL_FALL_MS);
  }, []);

  const lock = useCallback(() => {
    if (!piece) return;
    const merged = merge(board, piece);
    const { board: cleared, lines } = clearLines(merged);
    setBoard(cleared);
    if (lines > 0) {
      setScore((s) => s + LINE_SCORE[lines] * level);
      setLevel((l) => {
        const newLevel = Math.min(20, l + Math.floor(lines / 2));
        setFallMs(Math.max(MIN_FALL_MS, INITIAL_FALL_MS - (newLevel - 1) * 35));
        return newLevel;
      });
    }
    const nextPiece = spawn(cleared);
    setPiece(nextPiece);
    if (nextPiece === null) setGameOver(true);
  }, [piece, board, spawn, level]);

  const move = useCallback(
    (dr: number, dc: number) => {
      if (gameOver || !piece) return;
      if (overlap(board, piece, dr, dc)) {
        if (dr > 0) lock();
        return;
      }
      setPiece((p) => p && { ...p, r: p.r + dr, c: p.c + dc });
    },
    [board, piece, gameOver, lock]
  );

  const rotate = useCallback(() => {
    if (gameOver || !piece) return;
    const rotated = { ...piece, shape: rotateShape(piece.shape) };
    if (overlap(board, rotated)) return;
    setPiece(rotated);
  }, [board, piece, gameOver]);

  const hardDrop = useCallback(() => {
    if (gameOver || !piece) return;
    let r = piece.r;
    while (!overlap(board, { ...piece, r: r + 1 })) r++;
    setPiece((p) => p && { ...p, r });
    lock();
  }, [board, piece, gameOver, lock]);

  useEffect(() => {
    if (gameOver || !piece) return;
    const id = setInterval(() => move(1, 0), fallMs);
    return () => clearInterval(id);
  }, [gameOver, piece, fallMs, move]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === " " || e.key === "Enter") reset();
        return;
      }
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          move(0, -1);
          break;
        case "ArrowRight":
          e.preventDefault();
          move(0, 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          move(1, 0);
          break;
        case "ArrowUp":
          e.preventDefault();
          rotate();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, rotate, hardDrop, gameOver, reset]);

  const displayBoard = board.map((row) => [...row]);
  if (piece) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const nr = piece.r + r;
          const nc = piece.c + c;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) displayBoard[nr][nc] = 1;
        }
      }
    }
  }

  const pieceColorMap: Record<number, string> = {};
  if (piece) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const nr = piece.r + r;
          const nc = piece.c + c;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) pieceColorMap[nr * COLS + nc] = piece.color;
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-purple-500/10 rounded-full blur-[80px]" />
      </div>
      <Link
        href="/"
        className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors"
        style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}
      >
        ← 返回大厅
      </Link>
      <div
        className="relative rounded-2xl border-2 border-violet-500/40 bg-black/50 backdrop-blur-sm p-6"
        style={{ boxShadow: "0 0 25px rgba(139, 92, 246, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-xl font-bold text-violet-400"
            style={{ textShadow: "0 0 10px rgba(139, 92, 246, 0.5)" }}
          >
            俄罗斯方块
          </h1>
          <div className="flex gap-4 text-sm">
            <span className="text-zinc-400">
              得分: <span className="text-violet-400 font-mono font-bold">{score}</span>
            </span>
            <span className="text-zinc-400">
              等级: <span className="text-violet-400 font-mono font-bold">{level}</span>
            </span>
          </div>
        </div>
        <div
          className="rounded-lg overflow-hidden border border-violet-500/30 inline-block"
          style={{
            background: "rgba(139, 92, 246, 0.08)",
            boxShadow: "0 0 15px rgba(139, 92, 246, 0.15)",
          }}
        >
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: `repeat(${COLS}, ${CELL_PX}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${CELL_PX}px)`,
            }}
          >
            {displayBoard.flat().map((filled, i) => {
              const color = pieceColorMap[i] ?? (filled ? "#a78bfa" : "transparent");
              return (
                <div
                  key={i}
                  className="rounded-sm transition-colors duration-75"
                  style={{
                    width: CELL_PX,
                    height: CELL_PX,
                    background: filled ? color : "rgba(15, 15, 25, 0.9)",
                    boxShadow: filled ? `0 0 6px ${color}80` : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">
          ↑ 旋转 ← → 左右 ↓ 下落 空格 硬落
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
              className="px-6 py-2 rounded-lg bg-violet-500/20 border border-violet-500/50 text-violet-400 hover:bg-violet-500/30 transition-colors"
              style={{ boxShadow: "0 0 15px rgba(139, 92, 246, 0.2)" }}
            >
              再玩一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
