import antfu from "@antfu/eslint-config";

export default antfu(
  {
    astro: true,
    svelte: true,
    unocss: true,

    formatters: {
      astro: "prettier",
    },

    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
  },
);
