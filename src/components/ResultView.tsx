import { ArrowLeft, RotateCcw } from 'lucide-react'
import type { Question } from '../types/quiz'

interface ResultViewProps {
  questions: Question[]
  levelLabel: string
  answers: Record<string, number>
  onRetake: () => void
  onHome: () => void
  isLoading: boolean
}

export function ResultView({ questions, levelLabel, answers, onRetake, onHome, isLoading }: ResultViewProps) {
  const score = questions.reduce((sum, question) => sum + (answers[question.id] === question.correctAnswer ? 1 : 0), 0)
  const accuracy = Math.round((score / questions.length) * 100)
  return <main className="results-layout">
    <button className="text-button" onClick={onHome} disabled={isLoading}><ArrowLeft size={17} /> Back to home</button>
    <section className="results-summary">
      <span className="eyebrow">TEST COMPLETE</span>
      <h1>Here are your results</h1>
      <span className="category-pill result-level">{levelLabel}</span>
      <p className="muted">Take a look at how you did and review each answer below.</p>
      <div className="score-grid"><div className="score-card"><span>Raw score</span><strong>{score} <small>/ {questions.length}</small></strong></div><div className="score-card"><span>Accuracy</span><strong>{accuracy}<small>%</small></strong></div></div>
      <button className="button button-primary" onClick={onRetake} disabled={isLoading}>{isLoading ? <><span className="spinner" /> Starting new test…</> : <><RotateCcw size={17} /> Retake test</>}</button>
    </section>
    <section className="review-section">
      <div className="review-heading"><div><span className="eyebrow">ANSWER REVIEW</span><h2>Question-by-question</h2></div><span>{score} correct · {questions.length - score} to review</span></div>
      <div className="review-list">{questions.map((question, index) => {
        const chosen = answers[question.id]
        const isCorrect = chosen === question.correctAnswer
        return <article className="review-card" key={question.id}>
          <div className="review-question-head"><span className="review-index">{String(index + 1).padStart(2, '0')}</span><span className="category-pill">{question.category}</span><span className={`review-status ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? 'Correct' : 'Review'}</span></div>
          <h3>{question.prompt}</h3>
          <div className="answer-comparison"><div><span>Your answer</span><strong className={isCorrect ? 'answer-correct' : 'answer-incorrect'}>{chosen === undefined ? 'Not answered' : `${String.fromCharCode(65 + chosen)}. ${question.options[chosen]}`}</strong></div><div><span>Correct answer</span><strong className="answer-correct">{String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}</strong></div></div>
          <p className="explanation"><strong>Explanation:</strong> {question.explanation}</p>
        </article>
      })}</div>
    </section>
  </main>
}
