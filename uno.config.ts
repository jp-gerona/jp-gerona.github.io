import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from "unocss";

export default defineConfig({
  presets: [
    presetAttributify(),
    presetTypography(),
    presetWind4(),
    presetWebFonts({
      provider: "fontshare",
      themeKey: "font",
      fonts: {
        sans: "Satoshi",
        mono: "Satoshi Mono",
      },
      processors: createLocalFontProcessor(),
    }),
    presetIcons({
      extraProperties: {
        "display": "inline-block",
        "height": "1.2em",
        "width": "1.2em",
        "vertical-align": "text-bottom",
      },
    }),
  ],
});
