export type Game = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  path: string;
  icon: string;
  iconColor: string;
};

export const GAMES: Game[] = [
  { id: "snake", title: "贪吃蛇", description: "经典蛇吃豆，用方向键控制，越长越好。", tags: ["休闲", "益智"], path: "/games/snake", icon: "🐍", iconColor: "from-green-500 to-emerald-600" },
  { id: "2048", title: "2048", description: "合并数字方块，冲向 2048 甚至更高。", tags: ["益智"], path: "/games/2048", icon: "🔢", iconColor: "from-amber-400 to-orange-500" },
  { id: "tetris", title: "俄罗斯方块", description: "旋转落下方块，消除整行，挑战高分。", tags: ["益智", "休闲"], path: "/games/tetris", icon: "🧱", iconColor: "from-violet-500 to-purple-600" },
  { id: "minesweeper", title: "扫雷", description: "推理数字，标记地雷，安全翻开所有格子。", tags: ["益智"], path: "/games/minesweeper", icon: "💣", iconColor: "from-zinc-400 to-zinc-600" },
  { id: "gomoku", title: "五子棋", description: "黑白对弈，先连五子者胜。", tags: ["益智", "休闲"], path: "/games/gomoku", icon: "⚫", iconColor: "from-slate-300 to-slate-600" },
  { id: "whack-a-mole", title: "打地鼠", description: "地鼠冒出时快速敲击，考验反应力。", tags: ["休闲", "动作"], path: "/games/whack-a-mole", icon: "🔨", iconColor: "from-rose-500 to-pink-600" },
  { id: "maze", title: "走迷宫", description: "在迷宫中找到出口，锻炼空间感。", tags: ["益智", "休闲"], path: "/games/maze", icon: "🌀", iconColor: "from-cyan-400 to-teal-500" },
  { id: "breakout", title: "打砖块", description: "用挡板反弹小球击碎砖块。", tags: ["休闲", "动作"], path: "/games/breakout", icon: "🟠", iconColor: "from-orange-400 to-red-500" },
  { id: "sudoku", title: "数独大师", description: "逻辑填数，锻炼思维。", tags: ["益智"], path: "/games/sudoku", icon: "📐", iconColor: "from-indigo-500 to-blue-600" },
  { id: "memory", title: "记忆翻牌", description: "翻开卡片配对，考验记忆力。", tags: ["益智", "休闲"], path: "/games/memory", icon: "🃏", iconColor: "from-fuchsia-500 to-pink-600" },
  { id: "bubble", title: "泡泡龙", description: "消除同色泡泡，清空关卡。", tags: ["休闲", "益智"], path: "/games/bubble", icon: "🫧", iconColor: "from-sky-400 to-cyan-500" },
  { id: "tank", title: "坦克大战", description: "驾驶坦克摧毁敌方基地。", tags: ["动作"], path: "/games/tank", icon: "🚀", iconColor: "from-lime-500 to-green-600" },
  { id: "runner", title: "极速跑酷", description: "在无尽赛道上躲避障碍，挑战最高分。", tags: ["动作", "休闲"], path: "/games/runner", icon: "🏃", iconColor: "from-yellow-400 to-amber-500" },
  { id: "spot-diff", title: "找不同", description: "在两幅图中找出所有差异。", tags: ["益智", "休闲"], path: "/games/spot-diff", icon: "🔍", iconColor: "from-amber-300 to-yellow-500" },
  { id: "match3", title: "消消乐", description: "三连消除，闯关收集星星。", tags: ["休闲", "益智"], path: "/games/match3", icon: "⭐", iconColor: "from-yellow-300 to-amber-400" },
  { id: "fighter", title: "格斗小子", description: "横版格斗，连招制敌。", tags: ["动作"], path: "/games/fighter", icon: "🥋", iconColor: "from-red-500 to-rose-600" },
  { id: "puzzle", title: "拼图挑战", description: "将碎片拼成完整图片。", tags: ["益智"], path: "/games/puzzle", icon: "🧩", iconColor: "from-emerald-400 to-green-600" },
  { id: "fishing", title: "钓鱼达人", description: "在限定时间内钓到更多鱼。", tags: ["休闲"], path: "/games/fishing", icon: "🎣", iconColor: "from-blue-400 to-indigo-500" },
  { id: "parkour", title: "跑酷冒险", description: "跳跃、滑铲穿越重重关卡。", tags: ["动作", "休闲"], path: "/games/parkour", icon: "🦘", iconColor: "from-orange-500 to-red-600" },
  { id: "huarong", title: "华容道", description: "移动方块，让曹操逃出重围。", tags: ["益智"], path: "/games/huarong", icon: "📦", iconColor: "from-stone-400 to-stone-600" },
  { id: "fruit-catch", title: "接水果", description: "移动篮子接住掉落的水果。", tags: ["休闲"], path: "/games/fruit-catch", icon: "🍎", iconColor: "from-red-400 to-rose-500" },
  { id: "shooting", title: "射击靶场", description: "瞄准靶心，打出高分。", tags: ["动作", "休闲"], path: "/games/shooting", icon: "🎯", iconColor: "from-rose-400 to-red-500" },
  { id: "rhythm", title: "节奏大师", description: "跟随节奏点击，打出完美连击。", tags: ["休闲", "动作"], path: "/games/rhythm", icon: "🎵", iconColor: "from-pink-500 to-rose-500" },
  { id: "ninja", title: "忍者传说", description: "潜行与忍术，完成暗杀任务。", tags: ["动作"], path: "/games/ninja", icon: "🥷", iconColor: "from-slate-600 to-black" },
  { id: "idiom", title: "成语接龙", description: "根据提示接出正确成语。", tags: ["益智"], path: "/games/idiom", icon: "📜", iconColor: "from-amber-600 to-yellow-700" },
  { id: "farm", title: "种田模拟", description: "种植、收获，经营你的农场。", tags: ["休闲"], path: "/games/farm", icon: "🌾", iconColor: "from-lime-600 to-green-700" },
  { id: "racing", title: "赛车狂飙", description: "弯道超车，争夺第一。", tags: ["动作", "休闲"], path: "/games/racing", icon: "🏎️", iconColor: "from-red-600 to-orange-600" },
  { id: "logic", title: "逻辑谜题", description: "根据条件推理出唯一解。", tags: ["益智"], path: "/games/logic", icon: "🧠", iconColor: "from-violet-400 to-purple-500" },
  { id: "pet", title: "养宠物", description: "喂食、玩耍，陪伴虚拟宠物。", tags: ["休闲"], path: "/games/pet", icon: "🐱", iconColor: "from-amber-400 to-orange-400" },
  { id: "space-shooter", title: "太空射击", description: "在宇宙中消灭入侵者。", tags: ["动作", "休闲"], path: "/games/space-shooter", icon: "👾", iconColor: "from-cyan-500 to-blue-600" },
];

export function getGameById(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}
