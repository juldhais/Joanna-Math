# Project guidance for AI coding agents

## Project overview

Joanna-Math is a responsive React + TypeScript app for FISO math practice. It provides selectable levels, a built-in Kindergarten question bank, and optional AI-generated question sets through OpenRouter.

## Commands

- `npm run dev` — start the local Vite development server.
- `npm run build` — run the TypeScript project build and create the production bundle.
- `npm run preview` — preview the production build locally.

Run `npm run build` after code changes to check TypeScript and production bundling.

## Codebase map

- `src/App.tsx` — app state, level selection, local-storage persistence, and quiz flow.
- `src/data/levels.ts` — FISO level labels and age-appropriate guidance.
- `src/data/questions.ts` — the built-in Kindergarten question bank.
- `src/services/openrouter.ts` — AI prompt, OpenRouter request, and response parsing.
- `src/types/quiz.ts` — question, visual, and quiz-session types.
- `src/components/` — quiz, result, visual, and API-key settings UI.
- `src/index.css` — global and component styling.

## Conventions and requirements

- Follow the existing React function-component and TypeScript patterns. Keep types strict; the TypeScript config enables `strict`, `noUnusedLocals`, and `noUnusedParameters`.
- Keep question data compatible across the built-in bank, OpenRouter responses, cached question sets, and quiz rendering. Questions have exactly four options and a zero-based `correctAnswer` from 0 to 3.
- Keep AI prompt instructions and response parsing aligned with the `Question` and `VisualMetadata` types.
- Visual icons are rendered from the Lucide icon map in `src/components/VisualHelper.tsx`. AI-generated visuals should use supported icon names and existing visual types; do not introduce image URLs or image data for icons.
- Preserve the current local-storage behavior and fallback flow unless the task specifically asks to change it. Do not expose API keys in source code; OpenRouter calls currently run in the browser, and this security tradeoff is documented in `README.md`.
- Keep the interface responsive and consistent with the existing styling. The stylesheet is compact and largely minified; when editing it, make the smallest targeted change and avoid duplicating existing rules.
- Avoid adding dependencies for changes that can be handled with the current React, TypeScript, and Lucide packages.

## Change workflow

1. Inspect the related components, types, and data before changing shared behavior.
2. Make focused changes that satisfy the requested scope.
3. Run `npm run build` and report any checks that could not be completed.
