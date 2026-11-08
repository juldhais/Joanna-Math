import { EMOJI, POLYGONS, SHAPES, THINGS, UNIQUE_BY_SIDES, ask, colors, iconGroup, iconsVisual, nums, sequenceVisual, twoNames } from './helpers'
import type { Topic } from './helpers'

export const kindergarten: Topic[] = [
  {
    name: 'Counting objects to 20', count: 5, make: (r) => {
      const t = r.pick(THINGS)
      const [c1, c2] = colors(r, 2)
      const kind = r.int(0, 2)
      if (kind === 0) {
        const n = r.int(1, 12)
        return ask(r, `How many ${t.many} are there?`, String(n), nums(n, [n + 1, n - 1], { min: 1 }), `Count each one once. There are ${n}.`, iconsVisual(iconGroup(t, n, c1)))
      }
      if (kind === 1) {
        const [name] = twoNames(r)
        const n = r.int(1, 12)
        return ask(r, `${name} has some ${t.many}. How many ${t.many} does ${name} have?`, String(n), nums(n, [n + 1, n - 1], { min: 1 }), `Count each one once. ${name} has ${n}.`, iconsVisual(iconGroup(t, n, c1)))
      }
      const a = r.int(2, 10)
      const b = r.int(2, 20 - a > 10 ? 10 : 20 - a)
      return ask(r, `How many ${t.many} are there altogether?`, String(a + b), nums(a + b, [a, b, a + b + 1], { min: 1 }), `Count the first group: ${a}. Then count on ${b} more. ${a} + ${b} = ${a + b}.`, iconsVisual(iconGroup(t, a, c1), iconGroup(t, b, c2)))
    },
  },
  {
    name: 'Comparing numbers (more, fewer, same)', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) {
        const [x, y] = r.shuffle(THINGS)
        const a = r.int(1, 12)
        let b = r.int(1, 12)
        if (b === a) b = a === 12 ? 11 : a + 1
        const [c1, c2] = colors(r, 2)
        const bigger = a > b ? x : y
        return ask(r, `Which are there more of: ${x.many} or ${y.many}?`, `The ${bigger.many}`, [`The ${(a > b ? y : x).many}`, 'They are the same', 'It cannot be told'], `Count both groups: ${a} ${x.many} and ${b} ${y.many}. ${Math.max(a, b)} is more than ${Math.min(a, b)}, so there are more ${bigger.many}.`, iconsVisual(iconGroup(x, a, c1), iconGroup(y, b, c2)))
      }
      if (kind === 1) {
        const a = r.int(1, 20)
        let b = r.int(1, 20)
        if (a === b) b = a === 20 ? 19 : a + 1
        const bigger = r.int(0, 1) === 0
        const answer = bigger ? Math.max(a, b) : Math.min(a, b)
        return ask(r, `Which number is ${bigger ? 'bigger' : 'smaller'}: ${a} or ${b}?`, String(answer), nums(answer, [bigger ? Math.min(a, b) : Math.max(a, b), answer + 1, answer - 1], { min: 0 }), `Compare ${a} and ${b}. ${answer} is ${bigger ? 'bigger' : 'smaller'}.`)
      }
      if (kind === 2) {
        const nums4 = r.shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 4)
        const smallest = r.int(0, 1) === 0
        const answer = smallest ? Math.min(...nums4) : Math.max(...nums4)
        return ask(r, `Which number is the ${smallest ? 'smallest' : 'biggest'}? ${nums4.join(', ')}`, String(answer), nums4.filter((n) => n !== answer).map(String), `Compare all four numbers. ${answer} is the ${smallest ? 'smallest' : 'biggest'}.`)
      }
      const [n1, n2] = twoNames(r)
      const t = r.pick(THINGS)
      const a = r.int(1, 12)
      let b = r.int(1, 12)
      if (a === b) b = a === 12 ? 11 : a + 1
      const fewer = r.int(0, 1) === 0
      const answer = (fewer ? a < b : a > b) ? n1 : n2
      return ask(r, `${n1} has ${a} ${t.many}. ${n2} has ${b} ${t.many}. Who has ${fewer ? 'fewer' : 'more'} ${t.many}?`, answer, [answer === n1 ? n2 : n1, 'They have the same number', 'It cannot be told'], `${a} and ${b}: ${fewer ? Math.min(a, b) : Math.max(a, b)} is ${fewer ? 'fewer' : 'more'}, so ${answer} has ${fewer ? 'fewer' : 'more'}.`)
    },
  },
  {
    name: 'Addition within 10', count: 3, make: (r) => {
      const t = r.pick(THINGS)
      const [name, other] = twoNames(r)
      const [c1, c2] = colors(r, 2)
      const total = r.int(3, 10)
      const a = r.int(1, total - 1)
      const b = total - a
      const kind = r.int(0, 3)
      const wrong = nums(total, [a, b, total + 1, total - 1], { min: 0 })
      const why = `${a} + ${b} = ${total}.`
      if (kind === 0) return ask(r, `${name} has ${a} ${t.many}. ${other} gives ${name} ${b} more. How many ${t.many} does ${name} have now?`, String(total), wrong, `Start with ${a} and add ${b} more. ${why}`, iconsVisual(iconGroup(t, a, c1), iconGroup(t, b, c2)))
      if (kind === 1) return ask(r, `There are ${a} ${t.many} in one box and ${b} in another box. How many ${t.many} are there in all?`, String(total), wrong, `Add the two boxes. ${why}`, iconsVisual(iconGroup(t, a, c1), iconGroup(t, b, c2)))
      if (kind === 2) return ask(r, `Find ${a} + ${b} = ?`, String(total), wrong, `Count on ${b} from ${a}. ${why}`)
      return ask(r, `What number goes in the box? ${a} + __ = ${total}`, String(b), nums(b, [a, total], { min: 0 }), `${a} + ${b} = ${total}, so the missing number is ${b}.`)
    },
  },
  {
    name: 'Subtraction within 10', count: 3, make: (r) => {
      const t = r.pick(THINGS)
      const [name] = twoNames(r)
      const [c1] = colors(r, 1)
      const a = r.int(2, 10)
      const b = r.int(1, a - 1)
      const left = a - b
      const wrong = nums(left, [a + b, b, left + 1], { min: 0 })
      const why = `${a} − ${b} = ${left}.`
      const kind = r.int(0, 3)
      if (kind === 0) return ask(r, `${name} has ${a} ${t.many}. ${name} gives ${b} to a friend. How many ${t.many} are left?`, String(left), wrong, `Take away ${b} from ${a}. ${why}`, iconsVisual(iconGroup(t, a, c1)))
      if (kind === 1) return ask(r, `There are ${a} ${t.many} on the table. ${b} are taken away. How many are left?`, String(left), wrong, `Take away ${b} from ${a}. ${why}`, iconsVisual(iconGroup(t, a, c1)))
      if (kind === 2) return ask(r, `Find ${a} − ${b} = ?`, String(left), wrong, `Count back ${b} from ${a}. ${why}`)
      return ask(r, `What number goes in the box? ${a} − __ = ${left}`, String(b), nums(b, [a, left], { min: 0 }), `${a} − ${b} = ${left}, so the missing number is ${b}.`)
    },
  },
  {
    name: 'Basic shapes', count: 3, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) {
        const s = r.pick(SHAPES)
        return ask(r, 'What is the name of Shape A?', s.name, r.shuffle(SHAPES.filter((o) => o !== s).map((o) => o.name)), `Shape A has ${s.sides === 0 ? 'no sides and is perfectly round' : `${s.sides} sides`}. It is a ${s.name}.`, { type: 'shapes_grid', items: [{ icon: s.icon, label: 'Shape A' }] })
      }
      if (kind === 1) {
        const s = r.pick(POLYGONS)
        return ask(r, `How many sides does a ${s.name} have?`, String(s.sides), nums(s.sides, [s.sides + 1, s.sides - 1], { min: 3 }), `A ${s.name} has ${s.sides} sides.`)
      }
      if (kind === 2) {
        const s = r.pick(UNIQUE_BY_SIDES)
        return ask(r, `Which shape has ${s.sides} sides?`, s.name, r.shuffle(SHAPES.filter((o) => o.sides !== s.sides).map((o) => o.name)), `A ${s.name} has ${s.sides} sides.`)
      }
      const target = r.pick(SHAPES.filter((shape) => ['circle', 'square', 'triangle', 'hexagon'].includes(shape.name)))
      const others = SHAPES.filter((shape) => ['circle', 'square', 'triangle', 'hexagon'].includes(shape.name) && shape !== target)
      const hits = r.int(1, 4)
      const total = r.int(Math.max(hits + 1, 5), 8)
      const list = r.shuffle([...Array(hits).fill(target), ...Array.from({ length: total - hits }, () => r.pick(others))])
      return ask(r, `How many ${target.plural} are in the picture?`, String(hits), nums(hits, [hits + 1, hits - 1, total], { min: 0 }), `Look for the ${target.plural} only and count them. There are ${hits}.`, { type: 'shapes_grid', items: list.map((s, i) => ({ icon: s.icon, label: String(i + 1) })) })
    },
  },
  {
    name: 'Repeating patterns', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      const [a, b, c, d] = r.shuffle(EMOJI)
      let seq: string[]
      let answer: string
      let why: string
      if (kind === 0) { const len = r.pick([4, 6]); seq = Array.from({ length: len }, (_, i) => (i % 2 === 0 ? a : b)); answer = a; why = `The pattern repeats ${a} ${b}. Next comes ${a}.` }
      else if (kind === 1) { const len = r.pick([4, 7]); const unit = [a, a, b]; seq = Array.from({ length: len }, (_, i) => unit[i % 3]); answer = unit[len % 3]; why = `The pattern repeats ${a} ${a} ${b}. Next comes ${answer}.` }
      else if (kind === 2) { const len = r.pick([5, 6, 7]); const unit = [a, b, c]; seq = Array.from({ length: len }, (_, i) => unit[i % 3]); answer = unit[len % 3]; why = `The pattern repeats ${a} ${b} ${c}. Next comes ${answer}.` }
      else {
        const start = r.int(1, 8)
        const numbers = [start, start + 1, start + 2, start + 3]
        return ask(r, `What number comes next? ${numbers.join(', ')}, __`, String(start + 4), nums(start + 4, [start + 5, start + 3], { min: 1 }), `The numbers go up by 1 each time. After ${start + 3} comes ${start + 4}.`, sequenceVisual([...numbers, '?']))
      }
      const wrong = [a, b, c, d].filter((e) => e !== answer)
      return ask(r, `What comes next in this pattern? ${seq.join(' ')} __`, answer, wrong, why, sequenceVisual([...seq, '?']))
    },
  },
  {
    name: 'Add and subtract within 10, two steps', count: 2, make: (r) => {
      if (r.int(0, 1) === 0) {
        const total = r.int(4, 10)
        const a = r.int(1, total - 1)
        const b = total - a
        const c = r.int(1, total)
        const result = total - c
        return ask(r, `Find ${a} + ${b} − ${c} = ?`, String(result), nums(result, [total + c, total, a - c + b], { min: 0 }), `First add: ${a} + ${b} = ${total}. Then take away ${c}: ${total} − ${c} = ${result}.`)
      }
      const a = r.int(3, 9)
      const b = r.int(1, a - 1)
      const c = r.int(1, 10 - (a - b))
      const result = a - b + c
      return ask(r, `Find ${a} − ${b} + ${c} = ?`, String(result), nums(result, [a - b - c, a + b + c, a - b], { min: 0 }), `First take away: ${a} − ${b} = ${a - b}. Then add ${c}: ${a - b} + ${c} = ${result}.`)
    },
  },
]
