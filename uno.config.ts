import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from "unocss";

import { catpuccin } from "./src/themes/catpuccin";
import { gruvbox } from "./src/themes/gruvbox";

export default defineConfig({
  theme: {
    colors: {
      catpuccin,
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
