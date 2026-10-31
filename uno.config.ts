import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWind4 } from "unocss";

import { catpuccin } from "./src/themes/catpuccin";
import { catpuccinMocha } from "./src/themes/catpuccinMocha";
import { gruvbox } from "./src/themes/gruvbox";
import { portfolio } from "./src/themes/portfolio";

export default defineConfig({
  theme: {
    font: {
      sans: "system-ui, sans-serif",
      serif: "\"Libron\", serif",
      mono: "\"Departure Mono\", ui-monospace, monospace",
    },
    colors: {
      portfolio,
      catpuccin,
      mocha: catpuccinMocha,
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
    presetIcons(),
  ],
  // Icon classes referenced from site configuration are
  // invisible to the extractor and must be safelisted.
  safelist: [
    "i-ri-github-fill",
    "i-ri-linkedin-box-fill",
    "i-ri:account-circle-fill",
  ],
});
