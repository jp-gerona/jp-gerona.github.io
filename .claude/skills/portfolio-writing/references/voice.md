# Intended voice and evidence

## What is known

The commissioning request identifies the author as a software engineer with a growing interest in cybersecurity. It explicitly prefers a personal corner of the web, direct and exploratory explanations, mild informality, technical curiosity, tradeoffs, occasional self-awareness, and honest uncertainty. These are confirmed stated preferences, not a stylistic assessment of approved published prose.

On 2026-11-07, the author confirmed full authorship of portfolio-v1 website content and README, live-docs README, and apple_website README, and authorized learning from them. See samples.md for retrieved originals and approval scope. This establishes personal writing evidence, not blanket endorsement of every phrase. Current AI-generated portfolio copy remains excluded. No previous ChatGPT conversations were accessed.

## Evidence priority

1. Samples explicitly approved by the author as representative of his voice.
2. Original text, notes, and drafts he personally supplies.
3. His available conversational messages and brainstorming.
4. The synthesized voice principles in this skill.

Keep factual verification separate from stylistic approval. A sample may exemplify rhythm without proving that its dated claims still hold. Do not infer personal authorship from a filename, first-person narration, or a polished draft.

## Observed patterns in the authorized originals

The project reflections repeatedly compare a new tool with a familiar baseline, name concrete difficulties, and acknowledge tutorials or limits. The portfolio README explains media-query and layout struggles; live-docs compares Next.js with plain React; apple_website compares React with static HTML and then narrows the observation. These are inspectable explanations rather than merely adjectives about technical curiosity.

Longer sentences often connect an action to its effect, sometimes repeating the connection. First-person qualifications such as “I would say” soften claims; some can be shortened without erasing uncertainty. The website supplies localized self-awareness through “Future Something”, the repeated money motivation, and the UMAK parenthesis “(I tried)”. These isolated expressions support occasional candid humor, not a recurring joke formula.

The originals also contain promotional summaries, broad learning conclusions, and conventional transitions. Their authorship is confirmed, but the latest stated preferences take priority over reproducing those habits. Historical beginner status, motivations, project results, and technical claims are not automatically current facts.

## Inferences and recommendations

A preference for explanations over self-promotion suggests leading with a specific thing the author noticed, tried, or questioned when such material exists. This is an editorial inference, not a requirement to invent a story. His exploratory thinking suggests preserving a meaningful change of mind while removing verbal loops. Finished prose should make the reasoning easier to follow than raw brainstorming.

The research supports connecting a decision to its actual constraint, placing qualifications beside the claim they limit, and letting examples carry technical credibility. Use these moves only when supported by the material. Technical precision includes the cost of a choice and the conditions under which another choice might fit, when those are known.

Watch for inflated professional language, vague achievements, generic learning claims, artificial profundity, forced humor, repetitive openings, repeated causal sentences, artificial contrasts, symmetrical lists, and exuberant announcements. Their repeated or unjustified use is the problem; ordinary causal explanations and useful lists remain welcome. Repository documentation uses plain punctuation without em dashes. Do not replace them with equally repetitive colons or fragments.

Build the voice from the author's own evidence. Do not adopt another author's biography, technical preferences, signature expressions, or public persona. Quiet confidence does not require suppressing an enthusiasm the author actually expresses.

## Fit the content

| Context | Editorial aim |
| --- | --- |
| Homepage | Establish identity and a specific current interest in little space. Do not turn an introduction into a credentials inventory or squeeze in an invented origin story. |
| About | Develop selected background, interests, opinions, and motivations supplied by the author. Let details explain the person; do not repackage a résumé or assert a life philosophy. |
| Project card | State what it does and any essential status or constraint. A card need not contain a miniature problem-solution-outcome story. |
| Detailed project writeup | Explain actual architecture, implementation, constraints, alternatives, mistakes, and results where evidence exists. Choose headings around the material; retain team attribution and distinguish contribution from ownership. |
| Blog | Allow more context and exploration. Opinions need scope, experiments need actual observations, and tutorials need accurate examples. An open question can remain open. |
| Microcopy | Prefer recognizable labels and clear actions. Captions can add a specific observation. Empty states explain the actual state; do not invent a next action or hide meaning behind personality. |

The current site stores homepage prose in `src/components/sections/home/Hero.astro`, About prose in `src/pages/about.astro`, projects in `src/content/projects/`, and practicum material in `src/content/practicum/summary.md`. Identity and navigation metadata live in `src/site.config.ts`; certificates use `src/data/certificates.ts`. Other labels occur in Astro components. These are navigation aids, not approved wording or facts. No blog collection is currently established; this skill does not create one.

## Discovery

The maintained source is `.claude/skills/portfolio-writing/`. `.agents/skills/portfolio-writing` links to it so there is only one copy.

- [Claude Code](https://code.claude.com/docs/en/skills): project `.claude/skills/`; invoke `/portfolio-writing`.
- [Codex](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills): project `.agents/skills/`, including symlinked folders; invoke `$portfolio-writing`.
- [Pi](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md): supports project `.agents/skills/`; invoke `/skill:portfolio-writing` and use `/reload` after edits. Its [loader follows directory symlinks](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/core/skills.ts).

These are documented discovery paths, not a guarantee of model selection or compatibility with every agent/version. AGENTS.md supplies an explicit fallback route. Other agents need a supported discovery location or an instruction to read this skill. No platform-specific tool permissions or dependencies are required.
