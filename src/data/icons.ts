import {
  Apple, Banana, Bell, Bike, Bird, Book, Bug, Bus, Cake, Candy, Car, Carrot, Cat, Cherry, Circle, Cloud, Cookie, Diamond, Dog, Egg,
  Fish, Flag, Flower, Gift, Heart, Hexagon, House, IceCreamCone, Leaf, Moon, Octagon, Pencil, Pentagon, Rabbit, RectangleHorizontal,
  Rocket, Square, Star, Sun, TreePine, Triangle, Turtle, Umbrella,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** Single source of truth for icons: the renderer, the validator, and the AI prompt all derive from this map. */
export const ICON_MAP = {
  apple: Apple, banana: Banana, cherry: Cherry, carrot: Carrot, cookie: Cookie, cake: Cake, candy: Candy, egg: Egg, 'ice-cream': IceCreamCone,
  fish: Fish, bird: Bird, cat: Cat, dog: Dog, rabbit: Rabbit, turtle: Turtle, bug: Bug,
  car: Car, bus: Bus, bike: Bike, rocket: Rocket,
  book: Book, pencil: Pencil, gift: Gift, bell: Bell, flag: Flag, house: House, umbrella: Umbrella,
  flower: Flower, leaf: Leaf, tree: TreePine, sun: Sun, moon: Moon, cloud: Cloud, star: Star, heart: Heart,
  circle: Circle, square: Square, rectangle: RectangleHorizontal, triangle: Triangle, diamond: Diamond, pentagon: Pentagon, hexagon: Hexagon, octagon: Octagon,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICON_MAP
export const ICON_NAMES = Object.keys(ICON_MAP) as IconName[]

/** Largest icon group the visual renders. The prompt and validator use the same limit so nothing is silently truncated. */
export const MAX_ICON_COUNT = 12

// Colour classes are spelled out literally so Tailwind generates them.
export const ICON_COLORS = ['text-rose-500', 'text-sky-500', 'text-amber-500', 'text-violet-500', 'text-indigo-500', 'text-emerald-500', 'text-orange-500', 'text-pink-500', 'text-teal-500'] as const
export const BAR_COLORS = ['bg-indigo-500', 'bg-sky-400', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'] as const

const ICON_ALIASES: Record<string, IconName> = {
  duck: 'bird', chicken: 'bird', parrot: 'bird', kitten: 'cat', puppy: 'dog', bunny: 'rabbit', bicycle: 'bike',
  'tree-pine': 'tree', pine: 'tree', 'rectangle-horizontal': 'rectangle', rect: 'rectangle',
  'ice-cream-cone': 'ice-cream', icecream: 'ice-cream', home: 'house',
}

function lookup(name: string): IconName | null {
  if (Object.prototype.hasOwnProperty.call(ICON_MAP, name)) return name as IconName
  return Object.prototype.hasOwnProperty.call(ICON_ALIASES, name) ? ICON_ALIASES[name] : null
}

/** Maps a model-supplied icon name (any case, plural, or common alias) to a supported icon, or null if none matches. */
export function resolveIconName(value: unknown): IconName | null {
  if (typeof value !== 'string') return null
  const name = value.trim().toLowerCase().replace(/^lucide[-:]/, '').replace(/[\s_]+/g, '-')
  if (!name) return null
  const candidates = [name, name.replace(/ies$/, 'y'), name.replace(/es$/, ''), name.replace(/s$/, '')]
  for (const candidate of candidates) {
    const found = lookup(candidate)
    if (found) return found
  }
  return null
}
