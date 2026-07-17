# CLAUDE.md

Instructions for AI coding agents working in this repository. This is the single source of truth; `AGENTS.md` points here.

## Hard constraints (non-negotiable)

- **Astro only.** No new UI frameworks (React/Svelte/Vue/etc.). Static generation and islands; no client JS where server rendering suffices.
- **Don't touch unrelated code.** Every changed line must trace directly to the request. No drive-by refactors, comment edits, or reformatting.
- **Dead code: mention, don't delete.** If you notice unrelated dead code or tech debt, flag it; only remove orphans your own changes created.
- **pnpm only.** `pnpm add <pkg>` / `pnpm add -D <pkg>` — never hand-edit `package.json` dependency blocks.
- **No `pnpm dev` for verification.** Use `pnpm astro check`; don't spawn dev servers or clear `.astro` cache.
- **Don't assume version-sensitive behavior.** Astro 6 / UnoCSS / GSAP behavior that's ambiguous or version-specific: verify against current docs before acting.

## Core behavior

Bias toward caution over speed; for trivial tasks, use judgment.

### Think before coding

- State assumptions explicitly. If uncertain, ask.
- Multiple interpretations exist → present them; don't pick silently.
- Simpler approach exists → say so. Push back when warranted.
- Something unclear → stop, name the confusion, ask.

### Simplicity first

- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked; no abstractions for single-use code; no unrequested configurability; no error handling for impossible scenarios.
- Test: "Would a senior engineer call this overcomplicated?" If yes, simplify.

### Surgical changes

- Match existing style even if you'd do it differently.
- Remove imports/variables/functions that *your* changes made unused; leave pre-existing dead code alone (see hard constraints).

### Goal-driven execution

- Transform tasks into verifiable goals with explicit success criteria ("fix the bug" → reproduce, then verify fixed).
- Multi-step work: brief plan, each step paired with its verification check.
- No test suite exists — verification loop is `pnpm lint:fix && pnpm astro check`.

### Performance budget

For every significant feature: weigh payload size, hydration cost, animation runtime, and LCP/INP/CLS impact. Prefer partial hydration, islands, static generation.

### Communication

Discuss changes tersely (caveman style) to reduce token usage. Code, commits, and docs: write normal.

## Project

Personal portfolio for Julian Peter Gerona. Static site on GitHub Pages at https://jp-gerona.github.io. Goal: Lighthouse ~100 across Performance, Accessibility, Best Practices, SEO.

Stack: Astro 6, UnoCSS, GSAP, Lenis. Package manager: pnpm.

## Commands

- `pnpm astro check` — type/diagnostics check. **Default validation loop**; use instead of `pnpm build` unless build artifacts or production diagnostics are needed.
- `pnpm lint` / `pnpm lint:fix` — ESLint (`@antfu/eslint-config`, astro + unocss + jsx-a11y, double quotes, semi, 2-space).
- Error triage: `pnpm lint:fix && pnpm astro check` first; remaining errors are non-auto-fixable — resolve manually, re-validate.
- `pnpm build` — production build; `pnpm preview` — preview built site; `pnpm dev` — dev server (user-run only).
- `husky` + `lint-staged` run `eslint --fix` on staged files pre-commit.
- Search: use `rg`. This ripgrep build lacks PCRE2 — no lookahead/lookbehind regex.

## Architecture

### Config-driven content

`src/site.config.ts` (typed by `src/types.d.ts`) is the single source for site metadata, navigation, and footer links. Change nav/footer/identity there, not in markup.

### Content Collections

- `src/content.config.ts` defines collections via glob loaders; Zod schemas in `src/content/schema.ts`.
- `baseEntrySchema` is the shared base (title/description/dates/draft/tags/ogImage). Extend it rather than redefining fields.
- Collections: `index` (single `index.md`), `projects` (`projects/**/*.md`), `practicum` (single `summary.md`, requires `title` + non-empty `stats` array).
- Pages pull entries with `getEntry(...)` and throw on missing required content (see `src/pages/practicum.astro`).

### Layouts & page composition

- `BaseLayout.astro` — full HTML shell: `Head`, `PageProgress`, skip-link, `NavBar`, `<main id="main-content">`, `Footer`, plus Lenis/smooth-scroll init (runs on `astro:page-load`). All pages render through this.
- `PageLayout.astro` — thin pass-through over `BaseLayout` (title/description/ogImage props).
- Pages in `src/pages/`, composed from section components in `src/components/sections/<page>/`. Reusable pieces in `src/components/base|nav|widgets|garden`.
- Path alias `@/*` → `src/*` (tsconfig, astro/strict).

### OG image generation (build-time)

`plugins/remark-generate-og-image.ts` is a remark plugin (registered in `plugins/index.ts` → `astro.config.mjs`). At build it renders per-page OG PNGs into `public/og-images/` via satori + sharp from `plugins/og-template/markup.ts`:

- Generates a global `og-image.png` fallback if absent.
- Per markdown entry: skips `draft`/`redirect`/no-title/`ogImage: false`; skips if a matching `<name>.png` exists (filename from basename, or parent dir if `index.md`).
- `ogImage: "<file>"` assigns an existing image; warns if missing.
- `Head.astro` resolves final `og:image` URL: assigned → generated-by-route-name → global fallback. `checkFileExistsInDir` is shared between plugin and `Head.astro`.
- Generated PNGs are committed — regenerate by deleting the stale PNG so the next build recreates it.

### Smooth scroll & animation

- `src/utils/smoothScroll.ts` — Lenis + GSAP ScrollTrigger. Singleton; **disabled on touch/mobile/tablet** (native scroll fallback). Re-inits on `astro:page-load` (View Transitions / `ClientRouter`). Use `scrollToTop()` / `destroySmoothScroll()` exports; don't touch Lenis directly.
- `src/utils/gsapHelpers.ts` — SplitText helpers (`splitTextIntoLines`, `setupSplitTextHoverSwap`) and `animateCounter`. Reuse these instead of bespoke GSAP.
- Navigation is client-side (`ClientRouter`); animation init must survive `astro:before-preparation` / `astro:page-load`.

### Styling

- UnoCSS (`uno.config.ts`): presetWind4 + attributify + typography + icons (`ri` set) + web fonts (Plus Jakarta Sans/Crimson Pro/IBM Plex Mono, locally processed into `public/assets/fonts/`).
- Theme colors `catpuccin` and `gruvbox` from `src/themes/`, used as `*-catpuccin-*` / `*-gruvbox-*` tokens (e.g. `bg-catpuccin-base`).
- Focus-visible rings in uno `preflights` (`.focus-ring-core` / `.focus-ring-link`) — reuse for accessible focus styling.
- `env` helper (`src/utils/env.ts`) gates prod-only code (e.g. analytics in `Head.astro`).
