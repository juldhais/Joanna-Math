import type { Question } from '../types/quiz'
import type { FisoLevel } from './levels'
import { createRng } from './bank/helpers'
import type { Rng } from './bank/helpers'

/** Each topic's bank holds this many questions per question in the 20-question blueprint, so a level has 100. */
export const BANK_MULTIPLIER = 5
export const BANK_SIZE = 100
export const PAPER_SIZE = 20

const MAX_TRIES_PER_QUESTION = 200

interface BankedQuestion extends Question { topic: string }

const banks = new Map<string, BankedQuestion[]>()

const hash = (text: string) => [...text].reduce((h, char) => (Math.imul(h, 31) + char.charCodeAt(0)) >>> 0, 7)

/** Builds (once) the fixed 100-question bank for a level. Seeded, so it is identical on every load. */
export function getQuestionBank(level: FisoLevel): Question[] {
  const cached = banks.get(level.id)
  if (cached) return cached
  const bank: BankedQuestion[] = []
  level.topics.forEach((topic, topicIndex) => {
    const rng = createRng(hash(level.id) + topicIndex * 7919)
    const target = topic.count * BANK_MULTIPLIER
    const seen = new Set<string>()
    const made: BankedQuestion[] = []
    for (let tries = 0; tries < target * MAX_TRIES_PER_QUESTION && made.length < target; tries++) {
      let draft
      try { draft = topic.make(rng) } catch { continue }
      const key = `${draft.prompt}|${JSON.stringify(draft.visual ?? null)}|${draft.options[draft.correctAnswer]}`
      if (seen.has(key)) continue
      seen.add(key)
      made.push({ ...draft, id: `${level.id}-${topicIndex + 1}-${made.length + 1}`, category: topic.name, topic: topic.name })
    }
    if (made.length < target) throw new Error(`${level.label}: topic "${topic.name}" produced ${made.length} of ${target} questions.`)
    bank.push(...made)
  })
  banks.set(level.id, bank)
  return bank
}

const newRng = (): Rng => createRng(Math.floor(Math.random() * 2 ** 32))

/** Picks a fresh 20-question paper: the level's topic blueprint, random questions from the bank, shuffled order and shuffled options. */
export function generatePaper(level: FisoLevel, rng: Rng = newRng()): Question[] {
  const bank = getQuestionBank(level)
  const paper: Question[] = []
  for (const topic of level.topics) {
    const pool = bank.filter((question) => (question as BankedQuestion).topic === topic.name)
    paper.push(...rng.shuffle(pool).slice(0, topic.count))
  }
  return rng.shuffle(paper).map((question) => {
    const { topic: _topic, ...clean } = question as BankedQuestion
    void _topic
    const order = rng.shuffle(clean.options.map((_, index) => index))
    return { ...clean, options: order.map((index) => clean.options[index]), correctAnswer: order.indexOf(clean.correctAnswer) }
  })
}
