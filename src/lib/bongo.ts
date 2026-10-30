// Bongo's growth rules: each banana (solved puzzle) grows him; puzzles get bigger as he grows.
export type Stage = "baby" | "young" | "mighty";

export const YOUNG_AT = 3;
export const MIGHTY_AT = 8;

export function stageFor(bananas: number): Stage {
  if (bananas >= MIGHTY_AT) return "mighty";
  if (bananas >= YOUNG_AT) return "young";
  return "baby";
}

/** Grid size grows every 3 bananas: 2x2 → 3x3 → 4x4 → 5x5 (max). */
export function gridFor(bananas: number): number {
  return Math.min(5, 2 + Math.floor(bananas / 3));
}

/** Moves allowed before Bongo goes hungry. */
export function moveLimitFor(n: number): number {
  return n * n * 12;
}
