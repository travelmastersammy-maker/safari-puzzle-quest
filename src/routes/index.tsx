import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PuzzleBoard } from "@/components/puzzle-board";
import puzzleLion from "@/assets/puzzle-lion.jpg";
import puzzleElephant from "@/assets/puzzle-elephant.jpg";
import puzzleLeopard from "@/assets/puzzle-leopard.jpg";
import puzzleRhino from "@/assets/puzzle-rhino.jpg";
import puzzleBuffalo from "@/assets/puzzle-buffalo.jpg";
import puzzleMaasai from "@/assets/puzzle-maasai.jpg";
import puzzleSnake from "@/assets/puzzle-snake.jpg";
import bongoBabyAsset from "@/assets/bongo-baby.png.asset.json";
import bongoTeenAsset from "@/assets/bongo-teen.png.asset.json";
import bongoMightyAsset from "@/assets/bongo-mighty.png.asset.json";
import bongoSadAsset from "@/assets/bongo-sad.png.asset.json";

const bongoBaby = bongoBabyAsset.url;
const bongoTeen = bongoTeenAsset.url;
const bongoMighty = bongoMightyAsset.url;
const bongoSad = bongoSadAsset.url;
import { stageFor, gridFor, moveLimitFor, MIGHTY_AT } from "@/lib/bongo";
import { PARKS, ALL_CARDS, UPGRADES, PARK_EVERY, parkIndexFor, winCards, hungryCards, bonusMoves, upgradesFor } from "@/lib/progression";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bongo's Safari Puzzles — Feed the Little Gorilla" },
      { name: "description", content: "Help Bongo the little gorilla solve safari puzzles, earn bananas and grow into a mighty gorilla!" },
      { property: "og:title", content: "Bongo's Safari Puzzles" },
      { property: "og:description", content: "Solve puzzles, feed Bongo bananas and watch him grow mighty!" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

const STAGE = {
  baby: { img: bongoBaby, name: "Baby Bongo" },
  young: { img: bongoTeen, name: "Strong Bongo" },
  mighty: { img: bongoMighty, name: "Mighty King Bongo" },
};

// Puzzle pictures: the Big Five plus a Maasai warrior, cycling as Bongo grows.
const PUZZLES = [
  { img: puzzleLion, name: "Lion", emoji: "🦁" },
  { img: puzzleElephant, name: "Elephant", emoji: "🐘" },
  { img: puzzleLeopard, name: "Leopard", emoji: "🐆" },
  { img: puzzleRhino, name: "Rhino", emoji: "🦏" },
  { img: puzzleBuffalo, name: "Buffalo", emoji: "🐃" },
  { img: puzzleMaasai, name: "Maasai Warrior", emoji: "🛡️" },
];

// Hard levels (4x4 and up) are always the tricky snake puzzle.
const SNAKE = { img: puzzleSnake, name: "Snake", emoji: "🐍" };

function puzzleFor(bananas: number) {
  return gridFor(bananas) >= 4 ? SNAKE : PUZZLES[bananas % PUZZLES.length]!;
}

function shuffle(n: number): number[] {
  const t = Array.from({ length: n * n }, (_, i) => i);
  let blank = n * n - 1;
  let prev = -1;
  for (let k = 0; k < n * n * 25; k++) {
    const r = Math.floor(blank / n), c = blank % n;
    const opts = [r > 0 && blank - n, r < n - 1 && blank + n, c > 0 && blank - 1, c < n - 1 && blank + 1]
      .filter((x): x is number => x !== false && x !== prev);
    const pick = opts[Math.floor(Math.random() * opts.length)]!;
    [t[blank], t[pick]] = [t[pick]!, t[blank]!];
    prev = blank;
    blank = pick;
  }
  return t.every((v, i) => v === i) ? shuffle(n) : t;
}

type Mode = "home" | "play" | "fed" | "hungry";
type Tab = "map" | "dex" | "gear";

function Game() {
  const [bananas, setBananas] = useState(0);
  const [cards, setCards] = useState<string[]>([]);
  const [newCards, setNewCards] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>("map");
  const [mode, setMode] = useState<Mode>("home");
  const [tiles, setTiles] = useState<number[]>([]);
  const [n, setN] = useState(2);
  const [moves, setMoves] = useState(0);
  const [peek, setPeek] = useState(false);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem("bongo-bananas") || 0);
    if (saved) setBananas(saved);
    try { setCards(JSON.parse(localStorage.getItem("bongo-cards") || "[]")); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("bongo-bananas", String(bananas));
    localStorage.setItem("bongo-cards", JSON.stringify(cards));
  }, [bananas, cards, loaded]);

  const stage = STAGE[stageFor(bananas)];
  const parkIdx = parkIndexFor(bananas);
  const park = PARKS[parkIdx]!;
  const limit = moveLimitFor(n) + bonusMoves(cards.length);
  const solved = useMemo(() => tiles.length > 0 && tiles.every((v, i) => v === i), [tiles]);
  const bongoScale = 0.75 + Math.min(bananas, MIGHTY_AT) / MIGHTY_AT * 0.35;

  const puzzle = puzzleFor(puzzleIdx);

  const start = () => {
    const size = gridFor(bananas);
    setPuzzleIdx(bananas);
    setN(size); setTiles(shuffle(size)); setMoves(0); setNewCards([]); setMode("play");
  };

  useEffect(() => {
    if (mode !== "play") return;
    if (solved) {
      const won = winCards(parkIdx, cards);
      setCards((c) => [...c, ...won]); setNewCards(won);
      setBananas((b) => b + 1); setMode("fed");
    } else if (moves >= limit) {
      const kept = hungryCards(parkIdx, cards);
      setCards((c) => [...c, ...kept]); setNewCards(kept);
      setMode("hungry");
    }
  }, [solved, moves, limit, mode, parkIdx, cards]);

  const growth = Math.min(100, (bananas / MIGHTY_AT) * 100);
  const home = park.id === "homecoming";
  const newPark = mode === "fed" && bananas % PARK_EVERY === 0 && parkIndexFor(bananas - 1) < parkIdx;
  const gear = upgradesFor(cards.length);

  if (mode === "home" || mode === "fed" || mode === "hungry") {
    const sad = mode === "hungry";
    return (
      <main className="safari-bg flex min-h-screen flex-col items-center px-5 py-8 text-center">
        <h1 className="font-display text-4xl text-primary leading-none">Bongo's Safari<br />Puzzles</h1>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <div className="pill font-display text-lg">🍌 {bananas}</div>
          <div className="pill font-display text-lg">🃏 {cards.length}/{ALL_CARDS.length}</div>
          <div className="pill font-display text-lg">{park.flag} {park.name}</div>
        </div>

        <div className="relative mt-4 flex h-64 w-full max-w-xs items-end justify-center">
          <img key={mode + bananas} src={sad ? bongoSad : stage.img} alt={sad ? "Hungry Bongo" : stage.name}
            width={816} height={816}
            className={`h-full object-contain ${sad ? "" : "animate-bob"} animate-pop`}
            style={{ transform: `scale(${bongoScale})`, transformOrigin: "bottom" }} />
          {mode === "fed" && <div className="absolute top-2 right-4 text-5xl animate-pop">🍌✨</div>}
        </div>

        <p className="mt-2 font-display text-2xl">
          {mode === "home" && (bananas === 0 ? "Hi! I'm Bongo from the Congo forest! Help me solve puzzles and travel across Africa!" : home ? "I'm home in Congo! My old family friends are here! 🦍❤️" : `${stage.name} is exploring ${park.name}!`)}
          {mode === "fed" && (newPark ? (home ? "I'm back home in Congo! Grandpa, Mama and my friends are so happy! 🦍❤️" : `New park unlocked: ${park.flag} ${park.name}!`) : stageFor(bananas) === "mighty" ? "ROAR! I'm a MIGHTY gorilla! 💪" : "Yum yum! I'm growing big and healthy! 💪")}
          {mode === "hungry" && "Oh no… no banana. My tummy is rumbling and I can't grow. 😢"}
        </p>
        {newCards.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {newCards.map((id) => { const c = ALL_CARDS.find((x) => x.id === id)!; return (
              <div key={id} className="animate-pop rounded-2xl bg-card px-3 py-2 font-bold shadow-pop">New card! {c.emoji} {c.name}</div>
            ); })}
          </div>
        )}

        <div className="mt-4 w-full max-w-xs">
          <div className="flex justify-between text-sm font-extrabold"><span>Baby</span><span>Mighty 👑</span></div>
          <div className="mt-1 h-4 overflow-hidden rounded-full bg-card">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${growth}%` }} />
          </div>
        </div>

        <button onClick={start} className="btn-chunky mt-6 max-w-xs justify-center">
          {mode === "hungry" ? "Try again 🍌" : mode === "fed" ? "Next puzzle ➜" : "Help Bongo! 🍌"}
        </button>
        <p className="mt-3 text-sm font-bold opacity-70">
          Next puzzle: {puzzleFor(bananas).emoji} {puzzleFor(bananas).name} — {gridFor(bananas)}×{gridFor(bananas)}
        </p>

        <div className="mt-6 flex gap-2">
          {(["map", "dex", "gear"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`pill font-display ${tab === t ? "bg-primary text-primary-foreground" : ""}`}>
              {t === "map" ? "🗺️ Journey" : t === "dex" ? "🃏 Cards" : "🎒 Gear"}
            </button>
          ))}
        </div>

        <section className="mt-4 w-full max-w-md text-left">
          {tab === "map" && (
            <ol className="space-y-2">
              {PARKS.map((p, i) => {
                const open = i <= parkIdx;
                const got = p.cards.filter((c) => cards.includes(c.id)).length;
                return (
                  <li key={p.id} className={`flex items-center gap-3 rounded-2xl bg-card px-4 py-2 shadow-pop ${open ? "" : "opacity-50"} ${i === parkIdx ? "ring-2 ring-primary" : ""}`}>
                    <span className="text-2xl">{open ? p.flag : "🔒"}</span>
                    <div className="flex-1">
                      <div className="font-display">{i + 1}. {p.name}</div>
                      <div className="text-xs font-bold opacity-70">{p.country} · {open ? `${got}/${p.cards.length} cards` : `Unlocks at 🍌 ${i * PARK_EVERY}`}</div>
                    </div>
                    {i === parkIdx && <span className="text-xl">🦍</span>}
                  </li>
                );
              })}
            </ol>
          )}
          {tab === "dex" && PARKS.slice(0, parkIdx + 1).map((p) => (
            <div key={p.id} className="mb-3">
              <div className="font-display">{p.flag} {p.name}</div>
              <div className="mt-1 grid grid-cols-4 gap-2">
                {p.cards.map((c) => { const has = cards.includes(c.id); return (
                  <div key={c.id} className="flex flex-col items-center rounded-xl bg-card p-2 text-center shadow-pop">
                    <span className="text-3xl">{has ? c.emoji : "❔"}</span>
                    <span className="text-[10px] font-bold leading-tight">{has ? c.name : "???"}</span>
                    {has && <span className="text-[9px] opacity-60">{c.kind}</span>}
                  </div>
                ); })}
              </div>
            </div>
          ))}
          {tab === "gear" && (
            <ul className="space-y-2">
              {UPGRADES.map((u) => { const has = gear.includes(u); return (
                <li key={u.id} className={`flex items-center gap-3 rounded-2xl bg-card px-4 py-2 shadow-pop ${has ? "" : "opacity-50"}`}>
                  <span className="text-2xl">{has ? u.emoji : "🔒"}</span>
                  <div><div className="font-display">{u.name}</div><div className="text-xs font-bold opacity-70">{u.perk}{has ? "" : ` · needs ${u.cards} cards`}</div></div>
                </li>
              ); })}
            </ul>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="safari-bg flex min-h-screen flex-col items-center px-4 py-6">
      <div className="flex w-full max-w-sm items-center justify-between">
        <button onClick={() => setMode("home")} className="pill">🏠</button>
        <div className={`pill font-display text-xl ${limit - moves <= 10 ? "text-destructive" : ""}`}>
          Moves left: {limit - moves}
        </div>
        <button onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)} className="pill">👀</button>
      </div>

      <div className="mt-3 flex w-full max-w-sm items-center gap-3">
        <img src={stage.img} alt="Bongo" width={816} height={816} className="h-20 w-20 object-contain animate-bob" />
        <div className="rounded-2xl bg-card px-4 py-2 font-bold shadow-pop">{park.flag} {park.name}: help me fix the {puzzle.emoji} {puzzle.name} picture so I get a banana! 🍌</div>
      </div>

      <PuzzleBoard tiles={tiles} size={n} image={puzzle.img} name={puzzle.name} peek={peek}
        onMove={(next) => { setTiles(next); setMoves((m) => m + 1); }} />
    </main>
  );
}
