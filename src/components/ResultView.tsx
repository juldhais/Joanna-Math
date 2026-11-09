import { useMemo } from 'react'
import { ArrowLeft, RotateCcw, Star, Trophy } from 'lucide-react'
import { ICON_MAP, resolveIconName } from '../data/icons'
import type { Question } from '../types/quiz'
import { formatTime } from './QuizCard'

interface ResultViewProps {
  questions: Question[]
  levelLabel: string
  answers: Record<string, number>
  elapsedSeconds: number
  /** Kindergarten: trophy, confetti and sticker reward. */
  kid?: boolean
  /** Icon name of the sticker won with this paper, if any. */
  reward?: string
  onRetake: () => void
  onHome: () => void
}

const CONFETTI_COLORS = ['#ff6b6b', '#ffc93c', '#4cc38a', '#3b9cf0', '#b565e8', '#ff8f3c']

/** CSS-only celebration: pieces fall twice, then stay hidden. */
function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 48 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 1.2, duration: 2.6 + Math.random() * 2, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length], round: i % 3 === 0 })), [])
  return <div className="confetti" aria-hidden="true">{pieces.map((piece, i) => <i key={i} style={{ left: `${piece.left}%`, background: piece.color, animationDelay: `${piece.delay}s`, animationDuration: `${piece.duration}s`, borderRadius: piece.round ? '50%' : '2px' }} />)}</div>
}

export function ResultView({ questions, levelLabel, answers, elapsedSeconds, kid = false, reward, onRetake, onHome }: ResultViewProps) {
  const score = questions.reduce((sum, question) => sum + (answers[question.id] === question.correctAnswer ? 1 : 0), 0)
  const unanswered = questions.filter((question) => answers[question.id] === undefined).length
  const wrong = questions.length - score - unanswered
  const categories = [...questions.reduce((map, question) => { const entry = map.get(question.category) ?? { right: 0, total: 0 }; entry.total++; if (answers[question.id] === question.correctAnswer) entry.right++; return map.set(question.category, entry) }, new Map<string, { right: number; total: number }>())]
  const accuracy = Math.round((score / questions.length) * 100)
  const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : accuracy >= 30 ? 1 : 0
  const cheer = ['Good try! Let\'s practise again.', 'Nice work! Keep going.', 'Great job!', 'Amazing! Superstar!'][stars]
  const rewardName = resolveIconName(reward)
  const RewardIcon = rewardName ? ICON_MAP[rewardName] : null
  return <main className="results-layout">
    {(kid || stars === 3) && <Confetti />}
    <button className="text-button" onClick={onHome}><ArrowLeft size={17} /> Back to home</button>
    <section className="results-summary">
      {kid && <div className="result-trophy" aria-hidden="true"><Trophy size={52} /></div>}
      <div className="result-stars" role="img" aria-label={`${stars} of 3 stars`}>{[0, 1, 2].map((i) => <Star key={i} size={44} className={i < stars ? 'on' : ''} />)}</div>
      <h1>{cheer}</h1>
      <span className="category-pill result-level">{levelLabel}</span>
      <p className="muted">You got {score} out of {questions.length} right. See the answers below.</p>
      {kid && (RewardIcon ? <div className="reward-card"><span className="reward-sticker"><RewardIcon size={44} strokeWidth={2.2} /></span><div><strong>You won a new sticker!</strong><span>It is in your sticker book on the home page.</span></div></div> : <div className="reward-card reward-none"><div><strong>No sticker this time</strong><span>Answer at least half the questions to win one.</span></div></div>)}
      <div className="score-grid"><div className="score-card"><span>Score</span><strong>{score} <small>/ {questions.length}</small></strong></div><div className="score-card"><span>Accuracy</span><strong>{accuracy}<small>%</small></strong></div><div className="score-card"><span>Time taken</span><strong>{formatTime(elapsedSeconds)}</strong></div></div>
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
