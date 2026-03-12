import svelte from "@astrojs/svelte";
import robotsTxt from "astro-robots-txt";
import sitemap from "astro-sitemap/astro";

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
    sitemap(),
    // todo: remove policy when portfolio is ready
    robotsTxt({
      policy: [
        {
          userAgent: "*",
          disallow: ["/"],
        },
      ],
    }),
  ],
  image: {
    domains: siteConfig.imageDomains,
    layout: "constrained",
    responsiveStyles: true,
  },
});
