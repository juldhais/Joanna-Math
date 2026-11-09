export type VisualType = 'icons' | 'sequence' | 'comparison_bars' | 'shapes_grid'

export interface VisualItem {
  icon?: string
  label?: string
  count?: number
  color?: string
  value?: number
}

export interface VisualMetadata {
  type: VisualType
  items: VisualItem[]
}

export interface Question {
  id: string
  category: string
  prompt: string
  options: string[]
  correctAnswer: number
  explanation: string
  visual?: VisualMetadata
}

export interface QuizSession {
  questions: Question[]
  levelId: string
  currentQuestionIndex: number
  selectedAnswers: Record<string, number>
  isSubmitted: boolean
  flagged?: string[]
  elapsedSeconds?: number
  /** Icon name of the sticker won by finishing this paper (Kindergarten only). */
  reward?: string
  timestamp: number
}
