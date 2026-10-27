import { ArrowLeft, ArrowRight, Check, Flag } from 'lucide-react'
import type { Question } from '../types/quiz'
import { VisualHelper } from './VisualHelper'

interface QuizCardProps {
  question: Question
  levelLabel: string
  index: number
  total: number
  selectedAnswer?: number
  onSelect: (answer: number) => void
  onNavigate: (index: number) => void
  onSubmit: () => void
  onExit: () => void
}

export function QuizCard({ question, levelLabel, index, total, selectedAnswer, onSelect, onNavigate, onSubmit, onExit }: QuizCardProps) {
  const progress = ((index + 1) / total) * 100
  return <main className="quiz-layout">
    <div className="quiz-topline"><button className="text-button" onClick={onExit}><ArrowLeft size={17} /> Exit test</button><span>{levelLabel} · Question {index + 1} of {total}</span></div>
    <div className="progress-track" role="progressbar" aria-label="Test progress" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={total}><div style={{ width: `${progress}%` }} /></div>
    <section className="question-card">
      <div className="question-meta"><span className="category-pill">{question.category}</span><span className="question-number">{String(index + 1).padStart(2, '0')}</span></div>
      <h1>{question.prompt}</h1>
      <VisualHelper visual={question.visual} />
      <div className="options-list" role="radiogroup" aria-label="Answer choices">
        {question.options.map((option, optionIndex) => <button key={optionIndex} className={`option-card ${selectedAnswer === optionIndex ? 'selected' : ''}`} role="radio" aria-checked={selectedAnswer === optionIndex} onClick={() => onSelect(optionIndex)}>
          <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span className="option-text">{option}</span>{selectedAnswer === optionIndex && <Check size={19} className="option-check" />}
        </button>)}
      </div>
      <div className="question-nav">
        <button className="button button-secondary" onClick={() => onNavigate(index - 1)} disabled={index === 0}><ArrowLeft size={17} /> Previous</button>
        {index < total - 1 ? <button className="button button-primary" onClick={() => onNavigate(index + 1)}>Next question <ArrowRight size={17} /></button> : <button className="button button-primary" onClick={onSubmit}><Flag size={17} /> Finish test</button>}
      </div>
    </section>
    <div className="question-dots" aria-label="Question navigation">{Array.from({ length: total }, (_, dotIndex) => <button key={dotIndex} className={`${dotIndex === index ? 'current' : ''} ${dotIndex === index ? '' : ''}`} data-answered={dotIndex === index ? 'current' : undefined} onClick={() => onNavigate(dotIndex)} aria-label={`Go to question ${dotIndex + 1}`} aria-current={dotIndex === index ? 'step' : undefined} />)}</div>
    <p className="quiz-note"><Check size={14} /> Your answers are saved automatically</p>
  </main>
}
