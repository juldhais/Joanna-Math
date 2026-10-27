import { useEffect, useState } from 'react'
import { BookOpenCheck, BrainCircuit, Check, ChevronRight, CircleHelp, Settings2, ShieldCheck } from 'lucide-react'
import { ApiKeyDialog } from './components/ApiKeyDialog'
import { QuizCard } from './components/QuizCard'
import { ResultView } from './components/ResultView'
import { FISO_LEVELS } from './data/levels'
import { fallbackQuestions } from './data/questions'
import { DEFAULT_MODEL, generateQuestions } from './services/openrouter'
import type { Question, QuizSession } from './types/quiz'

const SESSION_KEY = 'fiso_kg_sim_state'
const AI_QUESTIONS_KEY = 'fiso_kg_ai_questions'
const LEVEL_STORAGE_KEY = 'fiso_math_level'

function readCachedQuestions(levelId: string): Question[] | null {
  try {
    const levelCache = `${AI_QUESTIONS_KEY}_${levelId}`
    const raw = localStorage.getItem(levelCache) ?? (levelId === 'kindergarten' ? localStorage.getItem(AI_QUESTIONS_KEY) : null)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== 20) return null
    const valid = parsed.every((question) => {
      if (!question || typeof question !== 'object') return false
      const item = question as Partial<Question>
      return typeof item.id === 'string' && typeof item.category === 'string' &&
        typeof item.prompt === 'string' && Array.isArray(item.options) && item.options.length === 4 &&
        item.options.every((option) => typeof option === 'string') &&
        Number.isInteger(item.correctAnswer) && (item.correctAnswer as number) >= 0 &&
        (item.correctAnswer as number) < 4 && typeof item.explanation === 'string'
    })
    return valid ? parsed as Question[] : null
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
      setSession({ questions, levelId: selectedLevel.id, currentQuestionIndex: 0, selectedAnswers: {}, isSubmitted: false, timestamp: Date.now(), source })
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
    <header className="site-header"><a className="brand" href="#" onClick={(event) => { event.preventDefault(); if (!session) window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span className="brand-mark"><BookOpenCheck size={20} /></span><span>Joanna-Math <b>· FISO Practice</b></span></a><div className="header-right"><span className="header-tag">MATH PRACTICE</span><button className="settings-button" onClick={() => setSettingsOpen(true)}><Settings2 size={17} /><span>AI settings</span>{apiConfigured && <i />}</button></div></header>
    {!session && <main className="home-layout">
      <section className="hero-panel">
        <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> FISO MATH PRACTICE</span><h1>A little practice.<br /><span>A lot of confidence.</span></h1><p>Choose your FISO level and get ready for a math challenge tailored to you.</p><div className="level-picker"><label htmlFor="fiso-level">Choose your level</label><select id="fiso-level" value={selectedLevel.id} onChange={(event) => changeLevel(event.target.value)} disabled={isLoading}>{FISO_LEVELS.map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}</select><small>{selectedLevel.id === 'kindergarten' ? 'Early math: counting, shapes, patterns, and simple logic. Add an API key for fresh AI questions.' : 'Questions are generated for this FISO level. Saved sets are available if AI is offline.'}</small></div><button className="button button-primary start-button" onClick={() => void startTest()} disabled={isLoading}>{isLoading ? <><span className="spinner" /> Preparing your test…</> : <>Start {selectedLevel.label} test <ChevronRight size={19} /></>}</button><div className="hero-trust"><ShieldCheck size={16} /><span>No timer · Your progress saves automatically</span></div></div>
        <div className="hero-art" aria-hidden="true"><div className="art-circle art-circle-one" /><div className="art-circle art-circle-two" /><div className="floating-card card-count"><span>2 + 3 = ?</span><div><i /><i /><i /><i /><i /></div></div><div className="floating-card card-shape"><span className="shape-triangle">△</span><span className="shape-circle">○</span><span className="shape-square">□</span></div><div className="art-note"><BrainCircuit size={20} /><span>Think, try,<br />and learn!</span></div></div>
      </section>
      {notice && <div className="notice" role="status"><CircleHelp size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
      <section className="info-grid"><article className="info-card"><span className="info-icon icon-blue"><BookOpenCheck size={19} /></span><div><h2>20 questions</h2><p>A balanced set of fun math problems to try.</p></div></article><article className="info-card"><span className="info-icon icon-purple"><BrainCircuit size={19} /></span><div><h2>Practice by level</h2><p>Questions match your selected FISO level.</p></div></article><article className="info-card"><span className="info-icon icon-green"><Check size={19} /></span><div><h2>Review as you go</h2><p>See clear explanations when you finish.</p></div></article></section>
      <div className="source-note">{apiConfigured ? `AI questions are generated for ${selectedLevel.label} · Saved question sets are kept by level` : 'Built-in Kindergarten questions are available · Add an OpenRouter key for level-specific AI questions'}</div>
    </main>}
    {session && notice && <div className="notice session-notice" role="status"><CircleHelp size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}
    {session && !session.isSubmitted && activeQuestion && <QuizCard question={activeQuestion} levelLabel={FISO_LEVELS.find((level) => level.id === session.levelId)?.label ?? 'Kindergarten'} index={session.currentQuestionIndex} total={session.questions.length} selectedAnswer={session.selectedAnswers[activeQuestion.id]} onSelect={(answer) => updateSession({ selectedAnswers: { ...session.selectedAnswers, [activeQuestion.id]: answer } })} onNavigate={(index) => updateSession({ currentQuestionIndex: Math.max(0, Math.min(session.questions.length - 1, index)) })} onSubmit={() => updateSession({ isSubmitted: true })} onExit={exitTest} />}
    {session?.isSubmitted && <ResultView questions={session.questions} levelLabel={FISO_LEVELS.find((level) => level.id === session.levelId)?.label ?? 'Kindergarten'} answers={session.selectedAnswers} onRetake={retake} onHome={() => { setSession(null); localStorage.removeItem(SESSION_KEY) }} isLoading={isLoading} />}
    <footer className="site-footer"><span>Joanna-Math · FISO Math Practice</span><span>Practice at your own pace</span></footer>
    <ApiKeyDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={saveSettings} />
  </div>
}
