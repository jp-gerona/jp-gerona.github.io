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

export const indexSchema = baseEntrySchema;
export const projectsSchema = baseEntrySchema;
export const credentialsSchema = baseEntrySchema;
export const practicumSchema = baseEntrySchema;
