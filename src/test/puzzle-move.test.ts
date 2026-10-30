import { describe, expect, it } from "vitest";
import { moveIntoEmpty } from "@/lib/puzzle-move";

describe("dropping into the empty box", () => {
  it("snaps a neighboring piece into the empty box without moving other pieces", () => {
    expect(moveIntoEmpty([0, 1, 3, 2], 2, 3)).toEqual([0, 1, 2, 3]);
  });
  it("preserves sliding-puzzle rules for non-neighboring pieces", () => {
    expect(moveIntoEmpty([0, 1, 2, 3], 2, 0)).toBeNull();
    expect(moveIntoEmpty([0, 1, 2, 3, 4, 5, 6, 7, 8], 3, 5)).toEqual([0, 1, 2, 3, 4, 8, 6, 7, 5]);
    expect(moveIntoEmpty([0, 1, 2, 3, 4, 5, 6, 7, 8], 3, 2)).toBeNull();
  });
  it("does not wrap across rows or move the empty box", () => {
    expect(moveIntoEmpty([0, 1, 2, 8, 4, 5, 6, 7, 3], 3, 2)).toBeNull();
    expect(moveIntoEmpty([0, 1, 2, 3], 2, 3)).toBeNull();
  });
});