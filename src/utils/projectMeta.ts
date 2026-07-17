import type { CollectionEntry } from "astro:content";

export function projectMeta(data: CollectionEntry<"projects">["data"]) {
  const monthYear = data.pubDate?.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return [data.category, monthYear].filter(Boolean).join(" - ");
}
