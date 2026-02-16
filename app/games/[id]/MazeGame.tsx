"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const ROWS = 11;
const COLS = 11;
const CELL_PX = 32;

function generateMaze(): boolean[][] {
  const grid = Array(ROWS).fill(0).map(() => Array(COLS).fill(true));
  function carve(r: number, c: number) {
    grid[r][c] = false;
    const dirs = [[-2, 0], [2, 0], [0, -2], [0, 2]].sort(() => Math.random() - 0.5);
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && grid[nr][nc]) {
        grid[r + dr / 2][c + dc / 2] = false;
        carve(nr, nc);
      }
    }
  }
  carve(1, 1);
  grid[0][1] = false;
  grid[ROWS - 1][COLS - 2] = false;
  return grid;
}

export default function MazeGame() {
  const [maze, setMaze] = useState<boolean[][]>(() => generateMaze());
  const [pos, setPos] = useState({ r: 0, c: 1 });
  const [won, setWon] = useState(false);

  const reset = useCallback(() => {
    setMaze(generateMaze());
    setPos({ r: 0, c: 1 });
    setWon(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      setPos((p) => {
        let nr = p.r, nc = p.c;
        if (e.key === "ArrowUp") nr--;
        else if (e.key === "ArrowDown") nr++;
        else if (e.key === "ArrowLeft") nc--;
        else if (e.key === "ArrowRight") nc++;
        else return p;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || maze[nr][nc]) return p;
        if (nr === ROWS - 1 && nc === COLS - 2) setWon(true);
        return { r: nr, c: nc };
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maze, won]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-teal-500/10 rounded-full blur-[80px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-cyan-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(34, 211, 238, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <h1 className="text-xl font-bold text-cyan-400 mb-4" style={{ textShadow: "0 0 10px rgba(34, 211, 238, 0.5)" }}>走迷宫</h1>
        <div className="inline-block rounded-lg border border-cyan-500/30 p-1" style={{ background: "rgba(34, 211, 238, 0.08)" }}>
          <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${ROWS}, ${CELL_PX}px)` }}>
            {maze.flat().map((wall, i) => {
              const r = Math.floor(i / COLS), c = i % COLS;
              const isPlayer = pos.r === r && pos.c === c;
              const isExit = r === ROWS - 1 && c === COLS - 2;
              return (
                <div key={i} className="rounded-sm" style={{
                  width: CELL_PX, height: CELL_PX,
                  background: isPlayer ? "#22d3ee" : isExit ? "#34d399" : wall ? "#1e293b" : "#0f172a",
                  boxShadow: isPlayer ? "0 0 10px rgba(34, 211, 238, 0.8)" : undefined,
                }} />
              );
            })}
          </div>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">方向键移动，到达绿色出口即过关</p>
        {won && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>过关！</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30">再玩一局</button>
          </div>
        )}
      </div>
    </div>
  );
}
