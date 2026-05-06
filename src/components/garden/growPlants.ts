import type { Plant } from "@/types";
import { gruvbox } from "@/themes/gruvbox";

interface Pattern {
  lines: string[];
  accent: number[];
  colors: string[];
}

interface AnimatedPattern {
  frames: string[][];
  accent: number[];
  colors: string[];
  minMs: number;
  maxMs: number;
}

type PatternEntry
  = | { kind: "fixed"; pattern: Pattern; weight: number }
    | { kind: "animated"; pattern: AnimatedPattern; weight: number };

function buildColors(count: number, accent: number[], accentColor: string): string[] {
  return Array.from({ length: count }, (_, i) =>
    accent.includes(i) ? accentColor : gruvbox["green-h"]);
}

function pickColor(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

function spawnFixed(p: Pattern): Plant {
  const c = buildColors(p.lines.length, p.accent, pickColor(p.colors));
  return {
    update() {},
    getLines: () => p.lines,
    getColors: () => c,
  };
}

function spawnAnimated(p: AnimatedPattern): Plant {
  const c = buildColors(p.frames[0].length, p.accent, pickColor(p.colors));
  let frame = Math.floor(Math.random() * p.frames.length);
  let nextTime = Date.now() + p.minMs + Math.random() * (p.maxMs - p.minMs);

  return {
    update(now: number) {
      if (now >= nextTime) {
        frame = (frame + 1) % p.frames.length;
        nextTime = now + p.minMs + Math.random() * (p.maxMs - p.minMs);
      }
    },
    getLines: () => p.frames[frame],
    getColors: () => c,
  };
}

// --- Patterns ---

const SWAY: AnimatedPattern = {
  frames: [[" (*)", ">/  "], ["(*) ", ">\\"]],
  accent: [0],
  colors: [gruvbox.fg1, gruvbox["purple-h"]],
  minMs: 800,
  maxMs: 3000,
};

const WAVE: AnimatedPattern = {
  frames: [["\\|/"], ["\\ |/"], ["\\| /"]],
  accent: [0],
  colors: [gruvbox["green-h"]],
  minMs: 600,
  maxMs: 2400,
};

const BLOOM: Pattern = {
  lines: ["(o)", "\\|/"],
  accent: [0],
  colors: [gruvbox["red-h"]],
};

const SPROUT: Pattern = {
  lines: [" .", "\\|", "^^^"],
  accent: [0],
  colors: [gruvbox["yellow-h"], gruvbox["red-h"]],
};

const SPIKE: Pattern = {
  lines: [".", "|"],
  accent: [0],
  colors: [gruvbox["orange-h"], gruvbox["yellow-h"]],
};

const CROWN: Pattern = {
  lines: ["  @  ", " \\|/ ", " ^^^ "],
  accent: [0],
  colors: [gruvbox["blue-h"], gruvbox["aqua-h"], gruvbox["purple-h"]],
};

const DROOP: Pattern = {
  lines: [" vvv ", "  Y  ", "^^^^^"],
  accent: [0],
  colors: [gruvbox["aqua-h"], gruvbox["blue-h"]],
};

const TUFT: Pattern = {
  lines: [",,,", "~Y~", "\\|/", "^^^"],
  accent: [0],
  colors: [gruvbox["purple-h"], gruvbox["yellow-h"]],
};

const DOTS: Pattern = {
  lines: [".."],
  accent: [0],
  colors: [gruvbox["purple-h"]],
};

// --- Registry ---

const registry: PatternEntry[] = [
  { kind: "animated", pattern: SWAY, weight: 3 },
  { kind: "animated", pattern: WAVE, weight: 3 },
  { kind: "fixed", pattern: BLOOM, weight: 2 },
  { kind: "fixed", pattern: SPROUT, weight: 2 },
  { kind: "fixed", pattern: SPIKE, weight: 1 },
  { kind: "fixed", pattern: CROWN, weight: 2 },
  { kind: "fixed", pattern: DROOP, weight: 2 },
  { kind: "fixed", pattern: TUFT, weight: 2 },
  { kind: "fixed", pattern: DOTS, weight: 1 },
];

const totalWeight = registry.reduce((s, e) => s + e.weight, 0);

export function spawn(): Plant {
  let r = Math.random() * totalWeight;
  for (const entry of registry) {
    r -= entry.weight;
    if (r <= 0) {
      return entry.kind === "animated"
        ? spawnAnimated(entry.pattern)
        : spawnFixed(entry.pattern);
    }
  }
  return spawnFixed(registry[0].pattern as Pattern);
}
