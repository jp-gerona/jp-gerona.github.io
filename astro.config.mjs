import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import robotsTxt from "astro-robots-txt";
// @ts-check
import { defineConfig } from "astro/config";

import UnoCSS from "unocss/astro";
import { remarkPlugins } from "./plugins/index.ts";

import { siteConfig } from "./src/site.config";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,
  markdown: {
    remarkPlugins,
  },
  vite: {
    plugins: [
      {
        name: "max-listeners-config",
        configureServer(server) {
          server.watcher.setMaxListeners(20);
        },
      },
    ],
  },
  integrations: [
    svelte(),
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
    robotsTxt(),
  ],
  image: {
    domains: siteConfig.imageDomains,
    layout: "constrained",
    responsiveStyles: true,
  },
});
