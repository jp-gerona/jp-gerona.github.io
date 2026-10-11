import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
// @ts-check
import { defineConfig } from "astro/config";

import UnoCSS from "unocss/astro";
import { remarkPlugins } from "./plugins/index.ts";
import { buildResume } from "./scripts/build-resume.mjs";

import { siteConfig } from "./src/site.config";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  compressHTML: true,
  markdown: {
    processor: unified({ remarkPlugins }),
    shikiConfig: {
      theme: "github-light",
    },
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
    {
      name: "resume-pdf",
      hooks: {
        "astro:build:start": () => buildResume(),
      },
    },
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
