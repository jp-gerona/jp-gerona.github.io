import antfu from "@antfu/eslint-config";
import tsParser from "@typescript-eslint/parser";
import astroParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";

export default antfu(
  {
    astro: true,
    unocss: true,

    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
  },
  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
        sourceType: "module",
      },
    },
    rules: {
      "astro/jsx-a11y/alt-text": ["error", { img: ["Image"] }],
    },
  },
);
