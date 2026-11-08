import { ArrowLeft, RotateCcw } from 'lucide-react'
import type { Question } from '../types/quiz'
import { formatTime } from './QuizCard'

interface ResultViewProps {
  questions: Question[]
  levelLabel: string
  answers: Record<string, number>
  elapsedSeconds: number
  onRetake: () => void
  onHome: () => void
}

export function ResultView({ questions, levelLabel, answers, elapsedSeconds, onRetake, onHome }: ResultViewProps) {
  const score = questions.reduce((sum, question) => sum + (answers[question.id] === question.correctAnswer ? 1 : 0), 0)
  const unanswered = questions.filter((question) => answers[question.id] === undefined).length
  const wrong = questions.length - score - unanswered
  const categories = [...questions.reduce((map, question) => { const entry = map.get(question.category) ?? { right: 0, total: 0 }; entry.total++; if (answers[question.id] === question.correctAnswer) entry.right++; return map.set(question.category, entry) }, new Map<string, { right: number; total: number }>())]
  const accuracy = Math.round((score / questions.length) * 100)
  return <main className="results-layout">
    <button className="text-button" onClick={onHome}><ArrowLeft size={17} /> Back to home</button>
    <section className="results-summary">
      <span className="eyebrow">ANSWER SHEET SUBMITTED</span>
      <h1>Your results</h1>
      <span className="category-pill result-level">{levelLabel}</span>
      <p className="muted">Review each question and its worked solution below.</p>
      <div className="score-grid"><div className="score-card"><span>Raw score</span><strong>{score} <small>/ {questions.length}</small></strong></div><div className="score-card"><span>Accuracy</span><strong>{accuracy}<small>%</small></strong></div><div className="score-card"><span>Time taken</span><strong>{formatTime(elapsedSeconds)}</strong></div></div>
      <div className="tally"><span className="tally-right">{score} correct</span><span className="tally-wrong">{wrong} incorrect</span><span className="tally-blank">{unanswered} unanswered</span></div>
      {categories.length > 1 && <div className="topic-breakdown"><strong>By topic</strong>{categories.map(([name, { right, total }]) => <div key={name}><span>{name}</span><div className="progress-track"><div style={{ width: `${(right / total) * 100}%` }} /></div><em>{right}/{total}</em></div>)}</div>}
      <button className="button button-primary" onClick={onRetake}><RotateCcw size={17} /> Take a new paper</button>
    </section>
    <section className="review-section">
      <div className="review-heading"><div><span className="eyebrow">ANSWER REVIEW</span><h2>Question-by-question</h2></div><span>{score} correct · {questions.length - score} to review</span></div>
      <div className="review-list">{questions.map((question, index) => {
        const chosen = answers[question.id]
        const isCorrect = chosen === question.correctAnswer
        return <article className="review-card" key={question.id}>
          <div className="review-question-head"><span className="review-index">{String(index + 1).padStart(2, '0')}</span><span className="category-pill">{question.category}</span><span className={`review-status ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? 'Correct' : chosen === undefined ? 'Unanswered' : 'Incorrect'}</span></div>
          <h3>{question.prompt}</h3>
          <div className="answer-comparison"><div><span>Your answer</span><strong className={isCorrect ? 'answer-correct' : 'answer-incorrect'}>{chosen === undefined ? 'Not answered' : `${String.fromCharCode(65 + chosen)}. ${question.options[chosen]}`}</strong></div><div><span>Correct answer</span><strong className="answer-correct">{String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}</strong></div></div>
          <p className="explanation"><strong>Worked solution:</strong> {question.explanation}</p>
        </article>
      })}</div>
    </section>
  </main>
}
