import { BAR_COLORS, ICON_COLORS, MAX_ICON_COUNT, resolveIconName } from '../data/icons'
import type { Question, VisualItem, VisualMetadata, VisualType } from '../types/quiz'

export const QUESTION_COUNT = 20

const MAX_ITEMS: Record<VisualType, number> = { icons: 8, sequence: 12, comparison_bars: 8, shapes_grid: 8 }

type Rec = Record<string, unknown>
const isRecord = (value: unknown): value is Rec => typeof value === 'object' && value !== null && !Array.isArray(value)

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed && trimmed.length <= max ? trimmed : null
}

function pickColor(value: unknown, palette: readonly string[], index: number): string {
  const wanted = typeof value === 'string' ? value.trim() : ''
  return palette.includes(wanted) ? wanted : palette[index % palette.length]
}

/** Returns a safe visual, or null if the visual is malformed or cannot be drawn faithfully (e.g. an unknown icon or a count above the render limit). */
export function sanitizeVisual(raw: unknown): VisualMetadata | null {
  if (!isRecord(raw) || !Array.isArray(raw.items)) return null
  const type = raw.type
  if (type !== 'icons' && type !== 'sequence' && type !== 'comparison_bars' && type !== 'shapes_grid') return null
  if (raw.items.length === 0 || raw.items.length > MAX_ITEMS[type]) return null

  const items: VisualItem[] = []
  for (let index = 0; index < raw.items.length; index++) {
    const entry: unknown = raw.items[index]
    if (!isRecord(entry)) return null
    if (type === 'icons') {
      const icon = resolveIconName(entry.icon)
      const count = entry.count === undefined ? 1 : entry.count
      if (!icon || typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > MAX_ICON_COUNT) return null
      const label = text(entry.label, 30)
      items.push({ icon, count, color: pickColor(entry.color, ICON_COLORS, index), ...(label ? { label } : {}) })
    } else if (type === 'sequence') {
      const label = text(entry.label, 20)
      if (!label) return null
      items.push({ label })
    } else if (type === 'comparison_bars') {
      const label = text(entry.label, 30)
      const value = entry.value
      if (!label || typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 10000) return null
      items.push({ label, value, color: pickColor(entry.color, BAR_COLORS, index) })
    } else {
      const icon = resolveIconName(entry.icon)
      const label = text(entry.label, 30)
      if (!icon || !label) return null
      items.push({ icon, label })
    }
  }
  return { type, items }
}

// --- Answer checks -----------------------------------------------------------------------------

/** Evaluates + − × ÷ and parentheses without eval(). Returns null if the text is not a plain arithmetic expression. */
function evaluate(expression: string): number | null {
  const source = expression.replace(/(\d),(?=\d{3}(?!\d))/g, '$1').replace(/[−–]/g, '-')
  const tokens: string[] = []
  for (let i = 0; i < source.length;) {
    const char = source[i]
    if (/\s/.test(char)) { i++; continue }
    if (/[\d.]/.test(char)) {
      let j = i
      while (j < source.length && /[\d.]/.test(source[j])) j++
      tokens.push(source.slice(i, j))
      i = j
      continue
    }
    if ('+-()'.includes(char)) tokens.push(char)
    else if ('×xX*'.includes(char)) tokens.push('*')
    else if ('÷/'.includes(char)) tokens.push('/')
    else return null
    i++
  }

  let position = 0
  const parseExpression = (): number | null => {
    let value = parseTerm()
    while (value !== null && (tokens[position] === '+' || tokens[position] === '-')) {
      const operator = tokens[position++]
      const right = parseTerm()
      if (right === null) return null
      value = operator === '+' ? value + right : value - right
    }
    return value
  }
  const parseTerm = (): number | null => {
    let value = parseFactor()
    while (value !== null && (tokens[position] === '*' || tokens[position] === '/')) {
      const operator = tokens[position++]
      const right = parseFactor()
      if (right === null) return null
      if (operator === '/' && right === 0) return null
      value = operator === '*' ? value * right : value / right
    }
    return value
  }
  const parseFactor = (): number | null => {
    const token = tokens[position]
    if (token === undefined) return null
    if (token === '-') { position++; const inner = parseFactor(); return inner === null ? null : -inner }
    if (token === '(') {
      position++
      const inner = parseExpression()
      if (inner === null || tokens[position] !== ')') return null
      position++
      return inner
    }
    if (/^(\d+\.?\d*|\.\d+)$/.test(token)) { position++; return Number(token) }
    return null
  }

  const result = parseExpression()
  return result !== null && position === tokens.length && Number.isFinite(result) ? result : null
}

/** Parses an answer option such as "52", "−2", "1,250", "0.5" or "7/8" into a number; null if it is not a plain number. */
function optionValue(option: string): number | null {
  const cleaned = option.replace(/[−–]/g, '-').replace(/,/g, '').trim()
  const fraction = /^(-?\d+)\s*\/\s*(\d+)$/.exec(cleaned)
  if (fraction) return Number(fraction[2]) === 0 ? null : Number(fraction[1]) / Number(fraction[2])
  return /^-?\d+(\.\d+)?$/.test(cleaned) ? Number(cleaned) : null
}

/**
 * Reconciles the stated answer with a value computed by the app.
 * Returns the index of the single option equal to `expected`, or null if none or several match.
 */
function matchingOption(options: string[], expected: number): number | null {
  const matches = options.flatMap((option, index) => {
    const value = optionValue(option)
    return value !== null && Math.abs(value - expected) < 1e-6 ? [index] : []
  })
  return matches.length === 1 ? matches[0] : null
}

const EXPRESSION_PROMPT = /^(?:find|calculate|compute|evaluate|work out|what is)?\s*:?\s*([-−(\d][\d\s+\-−–×xX*÷/().,]*)\s*=\s*(?:\?|_+)\s*$/i
const COUNTING_PROMPT = /^how many\b/i
const COUNTING_EXCLUSIONS = /\d|\b(more|fewer|less|left|altogether|in all|total|each|every|ate|eat|away|join|joins|joined|add|take|taken|remain|remains|groups?)\b/i
const NEEDS_VISUAL = /\b(picture|image|illustration|diagram|look at|you see|shown (?:below|above|here|in)|below|the bars?)\b|^how many [a-z ]+ are there\??$/i

/** The value an answer must equal when the prompt is plain arithmetic or a simple "how many" count over one icon group, else null. */
function expectedNumericAnswer(prompt: string, visual: VisualMetadata | undefined): number | null {
  const expression = EXPRESSION_PROMPT.exec(prompt)
  if (expression) return evaluate(expression[1])
  if (visual?.type === 'icons' && visual.items.length === 1 && COUNTING_PROMPT.test(prompt) && !COUNTING_EXCLUSIONS.test(prompt)) {
    return visual.items[0].count ?? null
  }
  return null
}

// --- Question validation -----------------------------------------------------------------------

export type ValidationResult = { ok: true; question: Question } | { ok: false; reason: string }
const fail = (reason: string): ValidationResult => ({ ok: false, reason })

export function validateQuestion(raw: unknown): ValidationResult {
  if (!isRecord(raw)) return fail('question is not an object')
  const prompt = text(raw.prompt, 400)
  if (!prompt) return fail('missing or oversized prompt')
  const explanation = text(raw.explanation, 700)
  if (!explanation) return fail(`"${prompt.slice(0, 40)}": missing explanation`)
  if (!Array.isArray(raw.options) || raw.options.length !== 4) return fail(`"${prompt.slice(0, 40)}": options must be exactly four`)
  const options: string[] = []
  for (const option of raw.options as unknown[]) {
    const value = text(option, 80)
    if (!value) return fail(`"${prompt.slice(0, 40)}": an option is empty or too long`)
    options.push(value)
  }
  if (new Set(options.map((option) => option.toLowerCase())).size !== 4) return fail(`"${prompt.slice(0, 40)}": options are not distinct`)
  const statedAnswer = raw.correctAnswer
  if (typeof statedAnswer !== 'number' || !Number.isInteger(statedAnswer) || statedAnswer < 0 || statedAnswer > 3) return fail(`"${prompt.slice(0, 40)}": invalid correctAnswer`)
  let correctAnswer: number = statedAnswer

  let visual: VisualMetadata | undefined
  if (raw.visual !== undefined && raw.visual !== null) {
    visual = sanitizeVisual(raw.visual) ?? undefined
    if (!visual && NEEDS_VISUAL.test(prompt)) return fail(`"${prompt.slice(0, 40)}": visual is invalid but the prompt depends on it`)
  } else if (NEEDS_VISUAL.test(prompt)) {
    return fail(`"${prompt.slice(0, 40)}": prompt refers to a picture that was not supplied`)
  }

  const expected = expectedNumericAnswer(prompt, visual)
  if (expected !== null) {
    const matched = matchingOption(options, expected)
    if (matched === null) return fail(`"${prompt.slice(0, 40)}": no single option equals the computed answer ${expected}`)
    correctAnswer = matched
  }

  const category = text(raw.category, 60) ?? 'Math'
  return { ok: true, question: { id: typeof raw.id === 'string' ? raw.id : 'pending', category, prompt, options, correctAnswer, explanation, ...(visual ? { visual } : {}) } }
}

const promptKey = (prompt: string) => prompt.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/** Validates every item independently, dropping duplicates (by `seen`, which is updated) and returning why items were rejected. */
export function collectValidQuestions(raw: unknown[], seen: Set<string> = new Set()): { valid: Question[]; rejected: string[] } {
  const valid: Question[] = []
  const rejected: string[] = []
  for (const item of raw) {
    const result = validateQuestion(item)
    if (!result.ok) { rejected.push(result.reason); continue }
    const key = promptKey(result.question.prompt)
    if (seen.has(key)) { rejected.push(`"${result.question.prompt.slice(0, 40)}": duplicate prompt`); continue }
    seen.add(key)
    valid.push(result.question)
  }
  return { valid, rejected }
}

/** Gives every question a unique id; answers are stored by id, so duplicates would collide. */
export function finalizeQuestions(questions: Question[]): Question[] {
  return questions.map((question, index) => ({ ...question, id: `ai-${index + 1}` }))
}

/** Validates a stored question set. Returns the sanitised set, or null if it is not a full, valid set. */
export function sanitizeStoredQuestions(raw: unknown): Question[] | null {
  if (!Array.isArray(raw) || raw.length !== QUESTION_COUNT) return null
  const { valid } = collectValidQuestions(raw)
  return valid.length === QUESTION_COUNT ? finalizeQuestions(valid) : null
}
