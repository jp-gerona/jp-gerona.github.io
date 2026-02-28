import antfu from '@antfu/eslint-config';

export default antfu(
  {
    astro: true,
    unocss: true,
    formatters: true,

    stylistic: {
      indent: 2,
      semi: true,
      quotes: 'single',
    },

    ignores: [
      '**/dist/**',
      '**/.astro/**',
      '**/node_modules/**',
    ],
  },
);
