import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      accent: "#fb460d",
    },
  },
  shortcuts: [
    [
      "preloader-text",
      "text-[0.8rem] text-white leading-snug tracking-[-0.0125rem] font-500 font-mono uppercase",
    ],
    [
      "focus-ring-core",
      "focus-visible:(outline-dashed outline-1 outline-offset-4 rounded-none transition-none)",
    ],
    [
      "focus-ring-link",
      "focus-ring-core focus-visible:outline-current",
    ],
    [
      "focus-ring-link-inner",
      "group-focus-visible:(outline-dashed outline-1 outline-offset-4 rounded-none transition-none outline-current)",
    ],
  ],
  presets: [
    presetAttributify(),
    presetTypography(),
    presetWind4(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Geist",
        mono: "Geist Mono",
      },
      processors: createLocalFontProcessor(),
    }),
    presetIcons(),
  ],
});
