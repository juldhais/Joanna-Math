import { POLYGONS, SHAPES, THINGS, UNIQUE_BY_SIDES, ask, colors, iconGroup, iconsVisual, nums, sequenceVisual, twoNames } from './helpers'
import type { Topic } from './helpers'

const word = (n: number) => `${n} o'clock`

export const level1: Topic[] = [
  {
    name: 'Place value to 100', count: 3, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) {
        const t = r.int(1, 9)
        const o = r.int(0, 9)
        const n = t * 10 + o
        return ask(r, `Which number is ${t} tens and ${o} ones?`, String(n), nums(n, [o * 10 + t, t + o, t * 100 + o], { min: 0 }), `${t} tens is ${t * 10}. Add ${o} ones: ${t * 10} + ${o} = ${n}.`)
      }
      if (kind === 1) {
        const t = r.int(1, 9)
        let o = r.int(0, 9)
        if (o === t) o = (o + 1) % 10
        const n = t * 10 + o
        const tens = r.int(0, 1) === 0
        const digit = tens ? t : o
        const answer = tens ? t * 10 : o
        return ask(r, `What is the value of the digit ${digit} in ${n}?`, String(answer), nums(answer, [tens ? t : t * 10, tens ? t * 100 : o * 10], { min: 0 }), `In ${n}, the ${digit} is in the ${tens ? 'tens' : 'ones'} place, so its value is ${answer}.`)
      }
      if (kind === 2) {
        const t = r.int(1, 9)
        const o = r.int(0, 9)
        const n = t * 10 + o
        return ask(r, `How many tens are in ${n}?`, String(t), nums(t, [o, n], { min: 0 }), `${n} is ${t} tens and ${o} ones.`)
      }
      const n = r.int(10, 85)
      const k = r.pick([1, 10, 10, 5])
      const more = r.int(0, 1) === 0
      const answer = more ? n + k : n - k
      return ask(r, `What is ${k} ${more ? 'more' : 'less'} than ${n}?`, String(answer), nums(answer, [more ? n - k : n + k, n + (more ? 1 : -1)], { min: 0 }), `${n} ${more ? '+' : '−'} ${k} = ${answer}.`)
    },
  },
  {
    name: 'Addition within 20', count: 3, make: (r) => {
      const t = r.pick(THINGS)
      const [name] = twoNames(r)
      const [c1, c2] = colors(r, 2)
      const total = r.int(11, 20)
      const a = r.int(Math.max(2, total - 9), 9)
      const b = total - a
      const wrong = nums(total, [a + b + 1, total - 1, total + 10, a], { min: 0 })
      const why = `${a} + ${b} = ${total}.`
      const kind = r.int(0, 3)
      if (kind === 0) return ask(r, `Find ${a} + ${b} = ?`, String(total), wrong, `Make 10 first, then add the rest. ${why}`)
      if (kind === 1) return ask(r, `${name} has ${a} ${t.many}. ${name} gets ${b} more. How many ${t.many} does ${name} have now?`, String(total), wrong, `Add: ${why}`, a <= 12 && b <= 12 ? iconsVisual(iconGroup(t, a, c1), iconGroup(t, b, c2)) : undefined)
      if (kind === 2) { const h = r.int(6, 10); return ask(r, `What is double ${h}?`, String(h * 2), nums(h * 2, [h, h + 2, h * 3], { min: 0 }), `Double means add the number to itself: ${h} + ${h} = ${h * 2}.`) }
      return ask(r, `What number goes in the box? ${a} + __ = ${total}`, String(b), nums(b, [a, total, b + 1], { min: 0 }), `${total} − ${a} = ${b}, so ${a} + ${b} = ${total}.`)
    },
  },
  {
    name: 'Subtraction within 20', count: 3, make: (r) => {
      const t = r.pick(THINGS)
      const [name] = twoNames(r)
      const [c1] = colors(r, 1)
      const a = r.int(11, 20)
      const b = r.int(2, 9)
      const left = a - b
      const wrong = nums(left, [a + b, b, left + 1, left - 1], { min: 0 })
      const why = `${a} − ${b} = ${left}.`
      const kind = r.int(0, 2)
      if (kind === 0) return ask(r, `Find ${a} − ${b} = ?`, String(left), wrong, `Count back ${b} from ${a}. ${why}`)
      if (kind === 1) return ask(r, `${name} has ${a} ${t.many}. ${name} gives away ${b}. How many ${t.many} does ${name} have left?`, String(left), wrong, `Take away: ${why}`, a <= 12 ? iconsVisual(iconGroup(t, a, c1)) : undefined)
      return ask(r, `What number goes in the box? ${a} − __ = ${left}`, String(b), nums(b, [a, left], { min: 0 }), `${a} − ${b} = ${left}, so the missing number is ${b}.`)
    },
  },
  {
    name: 'Two-digit add and subtract', count: 3, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) {
        const ao = r.int(0, 8), bo = r.int(0, 9 - ao)
        const a = r.int(1, 7) * 10 + ao, b = r.int(1, 2) * 10 + bo
        return ask(r, `Find ${a} + ${b} = ?`, String(a + b), nums(a + b, [a + b + 10, a + b - 10, a - b], { min: 0 }), `Add the tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10}. Add the ones: ${ao} + ${bo}. Total ${a + b}.`)
      }
      if (kind === 1) {
        const bo = r.int(0, 8), ao = r.int(bo, 9)
        const a = r.int(3, 9) * 10 + ao, b = r.int(1, 2) * 10 + bo
        return ask(r, `Find ${a} − ${b} = ?`, String(a - b), nums(a - b, [a - b + 10, a - b - 10, a + b], { min: 0 }), `Take away the tens, then the ones: ${a} − ${b} = ${a - b}.`)
      }
      if (kind === 2) {
        const ao = r.int(0, 4), y = r.int(1, 9 - ao), z = r.int(0, ao + y)
        const a = r.int(1, 8) * 10 + ao
        const sum = a + y
        const result = sum - z
        return ask(r, `Find ${a} + ${y} − ${z} = ?`, String(result), nums(result, [sum + z, sum, a - y - z], { min: 0 }), `First add: ${a} + ${y} = ${sum}. Then subtract: ${sum} − ${z} = ${result}.`)
      }
      const bo = r.int(1, 8), ao = r.int(bo, 9)
      const a = r.int(3, 9) * 10 + ao, b = r.int(1, 2) * 10 + bo, c = r.int(1, 9 - ao % 10 >= 1 ? 9 - ao : 1)
      const mid = a - b
      if (mid % 10 + c > 9) return ask(r, `Find ${a} − ${b} = ?`, String(mid), nums(mid, [mid + 10, mid - 10], { min: 0 }), `${a} − ${b} = ${mid}.`)
      return ask(r, `Find ${a} − ${b} + ${c} = ?`, String(mid + c), nums(mid + c, [a - b - c, a + b + c, mid], { min: 0 }), `First subtract: ${a} − ${b} = ${mid}. Then add ${c}: ${mid + c}.`)
    },
  },
  {
    name: 'Length and time', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) {
        const labels = r.shuffle(['Red', 'Blue', 'Green', 'Pink', 'Gold', 'Grey'])
        const used = labels.slice(0, 4)
        const values = r.shuffle([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 4)
        const longest = r.int(0, 1) === 0
        const best = values.indexOf(longest ? Math.max(...values) : Math.min(...values))
        const cols = ['bg-rose-500', 'bg-sky-400', 'bg-emerald-500', 'bg-violet-500']
        return ask(r, `Look at the bars. Which pencil is the ${longest ? 'longest' : 'shortest'}?`, used[best], used.filter((_, i) => i !== best), `Compare the bars: ${used[best]} is ${values[best]} cm, the ${longest ? 'greatest' : 'smallest'} length.`, { type: 'comparison_bars', items: used.map((label, i) => ({ label, value: values[i], color: cols[i] })) })
      }
      if (kind === 1) {
        const h = r.int(1, 12)
        return ask(r, `The short hand points to ${h} and the long hand points to 12. What time is it?`, word(h), [word(h === 12 ? 1 : h + 1), word(h === 1 ? 12 : h - 1), `${h}:30`, `12 o'clock`].filter((o) => o !== word(h)), `The long hand on 12 means "o'clock". The short hand shows the hour: ${word(h)}.`)
      }
      if (kind === 2) {
        const h = r.int(1, 12)
        const k = r.int(1, 4)
        const answer = ((h + k - 1) % 12) + 1
        return ask(r, `What time is ${k} hour${k === 1 ? '' : 's'} after ${word(h)}?`, word(answer), nums(answer, [h, h - k > 0 ? h - k : h - k + 12, answer + 1], { min: 1, fmt: (n) => word(n > 12 ? n - 12 : n) }), `Count on ${k} hour${k === 1 ? '' : 's'} from ${h}: ${answer} o'clock.`)
      }
      const a = r.int(5, 20), b = r.int(2, 9)
      return ask(r, `A ribbon is ${a} cm long. A string is ${b} cm longer than the ribbon. How long is the string?`, `${a + b} cm`, nums(a + b, [a - b, a, a + b + 1], { min: 0, fmt: (n) => `${n} cm` }), `Longer means add: ${a} + ${b} = ${a + b} cm.`)
    },
  },
  {
    name: '2D shapes and their sides', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) {
        const s = r.pick(UNIQUE_BY_SIDES)
        return ask(r, `I have ${s.sides} sides and ${s.sides} corners. What shape am I?`, s.name, r.shuffle(SHAPES.filter((o) => o.sides !== s.sides).map((o) => o.name)), `A ${s.name} has ${s.sides} sides and ${s.sides} corners.`)
      }
      if (kind === 1) {
        const s = r.pick(POLYGONS)
        const n = r.int(2, 4)
        return ask(r, `How many sides do ${n} ${s.plural} have in all?`, String(n * s.sides), nums(n * s.sides, [s.sides + n, s.sides], { min: 1 }), `Each ${s.name} has ${s.sides} sides. ${n} groups of ${s.sides} is ${n * s.sides}.`)
      }
      if (kind === 2) {
        const shapes = r.shuffle(SHAPES.filter((s) => s.name !== 'rectangle')).slice(0, 4)
        const most = r.int(0, 1) === 0
        const sorted = [...shapes].sort((x, y) => (most ? y.sides - x.sides : x.sides - y.sides))
        return ask(r, `Which shape has the ${most ? 'most' : 'fewest'} sides?`, sorted[0].name, shapes.filter((s) => s !== sorted[0]).map((s) => s.name), `Count the sides: ${shapes.map((s) => `${s.name} ${s.sides}`).join(', ')}. The ${sorted[0].name} has the ${most ? 'most' : 'fewest'}.`, { type: 'shapes_grid', items: shapes.map((s) => ({ icon: s.icon, label: s.name })) })
      }
      const s = r.pick(POLYGONS)
      return ask(r, `How many corners does a ${s.name} have?`, String(s.sides), nums(s.sides, [s.sides + 1, s.sides - 1], { min: 3 }), `A ${s.name} has the same number of corners as sides: ${s.sides}.`)
    },
  },
  {
    name: 'Number patterns', count: 2, make: (r) => {
      const step = r.pick([2, 5, 10, 3])
      const up = r.int(0, 3) > 0
      const start = up ? r.int(0, 3) * step : r.int(6, 9) * step
      const seq = Array.from({ length: 4 }, (_, i) => (up ? start + i * step : start - i * step))
      const next = up ? start + 4 * step : start - 4 * step
      const dir = up ? 'up' : 'down'
      if (r.int(0, 3) === 0 && up) {
        const full = Array.from({ length: 5 }, (_, i) => start + i * step)
        return ask(r, `What number is missing? ${full[0]}, ${full[1]}, __, ${full[3]}, ${full[4]}`, String(full[2]), nums(full[2], [full[2] + 1, full[1], full[3]], { min: 0 }), `The numbers go up by ${step}. ${full[1]} + ${step} = ${full[2]}.`, sequenceVisual([full[0], full[1], '?', full[3], full[4]]))
      }
      return ask(r, `What number comes next? ${seq.join(', ')}, __`, String(next), nums(next, [up ? next - 1 : next + 1, up ? next + step : next - step], { min: 0 }), `The numbers go ${dir} by ${step} each time. ${seq[3]} ${up ? '+' : '−'} ${step} = ${next}.`, r.int(0, 1) === 0 ? sequenceVisual([...seq, '?']) : undefined)
    },
  },
  {
    name: 'Short word problems', count: 2, make: (r) => {
      const [n1, n2] = twoNames(r)
      const t = r.pick(THINGS)
      const kind = r.int(0, 3)
      const a = r.int(10, 60)
      const b = r.int(5, Math.min(35, 99 - a))
      if (kind === 0) return ask(r, `${n1} has ${a} ${t.many}. ${n1} gets ${b} more. How many ${t.many} does ${n1} have now?`, String(a + b), nums(a + b, [a - b, a + b + 10], { min: 0 }), `Add: ${a} + ${b} = ${a + b}.`)
      if (kind === 1) return ask(r, `${n1} had ${a + b} ${t.many}. ${n1} gave ${b} to ${n2}. How many ${t.many} does ${n1} have left?`, String(a), nums(a, [a + b + b, b, a + 10], { min: 0 }), `Take away: ${a + b} − ${b} = ${a}.`)
      if (kind === 2) return ask(r, `There are ${a} boys and ${b} girls in a class. How many children are in the class?`, String(a + b), nums(a + b, [a - b, a + b + 10], { min: 0 }), `Add the boys and girls: ${a} + ${b} = ${a + b}.`)
      const big = Math.max(a, b + 1), small = Math.min(a, b)
      const x = big === small ? big + 1 : big
      return ask(r, `${n1} has ${x} ${t.many}. ${n2} has ${small} ${t.many}. How many more ${t.many} does ${n1} have?`, String(x - small), nums(x - small, [x + small, small], { min: 0 }), `Find the difference: ${x} − ${small} = ${x - small}.`)
    },
  },
]
