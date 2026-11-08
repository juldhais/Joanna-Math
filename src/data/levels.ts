import { kindergarten } from './bank/kindergarten'
import { level1 } from './bank/level1'
import { level2 } from './bank/level2'
import { level3 } from './bank/level3'
import { level4 } from './bank/level4'
import { level5 } from './bank/level5'
import { level6 } from './bank/level6'
import type { Topic } from './bank/helpers'

export interface FisoLevel {
  id: string
  label: string
  /** One line shown on the start screen. */
  description: string
  /** Topic blueprint for one 20-question paper. Each level's built-in bank holds five times each topic's count (100 questions). */
  topics: Topic[]
}

export const FISO_LEVELS: FisoLevel[] = [
  { id: 'kindergarten', label: 'Kindergarten', description: 'Counting, comparing, shapes, patterns and adding or subtracting within 10.', topics: kindergarten },
  { id: 'level-1', label: 'FISO Level 1', description: 'Numbers to 100, add and subtract within 20, time, shapes and number patterns.', topics: level1 },
  { id: 'level-2', label: 'FISO Level 2', description: 'Numbers to 1,000, regrouping, equal groups, simple fractions, time and money.', topics: level2 },
  { id: 'level-3', label: 'FISO Level 3', description: 'Multi-digit operations, times tables, fractions, decimals, perimeter and area.', topics: level3 },
  { id: 'level-4', label: 'FISO Level 4', description: 'Fraction and decimal operations, LCM and HCF, ratios, conversions and angles.', topics: level4 },
  { id: 'level-5', label: 'FISO Level 5', description: 'Percentages, ratio, integers, equations, coordinates, probability and multi-step problems.', topics: level5 },
  { id: 'level-6', label: 'FISO Level 6', description: 'Algebra, rates and speed, successive percentages, geometry, statistics and olympiad problems.', topics: level6 },
]
