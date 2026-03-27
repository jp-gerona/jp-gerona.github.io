import antfu from "@antfu/eslint-config";
import eslintPluginAstro from "eslint-plugin-astro";

export default antfu(
  {
    astro: true,
    svelte: true,
    unocss: true,

    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
  },
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  {
    files: ["**/*.astro"],
    rules: {
      "astro/jsx-a11y/alt-text": ["error", { img: ["Image"] }],
    },
  },
);
