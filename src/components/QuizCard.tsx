import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, Check, Clock, Flag, LogOut, Rocket, Star, Volume2 } from 'lucide-react'
import type { Question } from '../types/quiz'
import { VisualHelper } from './VisualHelper'
import { ConfirmDialog } from './ConfirmDialog'

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
const stopSpeaking = () => { if (speechSupported) window.speechSynthesis.cancel() }
/** Friendly words shown to Kindergarten students once an answer is picked; they do not say whether it is right. */
const KID_CHEERS = ['Got it!', 'Good thinking!', 'Keep going!', 'Nice work!']
/** Reads the question and its choices aloud with the browser's built-in voice (offline, no network). */
const speakQuestion = (question: Question) => {
  if (!speechSupported) return
  const spoken = (text: string) => text.replace(/_{2,}/g, ' blank ').replace(/[−–]/g, ' minus ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ')
  const choices = question.options.map((option, index) => `${String.fromCharCode(65 + index)}: ${spoken(option)}.`).join(' ')
  const utterance = new SpeechSynthesisUtterance(`${spoken(question.prompt)} ${choices}`)
  utterance.lang = 'en-AU'
  utterance.rate = 0.9
  stopSpeaking()
  window.speechSynthesis.speak(utterance)
}

export const formatTime = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(total / 3600)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${hours ? `${hours}:` : ''}${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

interface QuizCardProps {
  questions: Question[]
  levelLabel: string
  /** Kindergarten: playful progress rider and encouragement. */
  kid?: boolean
  index: number
  answers: Record<string, number>
  flagged: string[]
  initialElapsed: number
  onSelect: (answer: number) => void
  onToggleFlag: () => void
  onNavigate: (index: number) => void
  onElapsed: (seconds: number) => void
  onSubmit: (seconds: number) => void
  onExit: () => void
}

export function QuizCard({ questions, levelLabel, kid = false, index, answers, flagged, initialElapsed, onSelect, onToggleFlag, onNavigate, onElapsed, onSubmit, onExit }: QuizCardProps) {
  const question = questions[index]
  const total = questions.length
  const selectedAnswer = answers[question.id]
  const isFlagged = flagged.includes(question.id)
  const answeredCount = questions.filter((item) => answers[item.id] !== undefined).length

  const [elapsed, setElapsed] = useState(initialElapsed)
  const elapsedRef = useRef(initialElapsed)
  const onElapsedRef = useRef(onElapsed)
  onElapsedRef.current = onElapsed
  useEffect(() => {
    const started = Date.now() - initialElapsed * 1000
    const tick = window.setInterval(() => { elapsedRef.current = Math.floor((Date.now() - started) / 1000); setElapsed(elapsedRef.current) }, 1000)
    const save = window.setInterval(() => onElapsedRef.current(elapsedRef.current), 10000)
    return () => { window.clearInterval(tick); window.clearInterval(save) }
  }, [initialElapsed])

  useEffect(() => stopSpeaking, [index])

  const [confirming, setConfirming] = useState<'submit' | 'exit' | null>(null)
  const unanswered = total - answeredCount
  const finish = () => setConfirming('submit')
  const exit = () => setConfirming('exit')
  const closeDialog = useCallback(() => setConfirming(null), [])
  const confirm = () => {
    stopSpeaking()
    if (confirming === 'submit') onSubmit(elapsedRef.current)
    else { onElapsed(elapsedRef.current); onExit() }
    setConfirming(null)
  }

  return <main className="quiz-layout exam-layout">
    <div className="exam-bar">
      <button className="text-button" onClick={exit}><ArrowLeft size={17} /> Exit</button>
      <div className="exam-title"><strong>FISO Mathematics</strong><span>{levelLabel}</span></div>
      <div className="exam-clock" aria-label="Time elapsed" role="timer"><Clock size={15} />{formatTime(elapsed)}</div>
    </div>
    <div className="exam-progress"><span>{answeredCount} of {total} answered</span><div className="progress-wrap"><div className="progress-track" role="progressbar" aria-label="Questions answered" aria-valuenow={answeredCount} aria-valuemin={0} aria-valuemax={total}><div style={{ width: `${(answeredCount / total) * 100}%` }} /></div>{kid && <span className="progress-rider" style={{ left: `${(answeredCount / total) * 100}%` }} aria-hidden="true"><Rocket size={20} /></span>}</div>{kid && <Star size={22} className={`progress-goal ${answeredCount === total ? 'on' : ''}`} aria-hidden="true" />}</div>
    <section className="question-card exam-paper">
      <div className="question-meta"><span className="exam-qno">Question {index + 1}<small> / {total}</small></span><span className="category-pill">{question.category}</span></div>
      <div className="question-body" key={question.id}>
      <div className="question-prompt"><h1>{question.prompt}</h1>{speechSupported && <button className="listen-button" onClick={() => speakQuestion(question)} aria-label="Read the question aloud" title="Read aloud"><Volume2 size={22} /><span>Listen</span></button>}</div>
      <VisualHelper visual={question.visual} />
      <div className="options-list" role="radiogroup" aria-label="Answer choices">
        {question.options.map((option, optionIndex) => <button key={optionIndex} className={`option-card ${selectedAnswer === optionIndex ? 'selected' : ''}`} role="radio" aria-checked={selectedAnswer === optionIndex} onClick={() => onSelect(optionIndex)}>
          <span className={`option-letter letter-${optionIndex}`}>{String.fromCharCode(65 + optionIndex)}</span><span className="option-text">{option}</span>{selectedAnswer === optionIndex && <Check size={19} className="option-check" />}
        </button>)}
      </div>
      </div>
      <div className="exam-actions"><button className={`flag-button ${isFlagged ? 'on' : ''}`} onClick={onToggleFlag} aria-pressed={isFlagged}><Bookmark size={15} /> {isFlagged ? 'Marked for review' : 'Mark for review'}</button>{selectedAnswer !== undefined && <span className="exam-saved" key={`${question.id}-${selectedAnswer}`}>{kid ? <Star size={15} /> : <Check size={13} />} {kid ? KID_CHEERS[index % KID_CHEERS.length] : 'Answer saved'}</span>}</div>
      <div className="question-nav">
        <button className="button button-secondary" onClick={() => onNavigate(index - 1)} disabled={index === 0}><ArrowLeft size={17} /> Previous</button>
        {index < total - 1 ? <button className="button button-primary" onClick={() => onNavigate(index + 1)}>Next <ArrowRight size={17} /></button> : <button className="button button-primary" onClick={finish}><Flag size={17} /> Finish test</button>}
      </div>
    </section>
    <section className="answer-sheet" aria-label="Answer sheet">
      <div className="sheet-head"><strong>Answer sheet</strong><button className="text-button" onClick={finish}>Finish test</button></div>
      <div className="sheet-grid">{questions.map((item, itemIndex) => {
        const state = [answers[item.id] !== undefined ? 'answered' : '', flagged.includes(item.id) ? 'flagged' : '', itemIndex === index ? 'current' : ''].join(' ')
        return <button key={item.id} className={`sheet-cell ${state}`} onClick={() => onNavigate(itemIndex)} aria-label={`Question ${itemIndex + 1}${answers[item.id] !== undefined ? ', answered' : ', unanswered'}${flagged.includes(item.id) ? ', marked for review' : ''}`} aria-current={itemIndex === index ? 'step' : undefined}>{itemIndex + 1}</button>
      })}</div>
      <div className="sheet-legend"><span><i className="answered" /> Answered</span><span><i /> Unanswered</span><span><i className="flagged" /> Marked</span></div>
    </section>
    <p className="quiz-note"><Check size={14} /> Your answers are saved automatically</p>
    {confirming === 'submit' && <ConfirmDialog icon={<Flag size={20} />} title={unanswered ? `${unanswered} question${unanswered === 1 ? '' : 's'} left` : 'All done?'} message={unanswered ? 'Some questions have no answer yet. You can go back and answer them, or finish now.' : 'Great work! Once you finish, you cannot change your answers.'} confirmLabel="Finish test" cancelLabel={unanswered ? 'Go back' : 'Check again'} onConfirm={confirm} onCancel={closeDialog} />}
    {confirming === 'exit' && <ConfirmDialog icon={<LogOut size={20} />} title="Take a break?" message="Your answers are saved. You can carry on from here next time." confirmLabel="Exit" cancelLabel="Keep going" onConfirm={confirm} onCancel={closeDialog} />}
  </main>
}
