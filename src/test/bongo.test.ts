import { describe, it, expect } from "vitest";
import { stageFor, gridFor } from "@/lib/bongo";

describe("Bongo growth", () => {
  it("starts as a baby with no bananas", () => expect(stageFor(0)).toBe("baby"));
  it("becomes mighty after enough bananas", () => expect(stageFor(8)).toBe("mighty"));
  it("puzzles get harder as Bongo is fed", () => {
    expect(gridFor(0)).toBe(2);
    expect(gridFor(3)).toBe(3);
    expect(gridFor(6)).toBe(4);
    expect(gridFor(99)).toBe(5);
  });
});
