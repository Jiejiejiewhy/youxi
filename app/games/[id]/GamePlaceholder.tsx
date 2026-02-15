import Link from "next/link";

type Props = { gameId: string; title?: string };

export default function GamePlaceholder({ gameId, title }: Props) {
  const displayTitle = title ?? gameId.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-fuchsia-500/10 rounded-full blur-[80px]" />
      </div>

      <div
        className="relative rounded-2xl border-2 border-cyan-500/40 bg-black/50 backdrop-blur-sm p-10 md:p-14 text-center max-w-md"
        style={{
          boxShadow:
            "0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 50px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="text-6xl mb-6 opacity-90"
          style={{ filter: "drop-shadow(0 0 12px rgba(34, 211, 238, 0.4))" }}
          aria-hidden
        >
          🚧
        </div>
        <h1
          className="text-2xl font-bold text-white mb-2"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}
        >
          {displayTitle}
        </h1>
        <p
          className="text-cyan-300/90 text-lg font-medium mb-6"
          style={{ textShadow: "0 0 15px rgba(34, 211, 238, 0.4)" }}
        >
          游戏开发中，敬请期待
        </p>
        <p className="text-zinc-500 text-sm mb-8">
          我们正在努力打造这款游戏，很快就能和大家见面啦。
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 hover:border-cyan-400/60 transition-all duration-200"
          style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)" }}
        >
          返回大厅
        </Link>
      </div>
    </div>
  );
}
