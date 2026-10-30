export function moveIntoEmpty(tiles: number[], size: number, from: number): number[] | null {
  const empty = tiles.indexOf(size * size - 1);
  if (empty < 0 || from < 0 || from >= tiles.length || from === empty) return null;
  const adjacent = Math.abs(from - empty) === size ||
    (Math.abs(from - empty) === 1 && Math.floor(from / size) === Math.floor(empty / size));
  if (!adjacent) return null;
  const piece = tiles[from];
  const blank = tiles[empty];
  if (piece === undefined || blank === undefined) return null;
  const next = [...tiles];
  next[empty] = piece;
  next[from] = blank;
  return next;
}