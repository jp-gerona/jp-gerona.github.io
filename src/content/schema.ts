import type { SchemaContext } from "astro:content";
import { z } from "astro/zod";

export const baseEntrySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  pubDate: z.coerce.date().optional(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  ogImage: z.union([z.boolean(), z.string()]).optional(),
});

const practicumAppendixSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const indexSchema = baseEntrySchema;
export const practicumSchema = baseEntrySchema.extend({
  title: z.string(),
  accent: z.string().optional(),
  appendices: z.array(practicumAppendixSchema).default([]),
});
export function projectsSchema({ image }: SchemaContext) {
  return baseEntrySchema.extend({
    title: z.string(),
    repo: z.string().optional(),
    link: z.string().optional(),
    locked: z.boolean().default(false),
    stack: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    team: z.array(z.string()).default([]),
    timeline: z.string().optional(),
    role: z.string().optional(),
    category: z.string().optional(),
    cover: image().optional(),
    banner: image().optional(),
    accent: z.string().optional(),
  });
}
