import antfu from "@antfu/eslint-config";
import * as astroParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";

export default antfu(
  {
    ignores: ["pnpm-workspace.yaml", "draft/**"],
    astro: true,
    unocss: true,

    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
  },
  {
    // Parse YAML frontmatter so its comments aren't misread as H1 headings.
    files: ["**/*.md"],
    languageOptions: {
      frontmatter: "yaml",
    },
  },
  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
        sourceType: "module",
      },
    },
    rules: {
      "astro/jsx-a11y/alt-text": ["error", { img: ["Image"] }],
    },
  },
);
