import { describe, it, expect } from "vitest";
import { PARKS, parkIndexFor, winCards, hungryCards, bonusMoves, ALL_CARDS } from "@/lib/progression";

describe("journey", () => {
  it("starts in Congo and ends back home in Congo", () => {
    expect(PARKS[0]!.id).toBe("congo");
    expect(PARKS[PARKS.length - 1]!.id).toBe("homecoming");
  });
  it("unlocks a new park every 2 bananas, capped at homecoming", () => {
    expect(parkIndexFor(0)).toBe(0);
    expect(parkIndexFor(2)).toBe(1);
    expect(parkIndexFor(999)).toBe(PARKS.length - 1);
  });
});

describe("rewards", () => {
  it("first win gives one card from the current park", () => {
    expect(winCards(0, [])).toEqual(["okapi"]);
  });
  it("zoom lens (8 cards) gives two cards per win", () => {
    const owned = ALL_CARDS.slice(0, 8).map((c) => c.id);
    expect(winCards(2, owned)).toHaveLength(2);
  });
  it("hungry gives nothing without the conservation kit", () => {
    expect(hungryCards(0, [])).toEqual([]);
  });
  it("boots add 5 moves at 3 cards, binoculars 10 more at 16", () => {
    expect(bonusMoves(2)).toBe(0);
    expect(bonusMoves(3)).toBe(5);
    expect(bonusMoves(16)).toBe(15);
  });
});
