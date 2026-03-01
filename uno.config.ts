import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import  { defineConfig, presetAttributify, presetWebFonts, presetWind4 } from "unocss";

export default defineConfig({
  presets: [
    presetAttributify(),
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
  ]
})
