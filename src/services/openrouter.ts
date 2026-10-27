import OpenAI from 'openai'
import type { FisoLevel } from '../data/levels'
import type { Question } from '../types/quiz'

export const DEFAULT_MODEL = 'openrouter/free'

const schemaInstructions = `Return only a valid JSON object with a "questions" array. Generate exactly 20 multiple-choice math questions appropriate for the specified FISO level. Each question must have: id (string), category (string), prompt (string), options (array of exactly 4 strings), correctAnswer (zero-based integer from 0 to 3), and explanation (clear, concise string suitable for the learner's level). You may optionally include visual with type "icons", "sequence", "comparison_bars", or "shapes_grid" and items (array). For "icons" and "shapes_grid" visuals, icon must be one of these supported Lucide icon names: apple, bird, circle, cookie, diamond, flower, heart, moon, square, star, triangle, or rectangle. Use icon names only—never image URLs or image data. An item can include count, color, and label as appropriate. Do not use markdown or text outside the JSON.`

const builtInQuestionExamples = `Use these built-in Kindergarten questions as style examples (adapt them to the requested level; do not copy all of them verbatim):
1. {"category":"Counting","prompt":"How many apples are there?","options":["3","4","5","6"],"correctAnswer":2,"explanation":"Count each apple once: 1, 2, 3, 4, 5. There are 5 apples.","visual":{"type":"icons","items":[{"icon":"apple","count":5,"color":"text-rose-500","label":"apple"}]}}
2. {"category":"Addition","prompt":"There are 2 ducks in the pond. 1 more duck joins them. How many ducks are there now?","options":["2","3","4","5"],"correctAnswer":1,"explanation":"Start with 2 ducks and add 1 more: 2 + 1 = 3.","visual":{"type":"icons","items":[{"icon":"bird","count":2,"color":"text-sky-500"},{"icon":"bird","count":1,"color":"text-amber-500"}]}}
3. {"category":"Patterns","prompt":"What comes next in this pattern? 🔴 🔵 🔴 🔵 __","options":["🔴","🔵","🟡","🟢"],"correctAnswer":0,"explanation":"The colors take turns red, blue. After blue, the pattern repeats with red.","visual":{"type":"sequence","items":[{"label":"🔴"},{"label":"🔵"},{"label":"🔴"},{"label":"🔵"},{"label":"?"}]}}
4. {"category":"Shapes","prompt":"Which shape has 3 sides?","options":["Circle","Square","Triangle","Rectangle"],"correctAnswer":2,"explanation":"A triangle has 3 straight sides and 3 corners.","visual":{"type":"shapes_grid","items":[{"icon":"circle","label":"Circle"},{"icon":"square","label":"Square"},{"icon":"triangle","label":"Triangle"},{"icon":"rectangle","label":"Rectangle"}]}}
5. {"category":"Addition and subtraction","prompt":"Find 41 + 23 − 12 = ?","options":["52","50","54","76"],"correctAnswer":0,"explanation":"First add 41 + 23 = 64. Then subtract 12: 64 − 12 = 52."}
For all FISO levels, include several two-digit addition and subtraction problems, including at least one multi-step expression such as 41 + 23 − 12. Adapt the difficulty and carrying/borrowing to the selected level, and explain each step clearly. For object-counting or picture-pattern questions inspired by the worksheet, include a visual whenever it helps the learner see what is being counted or compared. Represent objects with supported Lucide icon names; never return image URLs or image data. Use a sequence visual with text/emoji labels when the needed picture is not represented by a supported icon.`

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
      { role: 'user', content: `${builtInQuestionExamples}\n\nCreate 20 balanced FISO-style questions for ${level.label}. Level guidance: ${level.guidance} Use a good range of relevant topics and reasoning challenges for this level. Keep all four answer choices plausible, ensure exactly one correct answer, and make every explanation accurate.` },
    ],
  })
  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('OpenRouter returned an empty response.')
  return parseQuestionResponse(content)
}
