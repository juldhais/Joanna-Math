import { useEffect, useState } from 'react'
import { BookOpenCheck, BrainCircuit, Check, ChevronRight, CircleHelp, Settings2, ShieldCheck } from 'lucide-react'
import { ApiKeyDialog } from './components/ApiKeyDialog'
import { QuizCard } from './components/QuizCard'
import { ResultView } from './components/ResultView'
import { FISO_LEVELS } from './data/levels'
import { fallbackQuestions } from './data/questions'
import { DEFAULT_MODEL, generateQuestions } from './services/openrouter'
import { sanitizeStoredQuestions } from './services/questionValidation'
import type { Question, QuizSession } from './types/quiz'

const SESSION_KEY = 'fiso_kg_sim_state'
const AI_QUESTIONS_KEY = 'fiso_kg_ai_questions'
const LEVEL_STORAGE_KEY = 'fiso_math_level'

function readCachedQuestions(levelId: string): Question[] | null {
  try {
    const levelCache = `${AI_QUESTIONS_KEY}_${levelId}`
    const raw = localStorage.getItem(levelCache) ?? (levelId === 'kindergarten' ? localStorage.getItem(AI_QUESTIONS_KEY) : null)
    if (!raw) return null
    return sanitizeStoredQuestions(JSON.parse(raw))
  } catch { return null }
}

function readSession(): QuizSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as QuizSession
    if (!Array.isArray(parsed.questions) || !parsed.questions.length || typeof parsed.currentQuestionIndex !== 'number') return null
    return { ...parsed, levelId: typeof parsed.levelId === 'string' ? parsed.levelId : 'kindergarten' }
  } catch { return null }
}

export default function App() {
  const [session, setSession] = useState<QuizSession | null>(() => readSession())
  const [selectedLevelId, setSelectedLevelId] = useState(() => {
    const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY)
    return FISO_LEVELS.some((level) => level.id === savedLevel) ? savedLevel! : FISO_LEVELS[0].id
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [apiConfigured, setApiConfigured] = useState(() => Boolean(localStorage.getItem('fiso_openrouter_key')))

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }, [session])

  const startTest = async () => {
    if (isLoading) return
    localStorage.removeItem(SESSION_KEY)
    setNotice('')
    setIsLoading(true)
    try {
      const apiKey = localStorage.getItem('fiso_openrouter_key')
      const model = localStorage.getItem('fiso_openrouter_model') || DEFAULT_MODEL
      const selectedLevel = FISO_LEVELS.find((level) => level.id === selectedLevelId) ?? FISO_LEVELS[0]
      const cachedQuestions = readCachedQuestions(selectedLevel.id)
      let questions = cachedQuestions ?? fallbackQuestions
      let source: QuizSession['source'] = cachedQuestions ? 'cached' : 'static'
      if (apiKey) {
        try {
          questions = await generateQuestions(apiKey, model, selectedLevel)
          source = 'openrouter'
          try { localStorage.setItem(`${AI_QUESTIONS_KEY}_${selectedLevel.id}`, JSON.stringify(questions)) } catch { /* Continue if browser storage is full or unavailable. */ }
        } catch (error) {
          const detail = error instanceof Error ? error.message : 'The AI service could not be reached.'
          const fallbackSource = cachedQuestions ? 'your saved AI questions' : 'the built-in question bank'
          setNotice(`AI questions unavailable (${detail}). Starting with ${fallbackSource} instead.`)
        }
      } else if (!cachedQuestions && selectedLevel.id !== 'kindergarten') {
        setNotice(`No saved AI questions are available for ${selectedLevel.label} yet. Add an OpenRouter key to generate level-specific questions; the built-in bank is for Kindergarten.`)
      }
      setSession({ questions, levelId: selectedLevel.id, currentQuestionIndex: 0, selectedAnswers: {}, isSubmitted: false, flagged: [], elapsedSeconds: 0, timestamp: Date.now(), source })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSession = (updates: Partial<QuizSession>) => setSession((current) => current ? { ...current, ...updates } : current)
  const exitTest = () => {
    if (window.confirm('Exit this test? Your progress will stay saved so you can continue later.')) setSession(null)
  }
  const retake = () => {
    localStorage.removeItem(SESSION_KEY)
    void startTest()
  }
  const saveSettings = (key: string, model: string) => {
    if (key) localStorage.setItem('fiso_openrouter_key', key)
    else localStorage.removeItem('fiso_openrouter_key')
    localStorage.setItem('fiso_openrouter_model', model || DEFAULT_MODEL)
    setApiConfigured(Boolean(key))
  }
  const changeLevel = (levelId: string) => {
    setSelectedLevelId(levelId)
    localStorage.setItem(LEVEL_STORAGE_KEY, levelId)
    setNotice('')
  }

  const activeQuestion = session?.questions[session.currentQuestionIndex]
  const selectedLevel = FISO_LEVELS.find((level) => level.id === selectedLevelId) ?? FISO_LEVELS[0]
  return <div className="app-shell">
    <header className="site-header"><a className="brand" href="#" onClick={(event) => { event.preventDefault(); if (!session) window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span className="brand-mark"><BookOpenCheck size={20} /></span><span>Joanna-Math <b>· FISO Mathematics</b></span></a><div className="header-right"><span className="header-tag">OLYMPIAD PRACTICE</span><button className="settings-button" onClick={() => setSettingsOpen(true)}><Settings2 size={17} /><span>AI settings</span>{apiConfigured && <i />}</button></div></header>
    {!session && <main className="home-layout">
      <section className="hero-panel">
        <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> FISO MATHEMATICS OLYMPIAD · PRACTICE PAPER</span><h1>Sit the paper.<br /><span>Build the confidence.</span></h1><p>Pick a level and work through a 20-question multiple-choice paper in exam conditions, with an answer sheet and a timer.</p><div className="level-picker"><label htmlFor="fiso-level">Choose your level</label><select id="fiso-level" value={selectedLevel.id} onChange={(event) => changeLevel(event.target.value)} disabled={isLoading}>{FISO_LEVELS.map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}</select><small>{selectedLevel.id === 'kindergarten' ? 'Early math: counting, shapes, patterns, and simple logic. Add an API key for fresh AI questions.' : 'Questions are generated for this FISO level. Saved sets are available if AI is offline.'}</small></div><button className="button button-primary start-button" onClick={() => void startTest()} disabled={isLoading}>{isLoading ? <><span className="spinner" /> Preparing your test…</> : <>Start {selectedLevel.label} test <ChevronRight size={19} /></>}</button><div className="hero-trust"><ShieldCheck size={16} /><span>Timed paper · Progress saves automatically</span></div></div>
        <div className="hero-art" aria-hidden="true"><div className="art-circle art-circle-one" /><div className="art-circle art-circle-two" /><div className="floating-card card-count"><span>2 + 3 = ?</span><div><i /><i /><i /><i /><i /></div></div><div className="floating-card card-shape"><span className="shape-triangle">△</span><span className="shape-circle">○</span><span className="shape-square">□</span></div><div className="art-note"><BrainCircuit size={20} /><span>Think, try,<br />and learn!</span></div></div>
      </section>
      {notice && <div className="notice" role="status"><CircleHelp size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
      <section className="info-grid"><article className="info-card"><span className="info-icon icon-blue"><BookOpenCheck size={19} /></span><div><h2>20-question paper</h2><p>Four options (A–D) per question, one correct answer.</p></div></article><article className="info-card"><span className="info-icon icon-purple"><BrainCircuit size={19} /></span><div><h2>Exam tools</h2><p>Timer, answer sheet and mark-for-review, like the real paper.</p></div></article><article className="info-card"><span className="info-icon icon-green"><Check size={19} /></span><div><h2>Worked solutions</h2><p>Score, time and explanations after you submit.</p></div></article></section>
      <div className="source-note">{apiConfigured ? `AI questions are generated for ${selectedLevel.label} · Saved question sets are kept by level` : 'Built-in Kindergarten questions are available · Add an OpenRouter key for level-specific AI questions'}</div>
    </main>}
    {session && notice && <div className="notice session-notice" role="status"><CircleHelp size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
    {session && !session.isSubmitted && activeQuestion && <QuizCard questions={session.questions} levelLabel={FISO_LEVELS.find((level) => level.id === session.levelId)?.label ?? 'Kindergarten'} index={Math.min(session.currentQuestionIndex, session.questions.length - 1)} answers={session.selectedAnswers} flagged={session.flagged ?? []} initialElapsed={session.elapsedSeconds ?? 0} onSelect={(answer) => updateSession({ selectedAnswers: { ...session.selectedAnswers, [activeQuestion.id]: answer } })} onToggleFlag={() => updateSession({ flagged: (session.flagged ?? []).includes(activeQuestion.id) ? (session.flagged ?? []).filter((id) => id !== activeQuestion.id) : [...(session.flagged ?? []), activeQuestion.id] })} onNavigate={(index) => updateSession({ currentQuestionIndex: Math.max(0, Math.min(session.questions.length - 1, index)) })} onElapsed={(seconds) => updateSession({ elapsedSeconds: seconds })} onSubmit={(seconds) => updateSession({ isSubmitted: true, elapsedSeconds: seconds })} onExit={exitTest} />}
    {session?.isSubmitted && <ResultView questions={session.questions} levelLabel={FISO_LEVELS.find((level) => level.id === session.levelId)?.label ?? 'Kindergarten'} answers={session.selectedAnswers} elapsedSeconds={session.elapsedSeconds ?? 0} onRetake={retake} onHome={() => { setSession(null); localStorage.removeItem(SESSION_KEY) }} isLoading={isLoading} />}
    <footer className="site-footer"><span>Joanna-Math · FISO Math Practice</span><span>Unofficial practice material</span></footer>
    <ApiKeyDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={saveSettings} />
  </div>
}
