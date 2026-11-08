import { FISO_LEVELS } from '../src/data/levels'
import { getQuestionBank } from '../src/data/questionBank'
for (const level of FISO_LEVELS) {
  console.log(`\n## ${level.label}`)
  const bank = getQuestionBank(level)
  for (const topic of level.topics) {
    const qs = bank.filter((q) => q.category === topic.name)
    for (const q of [qs[3], qs[qs.length - 2]]) console.log(`[${topic.name.slice(0, 18)}] ${q.prompt} => ${q.options[q.correctAnswer]} (${q.options.join(' | ')}) // ${q.explanation}`)
  }
}
