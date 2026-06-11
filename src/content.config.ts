import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import {
  cvSchema,
  indexSchema,
  practicumSchema,
  projectsSchema,
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

const cv = defineCollection({
  loader: glob({ base: "./src/content/cv", pattern: "cv.md" }),
  schema: cvSchema,
});

export const collections = {
  cv,
  index,
  practicum,
  projects,
};
