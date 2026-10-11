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

const resumeProjectSchema = z.object({
  name: z.string(),
  year: z.string(),
  highlights: z.array(z.string()).min(1),
});

const resumeExperienceSchema = z.object({
  organization: z.string(),
  role: z.string(),
  period: z.string(),
  location: z.string(),
  highlights: z.array(z.string()).min(1),
});

const resumeEducationSchema = z.object({
  credential: z.string(),
  institution: z.string(),
  location: z.string(),
  period: z.string(),
  details: z.array(z.string()).min(1),
});

const resumeSkillGroupSchema = z.object({
  category: z.string(),
  text: z.string(),
});

const resumeAffiliationSchema = z.object({
  organization: z.string(),
  period: z.string(),
  highlights: z.array(z.string()).min(1),
});

export const indexSchema = baseEntrySchema;
export const resumeSchema = baseEntrySchema.extend({
  title: z.string(),
  name: z.string(),
  role: z.string(),
  contact: z.array(z.object({
    text: z.string(),
    href: z.url().optional(),
  })).min(1),
  education: z.array(resumeEducationSchema).min(1),
  experience: z.array(resumeExperienceSchema).min(1),
  projects: z.array(resumeProjectSchema).min(1),
  affiliations: z.array(resumeAffiliationSchema).min(1),
  skills: z.array(resumeSkillGroupSchema).min(1),
});
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
