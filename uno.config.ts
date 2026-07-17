import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from "unocss";

import { catpuccin } from "./src/themes/catpuccin";
import { gruvbox } from "./src/themes/gruvbox";
import { portfolio } from "./src/themes/portfolio";

export default defineConfig({
  theme: {
    colors: {
      portfolio,
      catpuccin,
      gruvbox,
    },
  },
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
        sans: "Plus Jakarta Sans",
        mono: "IBM Plex Mono",
        serif: {
          name: "Crimson Pro",
          italic: true,
        },
      },
      processors: createLocalFontProcessor(),
    }),
    presetIcons(),
  ],
  // Icon classes referenced from content frontmatter (e.g. cv socials) are
  // invisible to the extractor and must be safelisted.
  safelist: [
    "i-ri-github-fill",
    "i-ri-linkedin-box-fill",
    "i-ri:account-circle-fill",
  ],
});
