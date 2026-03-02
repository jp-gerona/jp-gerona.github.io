import svelte from "@astrojs/svelte";
// @ts-check
import { defineConfig } from "astro/config";

import UnoCSS from "unocss/astro";

import { siteConfig } from "./src/site.config";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,
  integrations: [
    svelte(),
    UnoCSS({
      injectReset: true,
    }),
  ],
  image: {
    domains: siteConfig.imageDomains,
    layout: "constrained",
    responsiveStyles: true,
  },
});
