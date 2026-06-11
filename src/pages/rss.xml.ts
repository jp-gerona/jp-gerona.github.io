import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/site.config";

export async function GET(context: APIContext) {
  const projects = await getCollection("projects", ({ data }) => !data.draft);

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site!,
    items: projects
      .filter(p => p.data.title && p.data.pubDate)
      .map(p => ({
        title: p.data.title!,
        description: p.data.description,
        pubDate: p.data.pubDate!,
        link: `/projects/${p.id}/`,
      })),
  });
}
