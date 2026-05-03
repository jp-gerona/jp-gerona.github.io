import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from "unocss";

import { gruvbox } from "./src/utils/gruvbox";

export default defineConfig({
  theme: {
    colors: {
      // main
      bg0: "#faf9f7",
      bg1: "#f9f8f6",
      fg0: "#666666",
      fg1: "#969696",
      fg2: "#bab8af",
      bd: "#e2e2e2",

      // gruvbox
      gruvbox,
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
