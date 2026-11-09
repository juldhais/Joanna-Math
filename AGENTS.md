# Project guidance for AI coding agents

## Project overview

Joanna-Math is a responsive React + TypeScript app for FISO math practice. It provides selectable levels and a built-in bank of at least 100 generated questions per level (Kindergarten has 180); each test is a shuffled draw of 20 that rotates through the whole bank (per-level draw history in local storage) before repeating questions. There is no AI or network dependency.

## Commands

- `npm run dev` — start the local Vite development server.
- `npm run build` — run the TypeScript project build and create the production bundle.
- `npm run preview` — preview the production build locally.
- `npm run check:bank` — verify the built-in question banks (size, validity, answers, shuffling).

Run `npm run build` (and `npm run check:bank` after bank changes) to check TypeScript and production bundling.

## Codebase map

- `src/App.tsx` — app state, level selection, local-storage persistence, and quiz flow.
- `src/data/levels.ts` — FISO levels and each level's 20-question topic blueprint.
- `src/data/bank/` — per-level question generators (seeded templates; each topic builds 5× its blueprint count).
- `src/data/questionBank.ts` — builds the question bank per level (a topic may set its own `bank` size) and draws a shuffled 20-question paper, preferring questions not yet drawn in the current cycle.
- `src/data/icons.ts` — Lucide icon registry and colour classes used by visuals.
- `src/services/questionValidation.ts` — question and visual validation used by `npm run check:bank`.
- `src/types/quiz.ts` — question, visual, and quiz-session types.
- `src/components/` — quiz, result, visual and confirm-dialog UI (the quiz has an offline read-aloud button using the browser speech API).
- `src/index.css` — global and component styling.

## Conventions and requirements

- Follow the existing React function-component and TypeScript patterns. Keep types strict; the TypeScript config enables `strict`, `noUnusedLocals`, and `noUnusedParameters`.
- Keep question data compatible across the built-in bank, saved sessions, and quiz rendering. Questions have exactly four options and a zero-based `correctAnswer` from 0 to 3.
- Generators must build every answer from the same numbers as the prompt, and `npm run check:bank` must pass.
- Visual icons are rendered from the icon map in `src/data/icons.ts` by `src/components/VisualHelper.tsx`. Visuals must use supported icon names and existing visual types; do not introduce image URLs or image data for icons.
- Preserve the current local-storage behavior (saved session and selected level) unless the task asks to change it. Do not add API keys or network calls without being asked.
- Keep the interface responsive and consistent with the existing styling. The stylesheet is compact and largely minified; when editing it, make the smallest targeted change and avoid duplicating existing rules.
- Avoid adding dependencies for changes that can be handled with the current React, TypeScript, and Lucide packages.

## Change workflow

1. Inspect the related components, types, and data before changing shared behavior.
2. Make focused changes that satisfy the requested scope.
3. Run `npm run build` and report any checks that could not be completed.
