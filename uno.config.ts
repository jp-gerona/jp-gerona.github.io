import type { SiteNavItem } from "./src/types";
import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWebFonts, presetWind4 } from "unocss";
import { siteConfig } from "./src/site.config";

const SPACE_SPLIT_REGEX = /\s+/;
const TRANSITION_SHORTCUT_REGEX = /^(\w+)-transition(?:-(\d+))?$/;
type IconNavItem = Extract<SiteNavItem, { kind: "icon" }>;

function isIconNavItem(item: SiteNavItem): item is IconNavItem {
  return item.kind === "icon";
}

const navIcons = siteConfig.navigation.main
  .filter(isIconNavItem)
  .flatMap(item => item.icon.split(SPACE_SPLIT_REGEX))
  .filter(Boolean);

const navIconClasses = siteConfig.navigation.main
  .filter(isIconNavItem)
  .filter((item): item is IconNavItem & { iconClass: string } => typeof item.iconClass === "string" && item.iconClass.length > 0)
  .flatMap(item => item.iconClass.split(SPACE_SPLIT_REGEX))
  .filter(Boolean);

export default defineConfig({
  theme: {
    colors: {
      accent: "#5b553b",
    },
  },
  shortcuts: [
    [
      TRANSITION_SHORTCUT_REGEX,
      match => `transition-${match[1] === "op" ? "opacity" : match[1]} duration-${match[2] ? match[2] : "300"} ease-in-out`,
    ],
  ],
  safelist: [
    ...navIcons,
    ...navIconClasses,
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
