import { useEffect, useState } from 'react'
import { BookOpenCheck, BrainCircuit, Check, Play, ShieldCheck, Sparkles } from 'lucide-react'
import { QuizCard, speechSupported } from './components/QuizCard'
import { ResultView } from './components/ResultView'
import { FISO_LEVELS } from './data/levels'
import { ICON_COLORS, ICON_MAP, ICON_NAMES } from './data/icons'
import type { IconName } from './data/icons'
import { PAPER_SIZE, bankSizeOf, drawPaper } from './data/questionBank'
import type { QuizSession } from './types/quiz'

const SESSION_KEY = 'fiso_kg_sim_state'
const LEVEL_STORAGE_KEY = 'fiso_math_level'
/** Ids of bank questions already drawn in the current cycle, per level, so papers rotate through the whole bank. */
const seenKey = (levelId: string) => `fiso_math_seen_${levelId}`
/** Stickers won by finishing Kindergarten papers (icon names, oldest first). */
const STICKER_KEY = 'fiso_math_stickers'
const MAX_STICKERS = 60
const STICKER_ICONS: IconName[] = ['star', 'heart', 'rocket', 'cat', 'dog', 'rabbit', 'turtle', 'fish', 'bird', 'bug', 'cake', 'ice-cream', 'cookie', 'candy', 'apple', 'cherry', 'gift', 'flower', 'sun', 'moon', 'car', 'bus', 'bike', 'tree']
const KINDER_ID = FISO_LEVELS[0].id
/** Keys written by earlier versions that used OpenRouter. They are removed so no API key stays in the browser. */
const OBSOLETE_KEYS = ['fiso_openrouter_key', 'fiso_openrouter_model', 'fiso_kg_ai_questions', ...FISO_LEVELS.map((level) => `fiso_kg_ai_questions_${level.id}`)]

function readSession(): QuizSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as QuizSession
    if (!Array.isArray(parsed.questions) || !parsed.questions.length || typeof parsed.currentQuestionIndex !== 'number') return null
    return { ...parsed, levelId: typeof parsed.levelId === 'string' ? parsed.levelId : 'kindergarten' }
  } catch { return null }
}

function readSeen(levelId: string): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(seenKey(levelId)) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch { return [] }
}

function readStickers(): IconName[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STICKER_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((name): name is IconName => ICON_NAMES.includes(name as IconName)) : []
  } catch { return [] }
}

export default function App() {
  const [stickers, setStickers] = useState<IconName[]>(() => readStickers())
  const [session, setSession] = useState<QuizSession | null>(() => readSession())
  const [selectedLevelId, setSelectedLevelId] = useState(() => {
    const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY)
    return FISO_LEVELS.some((level) => level.id === savedLevel) ? savedLevel! : FISO_LEVELS[0].id
  })

  useEffect(() => {
    try { OBSOLETE_KEYS.forEach((key) => localStorage.removeItem(key)) } catch { /* Storage may be unavailable. */ }
  }, [])
  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }, [session])

  const startTest = (levelId = selectedLevelId) => {
    const level = FISO_LEVELS.find((item) => item.id === levelId) ?? FISO_LEVELS[0]
    localStorage.removeItem(SESSION_KEY)
    const { questions, seen } = drawPaper(level, readSeen(level.id))
    try { localStorage.setItem(seenKey(level.id), JSON.stringify(seen)) } catch { /* Storage may be unavailable. */ }
    setSession({ questions, levelId: level.id, currentQuestionIndex: 0, selectedAnswers: {}, isSubmitted: false, flagged: [], elapsedSeconds: 0, timestamp: Date.now() })
  }

  const updateSession = (updates: Partial<QuizSession>) => setSession((current) => current ? { ...current, ...updates } : current)
  /** QuizCard asks for confirmation before calling this; the saved session is kept. */
  const exitTest = () => setSession(null)
  const changeLevel = (levelId: string) => {
    setSelectedLevelId(levelId)
    localStorage.setItem(LEVEL_STORAGE_KEY, levelId)
  }
  /** Finishing a Kindergarten paper with at least half the questions answered wins a sticker, preferring ones not collected yet. */
  const submitTest = (seconds: number) => {
    if (!session) return
    let reward: string | undefined
    const answered = session.questions.filter((question) => session.selectedAnswers[question.id] !== undefined).length
    if (session.levelId === KINDER_ID && answered * 2 >= session.questions.length) {
      const fresh = STICKER_ICONS.filter((icon) => !stickers.includes(icon))
      const pool = fresh.length ? fresh : STICKER_ICONS
      const sticker = pool[Math.floor(Math.random() * pool.length)]
      const next = [...stickers, sticker].slice(-MAX_STICKERS)
      reward = sticker
      setStickers(next)
      try { localStorage.setItem(STICKER_KEY, JSON.stringify(next)) } catch { /* Storage may be unavailable. */ }
    }
    updateSession({ isSubmitted: true, elapsedSeconds: seconds, reward })
  }
  /** Starts a new paper at the level of the finished one. */
  const retake = () => session && startTest(session.levelId)

  const activeQuestion = session?.questions[session.currentQuestionIndex]
  const selectedLevel = FISO_LEVELS.find((level) => level.id === selectedLevelId) ?? FISO_LEVELS[0]
  const sessionLevelLabel = FISO_LEVELS.find((level) => level.id === session?.levelId)?.label ?? 'Kindergarten'
  const kid = (session?.levelId ?? selectedLevelId) === KINDER_ID
  return <div className={`app-shell ${kid ? 'theme-kinder' : ''}`}>
    <header className="site-header"><a className="brand" href="#" onClick={(event) => { event.preventDefault(); if (!session) window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span className="brand-mark"><BookOpenCheck size={20} /></span><span>Joanna-Math <b>· FISO Mathematics</b></span></a><div className="header-right"><span className="header-tag">OLYMPIAD PRACTICE</span></div></header>
    {!session && <main className="home-layout">
      <section className="hero-panel">
        <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> FISO MATHS PRACTICE</span><h1>Let's practise maths!<br /><span>One question at a time.</span></h1><p>Pick your level, then answer {PAPER_SIZE} questions.{speechSupported ? ' Tap the speaker to hear each question read aloud.' : ''}</p><div className="level-picker"><span id="level-label">Choose your level</span><div className="level-grid" role="radiogroup" aria-labelledby="level-label">{FISO_LEVELS.map((level, levelIndex) => <button key={level.id} className={`level-card level-tone-${levelIndex} ${level.id === selectedLevel.id ? 'selected' : ''}`} role="radio" aria-checked={level.id === selectedLevel.id} onClick={() => changeLevel(level.id)}><b>{levelIndex === 0 ? 'K' : levelIndex}</b><span>{levelIndex === 0 ? 'Kinder' : `Level ${levelIndex}`}</span></button>)}</div><small>{selectedLevel.description}</small></div><button className="button button-primary start-button" onClick={() => startTest()}><Play size={20} /> Start {selectedLevel.label} test</button><div className="hero-trust"><ShieldCheck size={16} /><span>Timed paper · Progress saves automatically</span></div>{kid && <div className="sticker-book"><strong><Sparkles size={16} /> My stickers{stickers.length ? ` (${stickers.length})` : ''}</strong>{stickers.length ? <div className="sticker-row">{stickers.map((name, index) => { const Icon = ICON_MAP[name]; return <span className="sticker" key={index} title={name}><Icon size={24} strokeWidth={2.2} className={ICON_COLORS[index % ICON_COLORS.length]} /></span> })}</div> : <span>Finish a test to win your first sticker!</span>}</div>}</div>
        <div className="hero-art" aria-hidden="true"><div className="art-circle art-circle-one" /><div className="art-circle art-circle-two" /><div className="floating-card card-count"><span>2 + 3 = ?</span><div><i /><i /><i /><i /><i /></div></div><div className="floating-card card-shape"><span className="shape-triangle">△</span><span className="shape-circle">○</span><span className="shape-square">□</span></div><div className="art-spark art-spark-one">+</div><div className="art-spark art-spark-two">×</div><div className="art-spark art-spark-three">=</div><div className="art-note"><BrainCircuit size={20} /><span>Think, try,<br />and learn!</span></div></div>
      </section>
      <section className="info-grid"><article className="info-card"><span className="info-icon icon-blue"><BookOpenCheck size={19} /></span><div><h2>{bankSizeOf(selectedLevel)} questions in this level</h2><p>Every paper is a fresh, shuffled selection of {PAPER_SIZE}.</p></div></article><article className="info-card"><span className="info-icon icon-purple"><BrainCircuit size={19} /></span><div><h2>Listen and tap</h2><p>Big answer buttons and read-aloud questions, plus a timer and answer sheet.</p></div></article><article className="info-card"><span className="info-icon icon-green"><Check size={19} /></span><div><h2>Worked solutions</h2><p>Score, time and explanations after you submit.</p></div></article></section>
      <div className="source-note">Works offline · all questions are built in</div>
    </main>}
    {session && !session.isSubmitted && activeQuestion && <QuizCard questions={session.questions} levelLabel={sessionLevelLabel} kid={kid} index={Math.min(session.currentQuestionIndex, session.questions.length - 1)} answers={session.selectedAnswers} flagged={session.flagged ?? []} initialElapsed={session.elapsedSeconds ?? 0} onSelect={(answer) => updateSession({ selectedAnswers: { ...session.selectedAnswers, [activeQuestion.id]: answer } })} onToggleFlag={() => updateSession({ flagged: (session.flagged ?? []).includes(activeQuestion.id) ? (session.flagged ?? []).filter((id) => id !== activeQuestion.id) : [...(session.flagged ?? []), activeQuestion.id] })} onNavigate={(index) => updateSession({ currentQuestionIndex: Math.max(0, Math.min(session.questions.length - 1, index)) })} onElapsed={(seconds) => updateSession({ elapsedSeconds: seconds })} onSubmit={submitTest} onExit={exitTest} />}
    {session?.isSubmitted && <ResultView questions={session.questions} levelLabel={sessionLevelLabel} kid={kid} reward={session.reward} answers={session.selectedAnswers} elapsedSeconds={session.elapsedSeconds ?? 0} onRetake={retake} onHome={() => { setSession(null); localStorage.removeItem(SESSION_KEY) }} />}
    <footer className="site-footer"><span>Joanna-Math · FISO Math Practice</span><span>Unofficial practice material</span></footer>
  </div>
}
