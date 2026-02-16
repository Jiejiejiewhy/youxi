"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 10;
const ROWS = 5;
const BRICK_W = 44;
const BRICK_H = 18;
const PADDLE_W = 80;
const PADDLE_H = 12;
const BALL_R = 6;
const AREA_W = COLS * BRICK_W;
const AREA_H = 320;

export default function BreakoutGame() {
  const [paddleX, setPaddleX] = useState(AREA_W / 2 - PADDLE_W / 2);
  const [ball, setBall] = useState({ x: AREA_W / 2, y: AREA_H - 60, dx: 4, dy: -4 });
  const [bricks, setBricks] = useState<boolean[][]>(() => Array(ROWS).fill(0).map(() => Array(COLS).fill(true)));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const ballRef = useRef(ball);
  const paddleRef = useRef(paddleX);
  ballRef.current = ball;
  paddleRef.current = paddleX;

  const reset = useCallback(() => {
    setPaddleX(AREA_W / 2 - PADDLE_W / 2);
    setBall({ x: AREA_W / 2, y: AREA_H - 60, dx: 4, dy: -4 });
    setBricks(Array(ROWS).fill(0).map(() => Array(COLS).fill(true)));
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => {
    if (gameOver || won) return;
    const id = setInterval(() => {
      const b = ballRef.current;
      const px = paddleRef.current;
      let nx = b.x + b.dx, ny = b.y + b.dy, dx = b.dx, dy = b.dy;
      if (nx <= BALL_R || nx >= AREA_W - BALL_R) dx = -dx;
      if (ny <= BALL_R) dy = -dy;
      if (ny >= AREA_H - BALL_R - PADDLE_H - 10) {
        if (nx >= px && nx <= px + PADDLE_W && ny <= AREA_H - PADDLE_H - 10 + BALL_R) dy = -Math.abs(dy);
        else if (ny > AREA_H) setGameOver(true);
      }
      ballRef.current = { x: nx, y: ny, dx, dy };
      setBall(ballRef.current);
      setBricks((prev) => {
        const next = prev.map((row) => [...row]);
        const by = Math.floor((ballRef.current.y - BALL_R) / BRICK_H);
        const bx = Math.floor(ballRef.current.x / BRICK_W);
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS && next[by][bx]) {
          next[by][bx] = false;
          dy = -dy;
          ballRef.current = { x: nx, y: ny, dx, dy };
          setBall(ballRef.current);
        }
        const allGone = next.flat().every((v) => !v);
        if (allGone) setWon(true);
        return next;
      });
    }, 16);
    return () => clearInterval(id);
  }, [gameOver, won]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPaddleX((x) => Math.max(0, x - 24));
      if (e.key === "ArrowRight") setPaddleX((x) => Math.min(AREA_W - PADDLE_W, x + 24));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>
      <Link href="/" className="relative z-10 text-cyan-400/80 hover:text-cyan-300 text-sm mb-4 transition-colors" style={{ textShadow: "0 0 8px rgba(34, 211, 238, 0.4)" }}>← 返回大厅</Link>
      <div className="relative rounded-2xl border-2 border-orange-500/40 bg-black/50 backdrop-blur-sm p-6" style={{ boxShadow: "0 0 25px rgba(249, 115, 22, 0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <h1 className="text-xl font-bold text-orange-400 mb-4" style={{ textShadow: "0 0 10px rgba(249, 115, 22, 0.5)" }}>打砖块</h1>
        <div className="relative rounded-lg border border-orange-500/30 overflow-hidden" style={{ width: AREA_W, height: AREA_H, background: "rgba(249, 115, 22, 0.06)" }}>
          {bricks.map((row, r) => row.map((alive, c) => alive && (
            <div key={`${r}-${c}`} className="absolute rounded bg-orange-500" style={{ left: c * BRICK_W + 2, top: r * BRICK_H + 2, width: BRICK_W - 4, height: BRICK_H - 4 }} />
          )))}
          <div className="absolute rounded-full bg-amber-400" style={{ left: ball.x - BALL_R, top: ball.y - BALL_R, width: BALL_R * 2, height: BALL_R * 2, boxShadow: "0 0 10px rgba(251, 191, 36, 0.8)" }} />
          <div className="absolute rounded-lg bg-orange-400" style={{ left: paddleX, top: AREA_H - PADDLE_H - 10, width: PADDLE_W, height: PADDLE_H }} />
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">← → 移动挡板，打掉所有砖块</p>
        {(gameOver || won) && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 flex flex-col items-center justify-center gap-4">
            <p className="text-2xl font-bold text-green-400" style={{ textShadow: "0 0 15px rgba(34, 197, 94, 0.6)" }}>{won ? "过关！" : "游戏结束"}</p>
            <button type="button" onClick={reset} className="px-6 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30">再玩一次</button>
          </div>
        )}
      </div>
    </div>
  );
}
