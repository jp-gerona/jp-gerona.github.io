import type { RemarkPlugins } from "astro";
import { siteConfig } from "../src/site.config";

import remarkGenerateOgImage from "./remark-generate-og-image";

export const remarkPlugins: RemarkPlugins = [
  [
    remarkGenerateOgImage,
    {
      authorOrBrand: siteConfig.title,
      fallbackTitle: siteConfig.description,
    },
  ],
];
