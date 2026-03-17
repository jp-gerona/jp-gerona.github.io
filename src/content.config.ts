import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import {
  credentialsSchema,
  indexSchema,
  practicumSchema,
  projectsSchema,
} from "@/content/schema";

const index = defineCollection({
  loader: glob({ base: "./src/content/index", pattern: "index.md" }),
  schema: indexSchema,
});

const credentials = defineCollection({
  loader: glob({ base: "./src/content/credentials", pattern: "**/*.md" }),
  schema: credentialsSchema,
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: projectsSchema,
});

const practicum = defineCollection({
  loader: glob({ base: "./src/content/practicum", pattern: "**/*.md" }),
  schema: practicumSchema,
});

export const collections = {
  index,
  credentials,
  projects,
  practicum,
};
