// Bongo's journey: starts in the Congo forest, visits a new park every PARK_EVERY bananas, ends back home in Congo.
export type Card = { id: string; name: string; emoji: string; kind: "mammal" | "bird" | "reptile" | "primate" | "fish" | "insect" };
export type Park = { id: string; name: string; country: string; flag: string; cards: Card[] };

const c = (id: string, name: string, emoji: string, kind: Card["kind"]): Card => ({ id, name, emoji, kind });

export const PARK_EVERY = 2;

export const PARKS: Park[] = [
  { id: "congo", name: "Congo Rainforest", country: "DR Congo", flag: "🇨🇩", cards: [c("okapi", "Okapi", "🦓", "mammal"), c("forest-elephant", "Forest Elephant", "🐘", "mammal"), c("grey-parrot", "African Grey Parrot", "🦜", "bird"), c("congo-peacock", "Congo Peacock", "🦚", "bird")] },
  { id: "virunga", name: "Virunga", country: "DR Congo", flag: "🇨🇩", cards: [c("mountain-gorilla", "Mountain Gorilla", "🦍", "primate"), c("golden-monkey", "Golden Monkey", "🐒", "primate"), c("chameleon", "Jackson's Chameleon", "🦎", "reptile"), c("turaco", "Rwenzori Turaco", "🐦", "bird")] },
  { id: "bwindi", name: "Bwindi Forest", country: "Uganda", flag: "🇺🇬", cards: [c("chimpanzee", "Chimpanzee", "🐵", "primate"), c("forest-hog", "Giant Forest Hog", "🐗", "mammal"), c("hornbill", "Hornbill", "🐦", "bird"), c("butterfly", "Swallowtail Butterfly", "🦋", "insect")] },
  { id: "queen-elizabeth", name: "Queen Elizabeth", country: "Uganda", flag: "🇺🇬", cards: [c("tree-lion", "Tree-Climbing Lion", "🦁", "mammal"), c("hippo", "Hippo", "🦛", "mammal"), c("kob", "Uganda Kob", "🦌", "mammal"), c("shoebill", "Shoebill", "🦤", "bird")] },
  { id: "murchison", name: "Murchison Falls", country: "Uganda", flag: "🇺🇬", cards: [c("nile-croc", "Nile Crocodile", "🐊", "reptile"), c("rothschild-giraffe", "Rothschild Giraffe", "🦒", "mammal"), c("fish-eagle", "Fish Eagle", "🦅", "bird"), c("nile-perch", "Nile Perch", "🐟", "fish")] },
  { id: "maasai-mara", name: "Maasai Mara", country: "Kenya", flag: "🇰🇪", cards: [c("lion", "Lion", "🦁", "mammal"), c("wildebeest", "Wildebeest", "🐃", "mammal"), c("cheetah", "Cheetah", "🐆", "mammal"), c("ostrich", "Ostrich", "🐦", "bird")] },
  { id: "amboseli", name: "Amboseli", country: "Kenya", flag: "🇰🇪", cards: [c("elephant", "Elephant", "🐘", "mammal"), c("zebra", "Zebra", "🦓", "mammal"), c("crowned-crane", "Crowned Crane", "🐦", "bird"), c("tortoise", "Leopard Tortoise", "🐢", "reptile")] },
  { id: "tsavo", name: "Tsavo", country: "Kenya", flag: "🇰🇪", cards: [c("red-elephant", "Red Elephant", "🐘", "mammal"), c("gerenuk", "Gerenuk", "🦌", "mammal"), c("puff-adder", "Puff Adder", "🐍", "reptile"), c("hornbill-yellow", "Yellow Hornbill", "🐦", "bird")] },
  { id: "serengeti", name: "Serengeti", country: "Tanzania", flag: "🇹🇿", cards: [c("leopard", "Leopard", "🐆", "mammal"), c("hyena", "Spotted Hyena", "🐕", "mammal"), c("vulture", "Vulture", "🦅", "bird"), c("agama", "Agama Lizard", "🦎", "reptile")] },
  { id: "ngorongoro", name: "Ngorongoro Crater", country: "Tanzania", flag: "🇹🇿", cards: [c("black-rhino", "Black Rhino", "🦏", "mammal"), c("flamingo", "Flamingo", "🦩", "bird"), c("buffalo", "Cape Buffalo", "🐃", "mammal"), c("warthog", "Warthog", "🐗", "mammal")] },
  { id: "south-luangwa", name: "South Luangwa", country: "Zambia", flag: "🇿🇲", cards: [c("wild-dog", "African Wild Dog", "🐕", "mammal"), c("carmine", "Carmine Bee-eater", "🐦", "bird"), c("thornicroft", "Thornicroft Giraffe", "🦒", "mammal"), c("monitor", "Nile Monitor", "🦎", "reptile")] },
  { id: "victoria-falls", name: "Victoria Falls", country: "Zimbabwe", flag: "🇿🇼", cards: [c("baboon", "Baboon", "🐒", "primate"), c("otter", "Clawless Otter", "🦦", "mammal"), c("kingfisher", "Kingfisher", "🐦", "bird"), c("tigerfish", "Tigerfish", "🐟", "fish")] },
  { id: "chobe", name: "Chobe", country: "Botswana", flag: "🇧🇼", cards: [c("elephant-herd", "Elephant Herd", "🐘", "mammal"), c("sable", "Sable Antelope", "🦌", "mammal"), c("lilac-roller", "Lilac-breasted Roller", "🐦", "bird"), c("python", "Rock Python", "🐍", "reptile")] },
  { id: "okavango", name: "Okavango Delta", country: "Botswana", flag: "🇧🇼", cards: [c("lechwe", "Red Lechwe", "🦌", "mammal"), c("pel-owl", "Pel's Fishing Owl", "🦉", "bird"), c("croc-delta", "Delta Crocodile", "🐊", "reptile"), c("frog", "Reed Frog", "🐸", "reptile")] },
  { id: "etosha", name: "Etosha", country: "Namibia", flag: "🇳🇦", cards: [c("oryx", "Oryx", "🦌", "mammal"), c("springbok", "Springbok", "🦌", "mammal"), c("meerkat", "Meerkat", "🐿️", "mammal"), c("secretary", "Secretary Bird", "🦅", "bird")] },
  { id: "kruger", name: "Kruger", country: "South Africa", flag: "🇿🇦", cards: [c("white-rhino", "White Rhino", "🦏", "mammal"), c("honey-badger", "Honey Badger", "🦡", "mammal"), c("ground-hornbill", "Ground Hornbill", "🐦", "bird"), c("mamba", "Black Mamba", "🐍", "reptile")] },
  { id: "homecoming", name: "Home to Congo", country: "DR Congo", flag: "🇨🇩", cards: [c("grandpa-silverback", "Grandpa Silverback", "🦍", "primate"), c("mama-gorilla", "Mama Gorilla", "🦍", "primate"), c("bonobo-friend", "Bonobo Best Friend", "🐒", "primate"), c("forest-buffalo", "Forest Buffalo Pal", "🐃", "mammal")] },
];

export const ALL_CARDS = PARKS.flatMap((p) => p.cards);

/** Highest park unlocked for this many bananas (0 = Congo, last = homecoming). */
export function parkIndexFor(bananas: number): number {
  return Math.min(PARKS.length - 1, Math.floor(bananas / PARK_EVERY));
}

export type Upgrade = { id: string; name: string; emoji: string; kind: "tracking" | "camera" | "conservation"; cards: number; perk: string };

/** Gear earned by collecting cards. */
export const UPGRADES: Upgrade[] = [
  { id: "boots", name: "Tracking Boots", emoji: "🥾", kind: "tracking", cards: 3, perk: "+5 moves every puzzle" },
  { id: "zoom", name: "Zoom Camera Lens", emoji: "📷", kind: "camera", cards: 8, perk: "Snap a bonus card each win" },
  { id: "binoculars", name: "Ranger Binoculars", emoji: "🔭", kind: "tracking", cards: 16, perk: "+10 more moves every puzzle" },
  { id: "kit", name: "Conservation Kit", emoji: "🧰", kind: "conservation", cards: 28, perk: "Keep a card even if Bongo goes hungry" },
];

export function upgradesFor(cardCount: number): Upgrade[] {
  return UPGRADES.filter((u) => cardCount >= u.cards);
}

export function bonusMoves(cardCount: number): number {
  const ids = upgradesFor(cardCount).map((u) => u.id);
  return (ids.includes("boots") ? 5 : 0) + (ids.includes("binoculars") ? 10 : 0);
}

/** Next uncollected cards in a park (first those of the park, then any earlier park with gaps). */
function nextCards(parkIdx: number, owned: string[], count: number): string[] {
  const order = [PARKS[parkIdx]!, ...PARKS.slice(0, parkIdx).reverse()];
  const out: string[] = [];
  for (const p of order) for (const card of p.cards) {
    if (out.length >= count) return out;
    if (!owned.includes(card.id) && !out.includes(card.id)) out.push(card.id);
  }
  return out;
}

/** Cards won by solving a puzzle while visiting parkIdx. */
export function winCards(parkIdx: number, owned: string[]): string[] {
  const hasZoom = upgradesFor(owned.length).some((u) => u.id === "zoom");
  return nextCards(parkIdx, owned, hasZoom ? 2 : 1);
}

/** Cards kept when Bongo goes hungry (only with the Conservation Kit). */
export function hungryCards(parkIdx: number, owned: string[]): string[] {
  return upgradesFor(owned.length).some((u) => u.id === "kit") ? nextCards(parkIdx, owned, 1) : [];
}
