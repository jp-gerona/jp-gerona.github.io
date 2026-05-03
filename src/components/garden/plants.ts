import type { Plant } from "@/types";
import { gruvbox } from "@/utils/gruvbox";

type PlantFactory = () => Plant;

function animated(
  frames: string[][],
  colors: string[],
  minMs: number,
  maxMs: number,
): PlantFactory {
  return () => {
    let frame = Math.floor(Math.random() * frames.length);
    let nextTime = Date.now() + minMs + Math.random() * (maxMs - minMs);

    return {
      update(now: number) {
        if (now >= nextTime) {
          frame = (frame + 1) % frames.length;
          nextTime = now + minMs + Math.random() * (maxMs - minMs);
        }
      },
      getLines: () => frames[frame],
      getColors: () => colors,
    };
  };
}

function fixed(lines: string[], colors: string[]): PlantFactory {
  return () => ({
    update() {},
    getLines: () => lines,
    getColors: () => colors,
  });
}

// --- Animated ---

const flowerWhite = animated(
  [[" (*)", ">/  "], ["(*) ", ">\\"]],
  [gruvbox.fg1, gruvbox["green-h"]],
  800,
  3000,
);

const grass = animated(
  [["\\|/"], ["\\ |/"], ["\\| /"]],
  [gruvbox["green-h"]],
  600,
  2400,
);

// --- Static ---

const dots = fixed([".."], [gruvbox["purple-h"]]);

const flowerRed = fixed(
  ["(o)", "\\|/"],
  [gruvbox["red-h"], gruvbox["green-h"]],
);

const flowerYellow = fixed(
  [" .", "\\|", "^^^"],
  [gruvbox["yellow-h"], gruvbox["green-h"], gruvbox["green-h"]],
);

const flowerOrange = fixed(
  [".", "|"],
  [gruvbox["orange-h"], gruvbox["green-h"]],
);

const flowerAqua = fixed(
  [" vvv ", "  Y  ", "^^^^^"],
  [gruvbox["aqua-h"], gruvbox["green-h"], gruvbox["green-h"], gruvbox["green-h"]],
);

const flowerPurple = fixed(
  [",,,", "~Y~", "\\|/", "^^^"],
  [gruvbox["purple-h"], gruvbox["green-h"], gruvbox["green-h"], gruvbox["green-h"]],
);

// --- Registry ---

export const plants: { factory: PlantFactory; weight: number }[] = [
  { factory: flowerWhite, weight: 3 },
  { factory: grass, weight: 4 },
  { factory: dots, weight: 1 },
  { factory: flowerRed, weight: 2 },
  { factory: flowerYellow, weight: 2 },
  { factory: flowerOrange, weight: 2 },
  { factory: flowerAqua, weight: 2 },
  { factory: flowerPurple, weight: 2 },
];
