export interface FisoLevel {
  id: string
  label: string
  guidance: string
}

export const FISO_LEVELS: FisoLevel[] = [
  {
    id: 'kindergarten',
    label: 'Kindergarten',
    guidance: 'Use very simple language and early math: counting and comparing numbers to 20, addition and subtraction within 10, basic shapes, repeating patterns, and familiar everyday logic.',
  },
  {
    id: 'level-1',
    label: 'FISO Level 1',
    guidance: 'Use early primary math: place value and numbers to 100, addition and subtraction within 20, simple measurement, 2D shapes, and short number patterns.',
  },
  {
    id: 'level-2',
    label: 'FISO Level 2',
    guidance: 'Use primary math: numbers to 1,000, addition and subtraction with regrouping, introductory multiplication and division, simple fractions, time, and basic geometry.',
  },
  {
    id: 'level-3',
    label: 'FISO Level 3',
    guidance: 'Use upper-primary math: multi-digit operations, multiplication and division facts, equivalent fractions, decimals, perimeter, area, and multi-step word problems.',
  },
  {
    id: 'level-4',
    label: 'FISO Level 4',
    guidance: 'Use challenging upper-primary math: fractions and decimals, factors and multiples, ratios, measurement conversions, angles, data interpretation, and multi-step reasoning.',
  },
  {
    id: 'level-5',
    label: 'FISO Level 5',
    guidance: 'Use advanced primary math: percentages, ratios and proportion, integers, expressions, coordinate geometry, probability, and non-routine multi-step problems.',
  },
  {
    id: 'level-6',
    label: 'FISO Level 6',
    guidance: 'Use the most advanced level in this practice app: algebraic reasoning, proportional reasoning, percentages, geometry, statistics, probability, and olympiad-style multi-step problems.',
  },
]
