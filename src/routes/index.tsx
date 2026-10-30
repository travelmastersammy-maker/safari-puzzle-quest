import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import safari from "@/assets/safari.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Safari Slide — Kids Puzzle Adventure" },
      { name: "description", content: "Slide the tiles to rebuild the African safari! A fun puzzle game for kids." },
      { property: "og:title", content: "Safari Slide — Kids Puzzle Adventure" },
      { property: "og:description", content: "Slide the tiles to rebuild the African safari scene." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

const LEVELS = [
  { n: 2, label: "Cub", emoji: "🐾" },
  { n: 3, label: "Ranger", emoji: "🦓" },
  { n: 4, label: "Explorer", emoji: "🦁" },
];

function solved(n: number) {
  return Array.from({ length: n * n }, (_, i) => i);
}

function shuffle(n: number) {
  let t = solved(n);
  let blank = n * n - 1;
  let prev = -1;
  for (let k = 0; k < n * n * 25; k++) {
    const r = Math.floor(blank / n), c = blank % n;
    const opts = [
      r > 0 && blank - n, r < n - 1 && blank + n, c > 0 && blank - 1, c < n - 1 && blank + 1,
    ].filter((x): x is number => x !== false && x !== prev);
    const pick = opts[Math.floor(Math.random() * opts.length)];
    [t[blank], t[pick]] = [t[pick], t[blank]];
    prev = blank;
    blank = pick;
  }
  if (t.every((v, i) => v === i)) t = shuffle(n);
  return t;
}

function Game() {
  const [level, setLevel] = useState<number | null>(null);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [peek, setPeek] = useState(false);
  const n = level ?? 3;
  const blankVal = n * n - 1;
  const won = useMemo(() => tiles.length > 0 && tiles.every((v, i) => v === i), [tiles]);

  const start = (lvl: number) => {
    setLevel(lvl);
    setTiles(shuffle(lvl));
    setMoves(0);
  };

  useEffect(() => {
    if (won && typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(200);
  }, [won]);

  const tap = (i: number) => {
    if (won) return;
    const b = tiles.indexOf(blankVal);
    const adj = (Math.abs(i - b) === n) || (Math.abs(i - b) === 1 && Math.floor(i / n) === Math.floor(b / n));
    if (!adj) return;
    const t = [...tiles];
    [t[i], t[b]] = [t[b], t[i]];
    setTiles(t);
    setMoves((m) => m + 1);
  };

  if (level === null) {
    return (
      <main className="safari-bg flex min-h-screen flex-col items-center px-5 py-8">
        <h1 className="font-display text-5xl text-primary drop-shadow-sm text-center leading-none">Safari<br />Slide</h1>
        <p className="mt-2 text-center font-bold text-foreground/80">Fix the jungle picture!</p>
        <img src={safari} alt="Safari animals" width={1024} height={1024}
          className="mt-6 w-full max-w-xs rounded-3xl border-4 border-card shadow-pop animate-bob" />
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          {LEVELS.map((l) => (
            <button key={l.n} onClick={() => start(l.n)} className="btn-chunky">
              <span className="text-3xl">{l.emoji}</span>
              <span className="flex-1 text-left">{l.label}</span>
              <span className="text-base opacity-80">{l.n}×{l.n}</span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="safari-bg flex min-h-screen flex-col items-center px-4 py-6">
      <div className="flex w-full max-w-sm items-center justify-between">
        <button onClick={() => setLevel(null)} className="pill">🏠</button>
        <div className="pill font-display text-xl">Moves: {moves}</div>
        <button onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)} className="pill">👀</button>
      </div>

      <div className="relative mt-6 aspect-square w-full max-w-sm rounded-3xl border-4 border-card bg-secondary p-1.5 shadow-pop">
        <div className="grid h-full w-full gap-1.5" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {tiles.map((v, i) => {
            const isBlank = v === blankVal && !won;
            const r = Math.floor(v / n), c = v % n;
            return (
              <button key={v} onClick={() => tap(i)} aria-label={`tile ${v + 1}`}
                className={`rounded-xl transition-transform active:scale-95 ${isBlank ? "bg-secondary/40" : "shadow-md"}`}
                style={isBlank ? undefined : {
                  backgroundImage: `url(${safari})`,
                  backgroundSize: `${n * 100}% ${n * 100}%`,
                  backgroundPosition: `${(c / (n - 1)) * 100}% ${(r / (n - 1)) * 100}%`,
                }} />
            );
          })}
        </div>
        {peek && <img src={safari} alt="" className="absolute inset-0 h-full w-full rounded-3xl object-cover" />}
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-background/70 backdrop-blur-sm animate-pop">
            <div className="text-6xl">🎉🦒🎉</div>
            <h2 className="mt-2 font-display text-4xl text-primary">Jambo! You did it!</h2>
            <p className="font-bold">{moves} moves</p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => start(n)} className="btn-chunky !w-auto">Again</button>
              {n < 4 && <button onClick={() => start(n + 1)} className="btn-chunky !w-auto">Next ➜</button>}
            </div>
          </div>
        )}
      </div>
      <p className="mt-5 text-center font-bold text-foreground/70">Tap a tile next to the empty spot to slide it. Hold 👀 to peek!</p>
    </main>
  );
}
