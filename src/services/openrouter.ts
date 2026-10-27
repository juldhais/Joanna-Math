import OpenAI from 'openai'
import type { FisoLevel } from '../data/levels'
import type { Question } from '../types/quiz'

export const DEFAULT_MODEL = 'openrouter/free'

const schemaInstructions = `Return only a valid JSON object with a "questions" array. Generate exactly 20 multiple-choice math questions appropriate for the specified FISO level. Each question must have: id (string), category (string), prompt (string), options (array of exactly 4 strings), correctAnswer (zero-based integer from 0 to 3), and explanation (clear, concise string suitable for the learner's level). You may optionally include visual with type "icons", "sequence", "comparison_bars", or "shapes_grid" and items (array). Do not use markdown or text outside the JSON.`

function parseQuestionResponse(content: string): Question[] {
  const cleaned = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const parsed: unknown = JSON.parse(cleaned)
  if (!parsed || typeof parsed !== 'object' || !('questions' in parsed) || !Array.isArray(parsed.questions)) {
    throw new Error('The model response did not contain a questions array.')
  }
  const questions = (parsed as { questions: unknown[] }).questions
  if (questions.length !== 20) throw new Error('The model did not return 20 questions.')
  return questions.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`Question ${index + 1} is invalid.`)
    const q = item as Partial<Question>
    if (typeof q.prompt !== 'string' || !Array.isArray(q.options) || q.options.length !== 4 ||
      !q.options.every((option) => typeof option === 'string') || !Number.isInteger(q.correctAnswer) ||
      (q.correctAnswer as number) < 0 || (q.correctAnswer as number) > 3 || typeof q.explanation !== 'string') {
      throw new Error(`Question ${index + 1} has an invalid format.`)
    }
    return { ...q, id: typeof q.id === 'string' ? q.id : `ai-${index + 1}`, category: typeof q.category === 'string' ? q.category : 'Math', prompt: q.prompt, options: q.options, correctAnswer: q.correctAnswer, explanation: q.explanation } as Question
  })
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
  const response = await client.chat.completions.create({
    model: model.trim() || DEFAULT_MODEL,
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: schemaInstructions },
      { role: 'user', content: `Create 20 balanced FISO-style questions for ${level.label}. Level guidance: ${level.guidance} Use a good range of relevant topics and reasoning challenges for this level. Keep all four answer choices plausible, ensure exactly one correct answer, and make every explanation accurate.` },
    ],
  })
  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('OpenRouter returned an empty response.')
  return parseQuestionResponse(content)
}
