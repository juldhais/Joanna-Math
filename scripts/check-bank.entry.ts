import { FISO_LEVELS } from '../src/data/levels'
import { BANK_SIZE, PAPER_SIZE, generatePaper, getQuestionBank } from '../src/data/questionBank'
import { validateQuestion } from '../src/services/questionValidation'

const numeric = (text: string): number | null => {
  const t = text.replace(/[−–]/g, '-').replace(/[$,%°]|cm²?|km\/h|m\/s|km|m|g|litres|hours|units|mL|°C/g, '').trim()
  const f = /^(-?\d+)\/(\d+)$/.exec(t)
  if (f) return Number(f[1]) / Number(f[2])
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null
}

let failures = 0
const fail = (message: string) => { failures++; console.log(`FAIL ${message}`) }

for (const level of FISO_LEVELS) {
  const bank = getQuestionBank(level)
  if (bank.length !== BANK_SIZE) fail(`${level.label}: bank has ${bank.length}, expected ${BANK_SIZE}`)
  if (new Set(bank.map((q) => q.id)).size !== bank.length) fail(`${level.label}: duplicate ids`)
  const prompts = new Set(bank.map((q) => q.prompt))
  for (const q of bank) {
    const result = validateQuestion(q)
    if (!result.ok) fail(`${level.label} ${q.id}: ${result.reason}`)
    const values = q.options.map(numeric)
    if (values.every((v) => v !== null) && new Set(values.map((v) => Math.round((v as number) * 1e6))).size !== 4) fail(`${level.label} ${q.id}: options equal in value: ${q.prompt} ${q.options.join(' | ')}`)
    if (q.options.some((o) => /\d\.\d{4,}/.test(o))) fail(`${level.label} ${q.id}: unrounded option in ${q.options.join(' | ')}`)
    if (/NaN|undefined|Infinity/.test(JSON.stringify(q))) fail(`${level.label} ${q.id}: bad text ${q.prompt}`)
    if (q.visual?.type === 'icons' && q.visual.items.length === 1 && /^How many .* (are there|does .* have)\?$/.test(q.prompt) && String(q.visual.items[0].count) !== q.options[q.correctAnswer]) fail(`${level.label} ${q.id}: count mismatch`)
  }
  for (const topic of level.topics) {
    const n = bank.filter((q) => q.category === topic.name).length
    if (n !== topic.count * 5) fail(`${level.label} "${topic.name}": ${n} questions`)
  }
  const sum = level.topics.reduce((s, t) => s + t.count, 0)
  if (sum !== PAPER_SIZE) fail(`${level.label}: blueprint sums to ${sum}`)
  const visuals = bank.filter((q) => q.visual).length
  console.log(`${level.label.padEnd(14)} bank=${bank.length} uniquePrompts=${prompts.size} visuals=${visuals}`)
  const seenSets = new Set<string>()
  for (let i = 0; i < 25; i++) {
    const paper = generatePaper(level)
    if (paper.length !== PAPER_SIZE || new Set(paper.map((q) => q.id)).size !== PAPER_SIZE) fail(`${level.label}: bad paper`)
    for (const q of paper) { const ok = validateQuestion(q); if (!ok.ok) fail(`${level.label} paper ${q.id}: ${ok.reason}`) }
    seenSets.add(paper.map((q) => q.id).join(','))
  }
  if (seenSets.size < 25) fail(`${level.label}: papers repeat`)
}
console.log(failures ? `${failures} failure(s)` : 'Bank check passed')
process.exit(failures ? 1 : 0)
