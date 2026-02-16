"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getGameById } from "../data";
import SnakeGame from "./SnakeGame";
import Game2048 from "./Game2048";
import TetrisGame from "./TetrisGame";
import MinesweeperGame from "./MinesweeperGame";
import SudokuGame from "./SudokuGame";
import WhackAMole from "./WhackAMole";
import MemoryGame from "./MemoryGame";
import GomokuGame from "./GomokuGame";
import MazeGame from "./MazeGame";
import BreakoutGame from "./BreakoutGame";
import BubbleGame from "./BubbleGame";
import RunnerGame from "./RunnerGame";
import SpotDiffGame from "./SpotDiffGame";
import Match3Game from "./Match3Game";
import FighterGame from "./FighterGame";
import PuzzleGame from "./PuzzleGame";
import FishingGame from "./FishingGame";
import ParkourGame from "./ParkourGame";
import HuarongGame from "./HuarongGame";
import FruitCatchGame from "./FruitCatchGame";
import ShootingGame from "./ShootingGame";
import RhythmGame from "./RhythmGame";
import NinjaGame from "./NinjaGame";
import IdiomGame from "./IdiomGame";
import FarmGame from "./FarmGame";
import RacingGame from "./RacingGame";
import LogicGame from "./LogicGame";
import PetGame from "./PetGame";
import SpaceShooterGame from "./SpaceShooterGame";
import TankGame from "./TankGame";

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

  if (id === "snake") return <SnakeGame />;
  if (id === "2048") return <Game2048 />;
  if (id === "tetris") return <TetrisGame />;
  if (id === "minesweeper") return <MinesweeperGame />;
  if (id === "sudoku") return <SudokuGame />;
  if (id === "whack-a-mole") return <WhackAMole />;
  if (id === "memory") return <MemoryGame />;
  if (id === "gomoku") return <GomokuGame />;
  if (id === "maze") return <MazeGame />;
  if (id === "breakout") return <BreakoutGame />;
  if (id === "bubble") return <BubbleGame />;
  if (id === "tank") return <TankGame />;
  if (id === "runner") return <RunnerGame />;
  if (id === "spot-diff") return <SpotDiffGame />;
  if (id === "match3") return <Match3Game />;
  if (id === "fighter") return <FighterGame />;
  if (id === "puzzle") return <PuzzleGame />;
  if (id === "fishing") return <FishingGame />;
  if (id === "parkour") return <ParkourGame />;
  if (id === "huarong") return <HuarongGame />;
  if (id === "fruit-catch") return <FruitCatchGame />;
  if (id === "shooting") return <ShootingGame />;
  if (id === "rhythm") return <RhythmGame />;
  if (id === "ninja") return <NinjaGame />;
  if (id === "idiom") return <IdiomGame />;
  if (id === "farm") return <FarmGame />;
  if (id === "racing") return <RacingGame />;
  if (id === "logic") return <LogicGame />;
  if (id === "pet") return <PetGame />;
  if (id === "space-shooter") return <SpaceShooterGame />;

  const game = getGameById(id);
  return <GamePlaceholderInner gameId={id} title={game?.title} />;
}
