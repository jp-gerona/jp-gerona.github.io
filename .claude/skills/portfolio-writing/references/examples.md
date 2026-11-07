# Illustrative editing examples

The first seven scenarios are synthetic and establish no facts about the author. The final section uses authorized originals with proposed edits that the author has not approved. Use the editing principle, not the wording as a reusable template.

## Generic About introduction

Supplied facts: the fictional author builds software and is exploring application security.

Before: “I am a passionate innovator dedicated to crafting transformative digital experiences while continuously expanding my horizons.”

After: “I build software. Lately, I've been exploring application security.”

Principle: replace unsupported positioning with supplied specifics. This is deliberately modest; ask what aspect of application security interests the author before making it more distinctive.

## Rough technical project notes

Notes: “CSV import, some rows fail. I kept good rows, show bad rows separately. wasn't sure about all-or-nothing. no user testing yet.”

Edited: “The importer keeps valid rows and lists the ones that failed. I considered rejecting the whole file, but kept partial imports for now. I haven't tested that choice with users yet.”

Principle: retain the choice and uncertainty without inventing its motivation or success. Do not claim that this reduced support work or made retries safe.

## Design decision and tradeoff

Supplied facts: a prototype reads a local JSON file at startup; edits require a restart; a database was considered but not implemented.

Before: “By leveraging lightweight persistence, I achieved an optimal balance of simplicity and scalability.”

After: “The prototype reads a JSON file when it starts. Changes need a restart. I considered a database, but haven't added one.”

Principle: show the actual behavior and cost. The facts do not establish scalability or why the author deferred the database; request that rationale if it matters to the writeup.

## Personal observation

Notes: “spent longer choosing a chart library than making the chart. maybe should've tried plain SVG first.”

Edited: “I spent longer choosing a chart library than making the chart. Maybe I should have tried plain SVG first.”

Principle: preserve the specific self-aware observation and tentative conclusion. Do not turn it into a universal lesson about simplicity or add a joke.

## Incomplete work

Supplied facts: an idea for a browser extension, with a sketch of the settings screen; no implementation.

Before: “This extension empowers users to take control of their browsing experience.”

After: “This is an idea for a browser extension. So far, I've only sketched the settings screen.”

Principle: make status explicit. A useful description of its intended behavior still requires that behavior to be supplied; do not invent features to fill the gap.

## Microcopy

Context: a filtered project list has no matches; the interface provides a clear-filters action.

Before: “Oops! Your journey of discovery has reached a temporary pause.”

After: “No projects match these filters.” Button: “Clear filters”.

Principle: state what happened and use the action the interface actually supports. Personality should not obscure the task.

## Minimal editing

Draft: “I tried caching the response, but the stale data was harder to explain than the wait. I removed the cache.”

Edited: unchanged.

Principle: the draft already has a concrete attempt, consequence, and decision. There is no need to add a hook, tradeoff list, or reflective ending. Factual acceptance still depends on the supplied source, not the sentence sounding plausible.


## Proposed light edits of authorized originals

These demonstrate editing historical text, not updates to current biography. Source details and approval scope are in [samples.md](samples.md). The edits are editorial proposals, not approved voice samples.

### Keep a concrete comparison

Original, live-docs README: “When you compare it to using plain React only, it would have taken more effort to set-up these things.”

Proposed: “Setting these things up with plain React would have taken more effort.”

The preceding source sentence names routing, API integration, and server-side work. Keep that context when using the edit. The counterfactual remains counterfactual; this does not claim a measured comparison.

### Repair phrasing without changing the experience

Original, apple_website README: “To be more specific, it was really different from using plain/static HTML, CSS, and Javascript that I am used to.”

Proposed: “More specifically, it was very different from using the plain, static HTML, CSS, and JavaScript that I'm used to.”

Retains the past experience and the author's stated familiar baseline. It does not invent what specifically made React different; a deeper explanation would need more material.

### Preserve the small aside

Original, portfolio-v1 website: “My submission to the University of Makati Web Design Elimination Round with only one day to complete (I tried).”

Proposed: “My submission to the University of Makati Web Design Elimination Round. I had only one day to complete it (I tried).”

Separates the time constraint while preserving its limited claim and existing humor. Do not add an outcome or imply the submission won.
