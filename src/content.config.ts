import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import {
  indexSchema,
  practicumSchema,
  projectsSchema,
  resumeSchema,
} from "@/content/schema";

const index = defineCollection({
  loader: glob({ base: "./src/content/index", pattern: "index.md" }),
  schema: indexSchema,
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: projectsSchema,
});

const practicum = defineCollection({
  loader: glob({ base: "./src/content/practicum", pattern: "summary.md" }),
  schema: practicumSchema,
});

const resume = defineCollection({
  loader: glob({ base: "./src/content/resume", pattern: "resume.yaml" }),
  schema: resumeSchema,
});

export const collections = {
  resume,
  index,
  practicum,
  projects,
};
