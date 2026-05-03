import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      // background
      bg0: "#faf9f7",
      bg1: "#f9f8f6",

      // foreground
      fg0: "#666666",
      fg1: "#969696",
      fg2: "#bab8af",

      // border
      bd: "#e2e2e2",

      // gruvbox
      gruvbox: {
        // background
        "bg0-h": "#1d2021",
        "bg0": "#191918",
        "bg0-s": "#32302f",
        "bg1": "#3c3836",
        "bg2": "#504945",
        "bg3": "#665c54",
        "bg4": "#7c6f64",

        // foreground
        "fg0": "#fbf1c7",
        "fg1": "#ebdbb2",
        "fg2": "#d5c4a1",
        "fg3": "#bdae93",
        "fg4": "#a89984",

        // accent
        "red-s": "cc241d",
        "red-h": "#fb4934",
        "green-s": "#98971a",
        "green-h": "#b8bb26",
        "yellow-s": "#d79921",
        "yellow-h": "#fabd2f",
        "blue-s": "#458588",
        "blue-h": "#83a598",
        "purple-s": "#b16286",
        "purple-h": "#d3869b",
        "aqua-s": "#689d6a",
        "aqua-h": "#8ec07c",
        "orange-s": "#d65d0e",
        "orange-h": "#fe8019",
        "gray-s": "#a89984",
        "gray-h": "#928374",
      },
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
        serif: "Playfair Display",
      },
      processors: createLocalFontProcessor(),
    }),
    presetIcons(),
  ],
});
