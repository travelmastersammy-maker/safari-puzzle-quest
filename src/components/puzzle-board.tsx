import { useRef, useState, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { moveIntoEmpty } from "@/lib/puzzle-move";

type Drag = { value: number; from: number; pointerId: number; x: number; y: number; dx: number; dy: number; overEmpty: boolean };

export function PuzzleBoard({ tiles, size, image, name, peek, onMove }: {
  tiles: number[]; size: number; image: string; name: string; peek: boolean;
  onMove: (tiles: number[]) => void;
}) {
  const board = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const blank = tiles.indexOf(size * size - 1);

  function overEmpty(x: number, y: number) {
    const rect = board.current?.getBoundingClientRect();
    if (!rect || x < rect.left || y < rect.top || x >= rect.right || y >= rect.bottom) return false;
    return Math.floor((y - rect.top) / (rect.height / size)) * size +
      Math.floor((x - rect.left) / (rect.width / size)) === blank;
  }

  function finish(event: PointerEvent<HTMLButtonElement>) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (overEmpty(event.clientX, event.clientY)) {
      const next = moveIntoEmpty(tiles, size, drag.from);
      if (next) onMove(next);
    }
    setDrag(null);
  }

  return (
    <div className="relative mt-4 aspect-square w-full max-w-sm rounded-3xl border-4 border-card bg-secondary p-1.5 shadow-pop">
      <div ref={board} className="relative h-full w-full touch-none select-none" aria-label={`${name} puzzle`}>
        <div aria-label="Empty box" className={`absolute rounded-lg border-2 border-dashed transition-colors ${drag?.overEmpty && moveIntoEmpty(tiles, size, drag.from) ? "border-primary bg-primary/20" : "border-card/50 bg-secondary/40"}`}
          style={{ width: `calc(100% / ${size} - 4px)`, height: `calc(100% / ${size} - 4px)`, left: `calc(${blank % size * 100 / size}% + 2px)`, top: `calc(${Math.floor(blank / size) * 100 / size}% + 2px)` }} />
        {tiles.filter((v) => v !== size * size - 1).map((value) => {
          const index = tiles.indexOf(value);
          const active = drag?.value === value;
          return (
            <Button key={value} variant="ghost" aria-label={`tile ${value + 1}`}
              className={`absolute touch-none rounded-lg p-0 shadow-md hover:bg-transparent focus-visible:z-20 ${active ? "z-30 cursor-grabbing ring-2 ring-primary" : "cursor-grab"}`}
              onPointerDown={(event) => {
                if (drag || peek || event.button !== 0) return;
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                setDrag({ value, from: index, pointerId: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0, overEmpty: false });
              }}
              onPointerMove={(event) => {
                if (!drag || drag.pointerId !== event.pointerId || !active) return;
                setDrag({ ...drag, dx: event.clientX - drag.x, dy: event.clientY - drag.y, overEmpty: overEmpty(event.clientX, event.clientY) });
              }}
              onPointerUp={finish}
              onPointerCancel={() => setDrag(null)}
              onLostPointerCapture={() => setDrag(null)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                const next = moveIntoEmpty(tiles, size, index);
                if (next) onMove(next);
              }}
              style={{
                width: `calc(100% / ${size} - 4px)`, height: `calc(100% / ${size} - 4px)`,
                left: `calc(${index % size * 100 / size}% + 2px)`, top: `calc(${Math.floor(index / size) * 100 / size}% + 2px)`,
                transform: active ? `translate(${drag.dx}px, ${drag.dy}px)` : "translate(0, 0)",
                transition: active ? "none" : "left 180ms ease-out, top 180ms ease-out, transform 180ms ease-out",
                backgroundImage: `url(${image})`, backgroundSize: `${size * 100}% ${size * 100}%`,
                backgroundPosition: `${value % size / (size - 1) * 100}% ${Math.floor(value / size) / (size - 1) * 100}%`,
              }} />
          );
        })}
      </div>
      {peek && <img src={image} alt={name} className="pointer-events-none absolute inset-0 z-40 h-full w-full rounded-3xl object-cover" />}
    </div>
  );
}