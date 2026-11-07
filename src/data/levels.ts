import type { Question } from '../types/quiz'

export interface LevelTopic {
  name: string
  count: number
}

export type LevelExample = Omit<Question, 'id'>

export interface FisoLevel {
  id: string
  label: string
  guidance: string
  /** Number sizes and operations the questions should stay within. */
  numberRange: string
  /** Topic blueprint for a 20-question set; counts sum to 20. */
  topics: LevelTopic[]
  /** How often and in what form visuals should appear at this level. */
  visualPolicy: string
  /** Level-appropriate style examples sent to the AI. All answers are verified correct. */
  examples: LevelExample[]
}

export const FISO_LEVELS: FisoLevel[] = [
  {
    id: 'kindergarten',
    label: 'Kindergarten',
    guidance: 'Use very simple language and early math: counting and comparing numbers to 20, addition and subtraction within 10, basic shapes, repeating patterns, and familiar everyday logic.',
    numberRange: 'Numbers 0–20; addition and subtraction answers within 10 (one multi-step item may stay within 10).',
    topics: [
      { name: 'Counting objects to 20', count: 5 }, { name: 'Comparing numbers (more, fewer, same)', count: 2 },
      { name: 'Addition within 10', count: 3 }, { name: 'Subtraction within 10', count: 3 },
      { name: 'Basic shapes', count: 3 }, { name: 'Repeating patterns', count: 2 },
      { name: 'Multi-step add/subtract within 10, e.g. "Find 4 + 3 − 2 = ?"', count: 2 },
    ],
    visualPolicy: 'Use a visual in at least 14 of the 20 questions: "icons" for counting, comparing, addition and subtraction; "shapes_grid" for shapes; "sequence" for patterns.',
    examples: [
      { category: 'Counting', prompt: 'How many apples are there?', options: ['3', '4', '5', '6'], correctAnswer: 2, explanation: 'Count each apple once: 1, 2, 3, 4, 5. There are 5 apples.', visual: { type: 'icons', items: [{ icon: 'apple', count: 5, color: 'text-rose-500' }] } },
      { category: 'Addition', prompt: 'There are 2 ducks in the pond. 1 more duck joins them. How many ducks are there now?', options: ['2', '3', '4', '5'], correctAnswer: 1, explanation: 'Start with 2 ducks and add 1 more: 2 + 1 = 3.', visual: { type: 'icons', items: [{ icon: 'bird', count: 2, color: 'text-sky-500' }, { icon: 'bird', count: 1, color: 'text-amber-500' }] } },
      { category: 'Patterns', prompt: 'What comes next in this pattern? 🔴 🔵 🔴 🔵 __', options: ['🔴', '🔵', '🟡', '🟢'], correctAnswer: 0, explanation: 'The colours take turns: red, blue. After blue comes red.', visual: { type: 'sequence', items: [{ label: '🔴' }, { label: '🔵' }, { label: '🔴' }, { label: '🔵' }, { label: '?' }] } },
      { category: 'Addition and subtraction', prompt: 'Find 4 + 3 − 2 = ?', options: ['5', '6', '4', '9'], correctAnswer: 0, explanation: 'First add 4 + 3 = 7. Then take away 2: 7 − 2 = 5.' },
    ],
  },
  {
    id: 'level-1',
    label: 'FISO Level 1',
    guidance: 'Use early primary math: place value and numbers to 100, addition and subtraction within 20, simple measurement, 2D shapes, and short number patterns.',
    numberRange: 'Numbers to 100; addition and subtraction facts within 20; two-digit add/subtract without regrouping.',
    topics: [
      { name: 'Place value to 100 (tens and ones)', count: 3 }, { name: 'Addition within 20', count: 3 },
      { name: 'Subtraction within 20', count: 3 }, { name: 'Two-digit addition and subtraction without regrouping, including multi-step such as "Find 14 + 5 − 7 = ?"', count: 3 },
      { name: 'Measurement: comparing length, time to the hour', count: 2 }, { name: '2D shapes and their sides', count: 2 },
      { name: 'Number patterns (counting on by 2, 5, 10)', count: 2 }, { name: 'Short word problems', count: 2 },
    ],
    visualPolicy: 'Use a visual in about 8–10 of the 20 questions: "icons" for word problems, "sequence" for number patterns, "shapes_grid" for shapes.',
    examples: [
      { category: 'Place value', prompt: 'Which number is 3 tens and 4 ones?', options: ['34', '43', '304', '7'], correctAnswer: 0, explanation: '3 tens is 30 and 4 ones is 4. 30 + 4 = 34.' },
      { category: 'Addition and subtraction', prompt: 'Find 14 + 5 − 7 = ?', options: ['12', '16', '26', '2'], correctAnswer: 0, explanation: 'First add 14 + 5 = 19. Then subtract 7: 19 − 7 = 12.' },
      { category: 'Subtraction', prompt: 'Sam has 9 fish. He gives 4 fish to Lee. How many fish does Sam have left?', options: ['4', '5', '6', '13'], correctAnswer: 1, explanation: 'Take 4 away from 9: 9 − 4 = 5.', visual: { type: 'icons', items: [{ icon: 'fish', count: 9, color: 'text-sky-500' }] } },
    ],
  },
  {
    id: 'level-2',
    label: 'FISO Level 2',
    guidance: 'Use primary math: numbers to 1,000, addition and subtraction with regrouping, introductory multiplication and division, simple fractions, time, and basic geometry.',
    numberRange: 'Numbers to 1,000; regrouping in add/subtract; multiplication and division facts for 2, 3, 4, 5 and 10.',
    topics: [
      { name: 'Place value to 1,000', count: 2 }, { name: 'Addition and subtraction with regrouping, including multi-step such as "Find 241 + 123 − 112 = ?"', count: 4 },
      { name: 'Multiplication as equal groups (facts for 2, 3, 4, 5, 10)', count: 3 }, { name: 'Division as equal sharing', count: 2 },
      { name: 'Simple fractions (halves, thirds, quarters)', count: 2 }, { name: 'Time (to 5 minutes) and money', count: 2 },
      { name: 'Geometry: sides, corners and shapes', count: 2 }, { name: 'Word problems', count: 3 },
    ],
    visualPolicy: 'Use a visual in about 4–6 of the 20 questions: "icons" for equal groups or sharing, "comparison_bars" for simple comparisons, "shapes_grid" for geometry.',
    examples: [
      { category: 'Addition and subtraction', prompt: 'Find 241 + 123 − 112 = ?', options: ['252', '264', '364', '240'], correctAnswer: 0, explanation: 'Add 241 + 123 = 364. Then subtract 112: 364 − 112 = 252.' },
      { category: 'Multiplication', prompt: 'There are 4 bags with 5 apples in each bag. How many apples are there altogether?', options: ['9', '20', '25', '45'], correctAnswer: 1, explanation: '4 groups of 5 is 4 × 5 = 20.', visual: { type: 'icons', items: [{ icon: 'apple', count: 5, color: 'text-rose-500' }, { icon: 'apple', count: 5, color: 'text-emerald-500' }, { icon: 'apple', count: 5, color: 'text-amber-500' }, { icon: 'apple', count: 5, color: 'text-orange-500' }] } },
      { category: 'Division', prompt: '12 cookies are shared equally between 3 children. How many cookies does each child get?', options: ['3', '4', '5', '9'], correctAnswer: 1, explanation: 'Share 12 into 3 equal groups: 12 ÷ 3 = 4.' },
    ],
  },
  {
    id: 'level-3',
    label: 'FISO Level 3',
    guidance: 'Use upper-primary math: multi-digit operations, multiplication and division facts, equivalent fractions, decimals, perimeter, area, and multi-step word problems.',
    numberRange: 'Numbers to 10,000; multiplication facts to 12 × 12; multi-digit by one-digit multiplication and division; decimals to hundredths.',
    topics: [
      { name: 'Multi-digit addition and subtraction, including multi-step such as "Find 482 + 275 − 190 = ?"', count: 3 }, { name: 'Multiplication and division facts and multi-digit by 1-digit', count: 4 },
      { name: 'Equivalent fractions and comparing fractions', count: 2 }, { name: 'Decimals (tenths and hundredths)', count: 2 },
      { name: 'Perimeter and area of rectangles', count: 3 }, { name: 'Multi-step word problems', count: 4 },
      { name: 'Data reading and number patterns', count: 2 },
    ],
    visualPolicy: 'Use a visual in only about 2–4 of the 20 questions: "comparison_bars" for data reading; "icons" for equal groups. Otherwise use text only.',
    examples: [
      { category: 'Addition and subtraction', prompt: 'Find 482 + 275 − 190 = ?', options: ['567', '667', '947', '557'], correctAnswer: 0, explanation: 'Add 482 + 275 = 757. Then subtract 190: 757 − 190 = 567.' },
      { category: 'Perimeter', prompt: 'A rectangle is 8 cm long and 5 cm wide. What is its perimeter?', options: ['13 cm', '26 cm', '40 cm', '30 cm'], correctAnswer: 1, explanation: 'Perimeter = 2 × (8 + 5) = 2 × 13 = 26 cm.' },
      { category: 'Data', prompt: 'Look at the bars. How many more books did Ali read than Ben?', options: ['3', '4', '5', '14'], correctAnswer: 1, explanation: 'Ali read 9 books and Ben read 5. 9 − 5 = 4.', visual: { type: 'comparison_bars', items: [{ label: 'Ali', value: 9, color: 'bg-indigo-500' }, { label: 'Ben', value: 5, color: 'bg-sky-400' }] } },
    ],
  },
  {
    id: 'level-4',
    label: 'FISO Level 4',
    guidance: 'Use challenging upper-primary math: fractions and decimals, factors and multiples, ratios, measurement conversions, angles, data interpretation, and multi-step reasoning.',
    numberRange: 'Whole numbers to 100,000; fractions with unlike denominators; decimals to thousandths; ratios with whole numbers.',
    topics: [
      { name: 'Fraction operations (unlike denominators, mixed numbers)', count: 3 }, { name: 'Decimal operations and comparison', count: 2 },
      { name: 'Factors, multiples, LCM and HCF', count: 3 }, { name: 'Ratios', count: 2 },
      { name: 'Measurement conversions (length, mass, capacity, time)', count: 2 }, { name: 'Angles and angle facts', count: 2 },
      { name: 'Data interpretation (tables and bar charts)', count: 2 }, { name: 'Multi-step reasoning problems', count: 4 },
    ],
    visualPolicy: 'Use a visual in only about 1–3 of the 20 questions, as "comparison_bars" for data interpretation. Otherwise use text only.',
    examples: [
      { category: 'Fractions', prompt: 'Find 3/4 + 1/8 = ?', options: ['7/8', '4/12', '1', '4/8'], correctAnswer: 0, explanation: 'Write 3/4 as 6/8. Then 6/8 + 1/8 = 7/8.' },
      { category: 'Multiples', prompt: 'What is the lowest common multiple of 6 and 8?', options: ['12', '24', '48', '14'], correctAnswer: 1, explanation: 'Multiples of 6: 6, 12, 18, 24. Multiples of 8: 8, 16, 24. The first shared multiple is 24.' },
      { category: 'Ratios', prompt: 'The ratio of red to blue marbles is 3 : 5. There are 12 red marbles. How many blue marbles are there?', options: ['15', '20', '8', '36'], correctAnswer: 1, explanation: '12 red marbles is 4 groups of 3. So blue is 4 groups of 5: 4 × 5 = 20.' },
    ],
  },
  {
    id: 'level-5',
    label: 'FISO Level 5',
    guidance: 'Use advanced primary math: percentages, ratios and proportion, integers, expressions, coordinate geometry, probability, and non-routine multi-step problems.',
    numberRange: 'Integers including negatives; percentages of whole numbers; fractions and decimals; coordinates in the first quadrant (or all four for integer questions).',
    topics: [
      { name: 'Percentages (of a quantity, increase and decrease)', count: 3 }, { name: 'Ratio and proportion', count: 3 },
      { name: 'Integers (negative numbers, multi-step such as "Find −8 + 15 − 9 = ?")', count: 2 }, { name: 'Expressions and simple equations', count: 3 },
      { name: 'Coordinate geometry (describe points in words, no picture)', count: 2 }, { name: 'Probability of simple events', count: 2 },
      { name: 'Non-routine multi-step problems', count: 5 },
    ],
    visualPolicy: 'Use a visual in at most 0–2 of the 20 questions, only "comparison_bars" for data. Everything else must be text only.',
    examples: [
      { category: 'Percentages', prompt: 'What is 25% of 240?', options: ['60', '25', '120', '6'], correctAnswer: 0, explanation: '25% is one quarter. 240 ÷ 4 = 60.' },
      { category: 'Integers', prompt: 'Find −8 + 15 − 9 = ?', options: ['−2', '2', '−32', '−16'], correctAnswer: 0, explanation: 'First −8 + 15 = 7. Then 7 − 9 = −2.' },
      { category: 'Probability', prompt: 'A fair six-sided die is rolled. What is the probability of rolling a number greater than 4?', options: ['1/3', '1/6', '1/2', '2/3'], correctAnswer: 0, explanation: 'The numbers greater than 4 are 5 and 6. That is 2 out of 6 outcomes, which is 1/3.' },
    ],
  },
  {
    id: 'level-6',
    label: 'FISO Level 6',
    guidance: 'Use the most advanced level in this practice app: algebraic reasoning, proportional reasoning, percentages, geometry, statistics, probability, and olympiad-style multi-step problems.',
    numberRange: 'Rational numbers; linear equations in one unknown; rates and speed; mean, median and mode; angle and area reasoning.',
    topics: [
      { name: 'Algebraic reasoning (linear equations, sequences, expressions)', count: 4 }, { name: 'Proportional reasoning, rates and speed', count: 3 },
      { name: 'Percentages (successive change, reverse percentages)', count: 3 }, { name: 'Geometry (angles, area, composite shapes; describe in words)', count: 3 },
      { name: 'Statistics (mean, median, mode)', count: 2 }, { name: 'Probability (combined events)', count: 2 },
      { name: 'Olympiad-style multi-step problems', count: 3 },
    ],
    visualPolicy: 'Use a visual in at most 0–2 of the 20 questions, only "comparison_bars" for data. Everything else must be text only.',
    examples: [
      { category: 'Algebra', prompt: 'Solve 3x + 7 = 28. What is x?', options: ['5', '7', '21', '9'], correctAnswer: 1, explanation: 'Subtract 7 from both sides: 3x = 21. Divide by 3: x = 7.' },
      { category: 'Rates', prompt: 'A car travels 180 km in 2.5 hours at a constant speed. How far does it travel in 4 hours?', options: ['288 km', '270 km', '320 km', '450 km'], correctAnswer: 0, explanation: 'Speed = 180 ÷ 2.5 = 72 km/h. In 4 hours: 72 × 4 = 288 km.' },
      { category: 'Statistics', prompt: 'The mean of five numbers is 13. Four of the numbers are 8, 10, 14 and 16. What is the fifth number?', options: ['17', '13', '15', '12'], correctAnswer: 0, explanation: 'The total is 5 × 13 = 65. The four known numbers add to 48. 65 − 48 = 17.' },
    ],
  },
]
