import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      // background
      "bg0-h": "#f9f5d7",
      "bg0": "#fbf1c7",
      "bg0-s": "#f2e5bc",
      "bg1": "#ebdbb2",
      "bg2": "#d5c4a1",
      "bg3": "#bdae93",
      "bg4": "#a89984",

      // foreground
      "fg0": "#282828",
      "fg1": "#3c3836",
      "fg2": "#504945",
      "fg3": "#665c54",
      "fg4": "#7c6f64",

      // accent
      "red-s": "cc241d",
      "red-h": "#9d0006",
      "green-s": "#98971a",
      "green-h": "#79740e",
      "yellow-s": "#d79921",
      "yellow-h": "#b57614",
      "blue-s": "#458588",
      "blue-h": "#076678",
      "purple-s": "#b16286",
      "purple-h": "#8f3f71",
      "aqua-s": "#689d6a",
      "aqua-h": "#427b58",
      "orange-s": "#d65d0e",
      "orange-h": "#af3a03",
      "gray-s": "#7c6f64",
      "gray-h": "#928374",
    },
  },
  shortcuts: [
    [
      "preloader-text",
      "text-[0.8rem] text-white leading-snug tracking-[-0.0125rem] font-500 font-mono uppercase",
    ],
  ],
  preflights: [
    {
      getCSS: () => `
        :where(a, button, .focus-ring-core):focus-visible {
          outline-style: dashed;
          outline-width: 1px;
          outline-offset: 4px;
          border-radius: 0 !important;
          transition: none;
        }

        :where(a, .focus-ring-link):focus-visible {
          outline-color: currentColor;
        }

        @supports not selector(:focus-visible) {
          :where(a, button, .focus-ring-core):focus {
            outline-style: dashed;
            outline-width: 1px;
            outline-offset: 4px;
            border-radius: 0 !important;
            transition: none;
          }

          :where(a, .focus-ring-link):focus {
            outline-color: currentColor;
          }
        }
      `,
    },
  ],
  presets: [
    presetAttributify(),
    presetTypography(),
    presetWind4(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Figtree",
        mono: "IBM Plex Mono",
      },
      processors: createLocalFontProcessor(),
    }),
    presetIcons(),
  ],
});
