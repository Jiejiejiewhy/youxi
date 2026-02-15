"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const SIZE = 9;
const BOX = 3;
const CELL_PX = 36;

// 预置一道有解数独：solution 为答案，puzzle 为开局（0 表示空格）
const SOLUTION = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

const PUZZLE = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function getBox(r: number, c: number): number {
  return Math.floor(r / BOX) * BOX + Math.floor(c / BOX);
}

function checkValid(grid: number[][], r: number, c: number, value: number): boolean {
  for (let i = 0; i < SIZE; i++) if (i !== c && grid[r][i] === value) return false;
  for (let i = 0; i < SIZE; i++) if (i !== r && grid[i][c] === value) return false;
  const br = Math.floor(r / BOX) * BOX;
  const bc = Math.floor(c / BOX) * BOX;
  for (let dr = 0; dr < BOX; dr++)
    for (let dc = 0; dc < BOX; dc++)
      if ((br + dr !== r || bc + dc !== c) && grid[br + dr][bc + dc] === value) return false;
  return true;
}

function isComplete(grid: number[][]): boolean {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!grid[r][c] || !checkValid(grid, r, c, grid[r][c])) return false;
  return true;
}

export default function SudokuGame() {
  const [grid, setGrid] = useState<number[][]>(() => PUZZLE.map((row) => [...row]));
  const [fixed] = useState<boolean[][]>(() =>
    PUZZLE.map((row) => row.map((v) => v !== 0))
  );
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [won, setWon] = useState(false);

  const setCell = useCallback((r: number, c: number, value: number) => {
    if (value < 0 || value > 9) return;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = value;
      if (value > 0 && isComplete(next)) setWon(true);
      return next;
    });
    setSelected([r, c]);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selected) return;
      const [r, c] = selected;
      if (fixed[r][c]) return;
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        setCell(r, c, Number(e.key));
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        setCell(r, c, 0);
      } else if (e.key === "ArrowUp" && r > 0) setSelected([r - 1, c]);
      else if (e.key === "ArrowDown" && r < SIZE - 1) setSelected([r + 1, c]);
      else if (e.key === "ArrowLeft" && c > 0) setSelected([r, c - 1]);
      else if (e.key === "ArrowRight" && c < SIZE - 1) setSelected([r, c + 1]);
    },
    [selected, fixed, setCell]
  );

  const reset = useCallback(() => {
    setGrid(PUZZLE.map((row) => [...row]));
    setSelected(null);
    setWon(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-blue-500/10 rounded-full blur-[80px]" />
      </div>
      <Link
        href="/"
        className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors"
        style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}
      >
        ← 返回大厅
      </Link>
      <div
        className="relative rounded-2xl border-2 border-indigo-500/40 bg-black/50 backdrop-blur-sm p-6"
        style={{ boxShadow: "0 0 25px rgba(99, 102, 241, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-xl font-bold text-indigo-400"
            style={{ textShadow: "0 0 10px rgba(99, 102, 241, 0.5)" }}
          >
            数独大师
          </h1>
        </div>
        <div
          className="rounded-xl p-1 border border-indigo-500/30 inline-block"
          style={{ background: "rgba(99, 102, 241, 0.08)", boxShadow: "0 0 15px rgba(99, 102, 241, 0.15)" }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${SIZE}, ${CELL_PX}px)`,
              gridTemplateRows: `repeat(${SIZE}, ${CELL_PX}px)`,
            }}
          >
            {Array.from({ length: SIZE * SIZE }, (_, i) => {
              const r = Math.floor(i / SIZE);
              const c = i % SIZE;
              const value = grid[r][c];
              const isFixed = fixed[r][c];
              const isSel = selected?.[0] === r && selected?.[1] === c;
              const box = getBox(r, c);
              const borderRight = (c + 1) % BOX === 0 && c !== SIZE - 1;
              const borderBottom = (r + 1) % BOX === 0 && r !== SIZE - 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !isFixed && setSelected([r, c])}
                  className={`flex items-center justify-center text-lg font-semibold rounded transition-colors ${
                    isFixed ? "text-indigo-300 bg-indigo-500/10" : "text-white bg-zinc-800/80 hover:bg-indigo-500/20"
                  } ${isSel ? "ring-2 ring-indigo-400 ring-inset" : ""}`}
                  style={{
                    width: CELL_PX,
                    height: CELL_PX,
                    borderRight: borderRight ? "2px solid rgba(99, 102, 241, 0.5)" : undefined,
                    borderBottom: borderBottom ? "2px solid rgba(99, 102, 241, 0.5)" : undefined,
                  }}
                >
                  {value > 0 ? value : ""}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => selected && !fixed[selected[0]][selected[1]] && setCell(selected[0], selected[1], n)}
              className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30 font-semibold"
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-center text-zinc-500 text-sm mt-3">点击空格后按数字键或下方数字填入，Backspace 清除</p>
        {won && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p
              className="text-2xl font-bold text-green-400"
              style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}
            >
              恭喜过关！
            </p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
              style={{ boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)" }}
            >
              再玩一局
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
