import antfu from "@antfu/eslint-config";

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
);
