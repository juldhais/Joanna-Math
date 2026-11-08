# Joanna-Math

A responsive FISO-style math practice app. Pick a level (Kindergarten, Levels 1–6) and sit a timed 20-question multiple-choice paper with an answer sheet, mark-for-review and worked solutions. It is unofficial practice material and works fully offline.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Question bank

Every level has a built-in bank of exactly 100 questions, generated deterministically (seeded) from templates in `src/data/bank/`. Each paper draws 20 of them following the level's topic blueprint, then shuffles the question order and the answer options, so every attempt is different. There is no AI service and no API key.

Verify the banks after changing any generator:

```bash
npm run check:bank
```

The check confirms 100 questions per level, the topic split, valid question shape, distinct options, correct arithmetic for `Find a + b = ?` style prompts, and that shuffled papers are unique.
