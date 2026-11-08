import { ICON_COLORS } from '../icons'
import type { IconName } from '../icons'
import type { Question, VisualItem, VisualMetadata } from '../../types/quiz'

export interface Rng {
  float(): number
  int(min: number, max: number): number
  pick<T>(items: readonly T[]): T
  shuffle<T>(items: readonly T[]): T[]
}

/** Small seeded PRNG (mulberry32) so the built-in bank is identical on every load. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0
  const float = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, max: number) => min + Math.floor(float() * (max - min + 1))
  const pick = <T,>(items: readonly T[]): T => items[int(0, items.length - 1)]
  const shuffle = <T,>(items: readonly T[]): T[] => {
    const copy = [...items]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = int(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }
  return { float, int, pick, shuffle }
}

export type Draft = Omit<Question, 'id' | 'category'>
export interface Topic { name: string; count: number; make: (r: Rng) => Draft }

/**
 * Builds a question. `answer` is the correct option text; `wrong` lists plausible wrong options, most
 * tempting first. Wrong options equal to the answer are dropped, and the first three that remain are used.
 */
export function ask(r: Rng, prompt: string, answer: string, wrong: readonly string[], explanation: string, visual?: VisualMetadata): Draft {
  const pool = [...new Set(wrong)].filter((option) => option !== answer).slice(0, 3)
  if (pool.length < 3) throw new Error(`Not enough distractors: ${prompt}`)
  const options = r.shuffle([answer, ...pool])
  return { prompt, options, correctAnswer: options.indexOf(answer), explanation, ...(visual ? { visual } : {}) }
}

/** Wrong numeric options: the given likely mistakes first, then values near the answer. */
export function nums(answer: number, likely: readonly number[] = [], { min = -Infinity, fmt = String }: { min?: number; fmt?: (n: number) => string } = {}): string[] {
  const near = [1, -1, 2, -2, 10, -10, 3, -3, 5, -5, 100, -100].map((d) => answer + d)
  const all = [...likely, ...near].filter((n) => Number.isFinite(n) && n !== answer && n >= min)
  return [...new Set(all.map((n) => fmt(n)))]
}

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b

/** Formats a decimal without float noise or trailing zeros. */
export const dec = (value: number, places = 2) => String(Number(value.toFixed(places)))

export type Fraction = [number, number]
export const reduce = ([n, d]: Fraction): Fraction => { const g = gcd(n, d) || 1; return [n / g, d / g] }
export const sameValue = (a: Fraction, b: Fraction) => a[0] * b[1] === b[0] * a[1]
/** "3/4", "1 1/8" or "2". */
export function mixed(fraction: Fraction): string {
  const [n, d] = reduce(fraction)
  if (d === 1) return String(n)
  const whole = Math.floor(n / d)
  return whole === 0 ? `${n}/${d}` : `${whole} ${n % d}/${d}`
}
/** Wrong fraction options: candidates with the same value as the answer are removed. */
export function fractions(answer: Fraction, likely: readonly Fraction[] = []): string[] {
  const [n, d] = answer
  const near: Fraction[] = [[n + 1, d], [Math.max(n - 1, 1), d], [n, d + 1], [n, Math.max(d - 1, 2)], [n + d, d], [n + 1, d + 1], [n + 2, d]]
  return [...new Set([...likely, ...near].filter((f) => f[1] > 0 && f[0] > 0 && !sameValue(f, answer)).map(mixed))]
}

export const NAMES = ['Mia', 'Sam', 'Lee', 'Ana', 'Ben', 'Zoe', 'Tom', 'Ivy', 'Max', 'Eva', 'Leo', 'Amy', 'Kai', 'Noa', 'Raj', 'Lily', 'Omar', 'Nina', 'Finn', 'Ruby', 'Hugo', 'Alice', 'Jack', 'Sara', 'Dan', 'Tess'] as const
export const twoNames = (r: Rng): [string, string] => { const [a, b] = r.shuffle(NAMES); return [a, b] }

export interface Thing { icon: IconName; one: string; many: string }
export const THINGS: readonly Thing[] = [
  { icon: 'apple', one: 'apple', many: 'apples' }, { icon: 'banana', one: 'banana', many: 'bananas' }, { icon: 'cherry', one: 'cherry', many: 'cherries' },
  { icon: 'carrot', one: 'carrot', many: 'carrots' }, { icon: 'cookie', one: 'cookie', many: 'cookies' }, { icon: 'cake', one: 'cake', many: 'cakes' },
  { icon: 'candy', one: 'sweet', many: 'sweets' }, { icon: 'egg', one: 'egg', many: 'eggs' }, { icon: 'fish', one: 'fish', many: 'fish' },
  { icon: 'cat', one: 'cat', many: 'cats' }, { icon: 'dog', one: 'dog', many: 'dogs' }, { icon: 'rabbit', one: 'rabbit', many: 'rabbits' },
  { icon: 'turtle', one: 'turtle', many: 'turtles' }, { icon: 'bug', one: 'bug', many: 'bugs' }, { icon: 'car', one: 'car', many: 'cars' },
  { icon: 'book', one: 'book', many: 'books' }, { icon: 'pencil', one: 'pencil', many: 'pencils' }, { icon: 'gift', one: 'gift', many: 'gifts' },
  { icon: 'flower', one: 'flower', many: 'flowers' }, { icon: 'star', one: 'star', many: 'stars' }, { icon: 'heart', one: 'heart', many: 'hearts' },
  { icon: 'bell', one: 'bell', many: 'bells' }, { icon: 'flag', one: 'flag', many: 'flags' }, { icon: 'house', one: 'house', many: 'houses' },
  { icon: 'umbrella', one: 'umbrella', many: 'umbrellas' }, { icon: 'tree', one: 'tree', many: 'trees' },
]

export const iconGroup = (thing: Thing, count: number, color: string): VisualItem => ({ icon: thing.icon, count, color })
export const iconsVisual = (...items: VisualItem[]): VisualMetadata => ({ type: 'icons', items })
export const colors = (r: Rng, n: number): string[] => r.shuffle(ICON_COLORS).slice(0, n)
export const sequenceVisual = (labels: readonly (string | number)[]): VisualMetadata => ({ type: 'sequence', items: labels.map((label) => ({ label: String(label) })) })

export interface Shape { icon: IconName; name: string; plural: string; sides: number }
export const SHAPES: readonly Shape[] = [
  { icon: 'circle', name: 'circle', plural: 'circles', sides: 0 }, { icon: 'square', name: 'square', plural: 'squares', sides: 4 },
  { icon: 'rectangle', name: 'rectangle', plural: 'rectangles', sides: 4 }, { icon: 'triangle', name: 'triangle', plural: 'triangles', sides: 3 },
  { icon: 'pentagon', name: 'pentagon', plural: 'pentagons', sides: 5 }, { icon: 'hexagon', name: 'hexagon', plural: 'hexagons', sides: 6 },
  { icon: 'octagon', name: 'octagon', plural: 'octagons', sides: 8 },
]
export const POLYGONS = SHAPES.filter((shape) => shape.sides >= 3)
/** Shapes whose side count identifies them uniquely. */
export const UNIQUE_BY_SIDES = SHAPES.filter((shape) => shape.sides >= 3 && shape.name !== 'square' && shape.name !== 'rectangle')

export const EMOJI = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⭐', '🍎', '🔺', '🔷'] as const
