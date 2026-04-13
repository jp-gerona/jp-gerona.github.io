import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import {
  indexSchema,
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

export const collections = {
  index,
  projects,
};
