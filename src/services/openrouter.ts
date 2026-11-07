import OpenAI from 'openai'
import { BAR_COLORS, ICON_COLORS, ICON_NAMES, MAX_ICON_COUNT } from '../data/icons'
import type { FisoLevel } from '../data/levels'
import type { Question } from '../types/quiz'
import { QUESTION_COUNT, collectValidQuestions, finalizeQuestions } from './questionValidation'

export const DEFAULT_MODEL = 'openrouter/free'

/** One initial request plus up to two top-ups for questions rejected by validation. */
const MAX_ATTEMPTS = 3
const TOP_UP_BUFFER = 2

const systemPrompt = `You write multiple-choice math practice questions for children, in the style of FISO math contests. Return only a valid JSON object of the form {"questions":[...]}. Do not use markdown or any text outside the JSON.

Each question has: id (string), category (string), prompt (string), options (array of exactly 4 distinct strings), correctAnswer (zero-based integer 0 to 3 that indexes options), and explanation (clear, accurate, step-by-step, suitable for the learner's level). A question may also have a visual: {"type": ..., "items": [...]}.

Visual types:
- "icons": items are {"icon": name, "count": integer 1-${MAX_ICON_COUNT}, "color": colour, "label": optional string}. Use one item per group of identical objects, and several items for addition, sharing or equal groups.
- "sequence": items are {"label": string}. Use short text or emoji labels, and "?" for the missing item.
- "comparison_bars": items are {"label": string, "value": positive number, "color": bar colour}, 2 to 8 bars.
- "shapes_grid": items are {"icon": name, "label": string}, showing shapes or objects.

Allowed icon names (use exactly these; never emoji, URLs or image data as an icon): ${ICON_NAMES.join(', ')}.
Allowed icon colours: ${ICON_COLORS.join(', ')}.
Allowed bar colours: ${BAR_COLORS.join(', ')}.

Rules:
- A visual must show exactly what the prompt describes. Drawn counts must agree with the prompt and the correct answer.
- If no allowed icon matches an object, do not substitute an unrelated icon. Use a "sequence" visual with emoji labels, or leave the visual out.
- Never write a question that needs a picture unless you supply the visual.
- Exactly one option is correct. Make the other three plausible, based on common mistakes.
- Work out every answer carefully before writing it, and make sure the explanation matches the correct option.
- Vary names, objects and contexts. No two questions may share a prompt. Vary the position of the correct answer.`

function buildUserPrompt(level: FisoLevel, count: number, existing: Question[]): string {
  const isFullSet = existing.length === 0 && count === QUESTION_COUNT
  const topics = isFullSet
    ? `Topic blueprint (exactly ${QUESTION_COUNT} questions in total):\n${level.topics.map((topic) => `- ${topic.name}: ${topic.count}`).join('\n')}`
    : `Choose from these topics, favouring any that are not yet covered:\n${level.topics.map((topic) => `- ${topic.name}`).join('\n')}`
  const avoid = existing.length
    ? `\n\nThese questions already exist. Do not repeat or closely rephrase them:\n${existing.slice(0, 30).map((question) => `- ${question.prompt.slice(0, 90)}`).join('\n')}`
    : ''
  const examples = level.examples.map((example, index) => `${index + 1}. ${JSON.stringify(example)}`).join('\n')
  return `Create exactly ${count} FISO-style multiple-choice questions for ${level.label}.

Level guidance: ${level.guidance}
Number range: ${level.numberRange}

${topics}

Visual policy: ${level.visualPolicy}

Style examples for this level (write new questions in this style; do not copy them):
${examples}${avoid}`
}

function parseQuestionList(content: string): unknown[] {
  const cleaned = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const parsed: unknown = JSON.parse(cleaned)
  if (!parsed || typeof parsed !== 'object' || !('questions' in parsed) || !Array.isArray(parsed.questions)) {
    throw new Error('The model response did not contain a questions array.')
  }
  return parsed.questions as unknown[]
}

export async function generateQuestions(apiKey: string, model: string, level: FisoLevel): Promise<Question[]> {
  const client = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      'HTTP-Referer': window.location.origin || 'http://localhost',
      'X-Title': 'Joanna-Math FISO Math Practice',
    },
  })

  const collected: Question[] = []
  const seen = new Set<string>()
  const problems: string[] = []

  for (let attempt = 0; attempt < MAX_ATTEMPTS && collected.length < QUESTION_COUNT; attempt++) {
    const requested = attempt === 0 ? QUESTION_COUNT : Math.min(QUESTION_COUNT, QUESTION_COUNT - collected.length + TOP_UP_BUFFER)
    // Network and API errors (bad key, rate limit) propagate immediately; only unusable content is retried.
    const response = await client.chat.completions.create({
      model: model.trim() || DEFAULT_MODEL,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildUserPrompt(level, requested, collected) },
      ],
    })
    const content = response.choices[0]?.message?.content
    if (!content) { problems.push('OpenRouter returned an empty response.'); continue }
    try {
      const { valid, rejected } = collectValidQuestions(parseQuestionList(content), seen)
      collected.push(...valid)
      problems.push(...rejected)
    } catch (error) {
      problems.push(error instanceof Error ? error.message : 'The model response could not be read.')
    }
  }

  if (collected.length < QUESTION_COUNT) {
    const summary = [...new Set(problems)].slice(0, 3).join('; ')
    throw new Error(`Only ${collected.length} of ${QUESTION_COUNT} questions passed checks${summary ? ` (${summary})` : ''}.`)
  }
  return finalizeQuestions(collected.slice(0, QUESTION_COUNT))
}
