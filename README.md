# Joanna-Math

A responsive FISO math practice app with selectable levels, a 20-question built-in bank, and optional OpenRouter-generated question sets tailored to the selected level.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## OpenRouter setup

Choose a FISO level on the start screen. Open **AI settings**, enter an OpenRouter API key, and choose a model slug (the default is `openrouter/free`). Generated questions and the selected level are saved in this browser's local storage; cached questions are kept separately for each level. Keys and model choices are also stored in local storage. Requests are made directly from the browser; this is convenient for a local practice app, but browser-stored keys are accessible to anyone with access to the browser profile. For a public deployment, use a server-side proxy rather than embedding personal API keys in the client. If generation fails, the app uses saved questions for the selected level when available, otherwise the built-in question bank.
