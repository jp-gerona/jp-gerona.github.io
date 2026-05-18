# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Julian Peter Gerona. Static site deployed to GitHub Pages at https://jp-gerona.github.io. Goal: Lighthouse ~100 on Performance, Accessibility, Best Practices, SEO. Astro-first performance discipline — partial hydration, islands, static generation; avoid heavy client JS where server rendering suffices.

Stack: Astro 6, UnoCSS, GSAP, Lenis. Package manager: **pnpm** (pnpm-lock.yaml).

## Commands

- `pnpm dev` — dev server
- `pnpm build` — production build (`astro build`)
- `pnpm preview` — preview built site
- `pnpm astro check` — type/diagnostics check. **Default validation loop**; use instead of `pnpm build` unless build artifacts or production diagnostics are explicitly needed.
- `pnpm lint` / `pnpm lint:fix` — ESLint (`@antfu/eslint-config`, astro + unocss + jsx-a11y, double quotes, semi, 2-space)
- Error triage: run `pnpm lint:fix && pnpm astro check` first; remaining errors are non-auto-fixable, resolve manually then re-validate.
- Dependencies: `pnpm add <pkg>` / `pnpm add -D <pkg>` — do not hand-edit `package.json` dependency blocks.
- No test suite exists.
- `husky` + `lint-staged` run `eslint --fix` on staged files pre-commit.
- Search: use `rg`. ripgrep build here lacks PCRE2 — no lookahead/lookbehind regex.

## Architecture

### Config-driven content

`src/site.config.ts` (typed by `src/types.d.ts`) is the single source for site metadata, navigation, and footer links. Pages/components read from `siteConfig` — change nav/footer/identity there, not in markup.

### Content Collections

- `src/content.config.ts` defines collections via glob loaders; Zod schemas in `src/content/schema.ts`.
- `baseEntrySchema` is the shared base (title/description/dates/draft/tags/ogImage). Collection schemas extend it — extend `baseEntrySchema` rather than redefining fields.
- Collections: `index` (single `index.md`), `projects` (`projects/**/*.md`), `practicum` (single `summary.md`, requires `title` + non-empty `stats` array).
- Pages pull entries with `getEntry(...)` and throw on missing required content (see `src/pages/practicum.astro`).

### Layouts & page composition

- `BaseLayout.astro` — full HTML shell: `Head`, `PageProgress`, skip-link, `NavBar`, `<main id="main-content">`, `Footer`, plus the global GSAP preloader-exit script and Lenis init wiring. All pages render through this.
- `PageLayout.astro` — thin pass-through over `BaseLayout` (title/description/ogImage props).
- Pages live in `src/pages/`, composed from section components in `src/components/sections/<page>/`. Reusable pieces in `src/components/base|nav|widgets|preloader|garden`.
- Path alias `@/*` → `src/*` (tsconfig, astro/strict).

### OG image generation (build-time)

`plugins/remark-generate-og-image.ts` is a remark plugin (registered in `plugins/index.ts` → `astro.config.mjs`). At build it renders per-page OG PNGs into `public/og-images/` via satori + sharp from `plugins/og-template/markup.ts`. Behavior:
- Generates a global `og-image.png` fallback if absent.
- Per markdown entry: skips `draft`/`redirect`/no-title/`ogImage: false`; skips if a matching `<name>.png` already exists (filename derived from basename, or parent dir if `index.md`).
- `ogImage: "<file>"` assigns an existing image; warns if missing.
- `Head.astro` resolves the final `og:image` URL: assigned → generated-by-route-name → global fallback. `checkFileExistsInDir` is shared between plugin and `Head.astro`.
- Generated PNGs are committed (not gitignored) — regenerate by deleting the stale PNG so the next build recreates it.

### Smooth scroll & animation

- `src/utils/smoothScroll.ts` — Lenis + GSAP ScrollTrigger integration. Singleton instance; **disabled on touch/mobile/tablet** (falls back to native scroll). Coordinates scroll lock/unlock with preloader via `preloaderStart`/`preloaderComplete` window events. Re-init on `astro:page-load` (View Transitions / `ClientRouter`). Use `scrollToTop()` / `destroySmoothScroll()` exports rather than touching Lenis directly.
- `src/utils/gsapHelpers.ts` — SplitText helpers (`splitTextIntoLines`, `setupSplitTextHoverSwap`) and `animateCounter` (milestone-based percentage strip). Reuse these for text/counter animation instead of bespoke GSAP.
- Preloader exit transition is wired globally in `BaseLayout.astro` via the `preloaderExitStart` event. Navigation is client-side (Astro `ClientRouter`); animation init must survive `astro:before-preparation` / `astro:page-load`.

### Styling

- UnoCSS (`uno.config.ts`): presetWind4 + attributify + typography + icons (`ri` set) + web fonts (Figtree/IBM Plex Mono/Playfair, locally processed).
- Theme colors `catpuccin` and `gruvbox` from `src/themes/`, used as `*-catpuccin-*` / `*-gruvbox-*` color tokens (e.g. `bg-catpuccin-base`).
- Focus-visible rings defined in uno `preflights` (`.focus-ring-core` / `.focus-ring-link`) — reuse these classes for accessible focus styling.
- `env` helper (`src/utils/env.ts`) gates prod-only code (e.g. analytics script in `Head.astro`).

## Working conventions (from .github/copilot-instructions.md)

- Treat ambiguous/version-sensitive framework behavior (Astro 6, UnoCSS, GSAP) as needing doc verification before assuming.
- Flag technical debt / outdated patterns / redundancy when encountered; prefer cleaner scalable alternatives over functional-but-suboptimal structure.
- Performance budget per feature: payload size, hydration cost, animation runtime, LCP/INP/CLS impact.
- Discuss changes tersely (caveman style) to reduce token usage.
