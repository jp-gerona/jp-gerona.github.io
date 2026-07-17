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

const practicumSummaryStatSchema = z.object({
  label: z.string(),
  value: z.number().int().nonnegative(),
});

const cvSocialSchema = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.string(),
});

const cvProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  repo: z.string().optional(),
  link: z.string().optional(),
});

const cvExperienceSchema = z.object({
  organization: z.string(),
  role: z.string(),
  period: z.string(),
  location: z.string().optional(),
  url: z.string().optional(),
  note: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

const cvEducationSchema = z.object({
  credential: z.string(),
  institution: z.string(),
  period: z.string(),
  details: z.array(z.string()).default([]),
});

const cvSkillGroupSchema = z.object({
  category: z.string(),
  items: z.array(z.string()).min(1),
});

const cvTalkSchema = z.object({
  title: z.string(),
  event: z.string().optional(),
  date: z.string().optional(),
  link: z.string().optional(),
  description: z.string().optional(),
});

const cvAwardSchema = z.object({
  title: z.string(),
  organization: z.string().optional(),
  date: z.string().optional(),
});

export const indexSchema = baseEntrySchema;
export const cvSchema = baseEntrySchema.extend({
  title: z.string(),
  name: z.string(),
  role: z.string(),
  contact: z.object({
    location: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
  socials: z.array(cvSocialSchema).default([]),
  about: z.string().optional(),
  projects: z.array(cvProjectSchema).default([]),
  moreProjectsHref: z.string().optional(),
  experience: z.array(cvExperienceSchema).default([]),
  skills: z.array(cvSkillGroupSchema).default([]),
  education: z.array(cvEducationSchema).default([]),
  talks: z.array(cvTalkSchema).default([]),
  awards: z.array(cvAwardSchema).default([]),
  languages: z.string().optional(),
});
export const practicumSchema = baseEntrySchema.extend({
  title: z.string(),
  stats: z.array(practicumSummaryStatSchema).min(1),
});
export const projectsSchema = baseEntrySchema.extend({
  title: z.string(),
  repo: z.string().optional(),
  link: z.string().optional(),
  stack: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  team: z.array(z.string()).default([]),
  timeline: z.string().optional(),
  role: z.string().optional(),
  category: z.string().optional(),
  cover: z.string().optional(),
  accent: z.string().optional(),
});
