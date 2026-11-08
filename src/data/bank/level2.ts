import { THINGS, ask, colors, fractions, iconGroup, iconsVisual, nums, twoNames } from './helpers'
import type { Fraction, Topic } from './helpers'

const columnDifference = (a: number, b: number) => {
  const x = String(a), y = String(b).padStart(x.length, '0')
  return Number([...x].map((d, i) => Math.abs(Number(d) - Number(y[i]))).join(''))
}
const clock = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`

export const level2: Topic[] = [
  {
    name: 'Place value to 1,000', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      const h = r.int(1, 9), t = r.int(0, 9), o = r.int(0, 9)
      const n = h * 100 + t * 10 + o
      if (kind === 0) return ask(r, `Which number is ${h} hundreds, ${t} tens and ${o} ones?`, String(n), nums(n, [h * 100 + o * 10 + t, t * 100 + h * 10 + o, h + t + o], { min: 0 }), `${h * 100} + ${t * 10} + ${o} = ${n}.`)
      if (kind === 1) {
        const digits = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3)
        const [d1, d2, d3] = digits[0] === 0 ? [digits[1], digits[0], digits[2]] : digits
        const num = d1 * 100 + d2 * 10 + d3
        const pos = r.int(0, 2)
        const digit = [d1, d2, d3][pos]
        const value = digit * [100, 10, 1][pos]
        if (value === 0) return ask(r, `What is 100 more than ${num}?`, String(num + 100), nums(num + 100, [num + 10, num + 1, num - 100], { min: 0 }), `Add 1 hundred: ${num} + 100 = ${num + 100}.`)
        return ask(r, `What is the value of the digit ${digit} in ${num}?`, String(value), nums(value, [digit, digit * 10, digit * 100], { min: 0 }), `The ${digit} is in the ${['hundreds', 'tens', 'ones'][pos]} place, so it is worth ${value}.`)
      }
      if (kind === 2) { const base = r.int(100, 880), step = r.pick([10, 100]); return ask(r, `What is ${step} more than ${base}?`, String(base + step), nums(base + step, [base + 1, base + 10, base + 100, base - step], { min: 0 }), `Add ${step}: ${base} + ${step} = ${base + step}.`) }
      if (kind === 3) {
        const four = r.shuffle(Array.from({ length: 12 }, () => r.int(101, 989))).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 4)
        const greatest = r.int(0, 1) === 0
        const answer = greatest ? Math.max(...four) : Math.min(...four)
        return ask(r, `Which is the ${greatest ? 'greatest' : 'smallest'} number? ${four.join(', ')}`, String(answer), four.filter((v) => v !== answer).map(String), `Compare the hundreds first, then the tens. ${answer} is the ${greatest ? 'greatest' : 'smallest'}.`)
      }
      if (t === 0 || o === 0) return ask(r, `How many hundreds are in ${n}?`, String(h), nums(h, [t, o, n], { min: 0 }), `The hundreds digit of ${n} is ${h}.`)
      return ask(r, `Which shows ${n} in expanded form?`, `${h * 100} + ${t * 10} + ${o}`, [`${h * 100} + ${t} + ${o * 10}`, `${h * 10} + ${t * 10} + ${o}`, `${h} + ${t} + ${o}`], `${h} hundreds is ${h * 100}, ${t} tens is ${t * 10}, and ${o} ones is ${o}.`)
    },
  },
  {
    name: 'Add and subtract with regrouping', count: 4, make: (r) => {
      const kind = r.int(0, 4)
      if (kind === 0) {
        const a = r.int(14, 79), b = r.int(15, 89 - (a % 10 > 0 ? 0 : 0))
        const s = a + b
        const carry = (a % 10) + (b % 10) >= 10
        return ask(r, `Find ${a} + ${b} = ?`, String(s), nums(s, [s - 10, s + 10, a + b - (carry ? 0 : 10)], { min: 0 }), `Add the ones and regroup if needed, then add the tens: ${a} + ${b} = ${s}.`)
      }
      if (kind === 1) {
        const a = r.int(120, 699), b = r.int(105, 999 - a)
        return ask(r, `Find ${a} + ${b} = ?`, String(a + b), nums(a + b, [a + b - 10, a + b + 10, a + b - 100], { min: 0 }), `Add ones, tens and hundreds, regrouping when a column reaches 10: ${a} + ${b} = ${a + b}.`)
      }
      if (kind === 2) {
        const b = r.int(12, 59), a = r.int(60, 99)
        return ask(r, `Find ${a} − ${b} = ?`, String(a - b), nums(a - b, [columnDifference(a, b), a - b + 10, a + b], { min: 0 }), `Regroup 1 ten into 10 ones if needed: ${a} − ${b} = ${a - b}.`)
      }
      if (kind === 3) {
        const b = r.int(105, 480), a = r.int(500, 999)
        return ask(r, `Find ${a} − ${b} = ?`, String(a - b), nums(a - b, [columnDifference(a, b), a - b + 10, a - b - 100], { min: 0 }), `Subtract column by column, regrouping when you need to: ${a} − ${b} = ${a - b}.`)
      }
      const a = r.int(120, 480), b = r.int(110, 400), c = r.int(101, Math.min(a + b - 1, 499))
      return ask(r, `Find ${a} + ${b} − ${c} = ?`, String(a + b - c), nums(a + b - c, [a + b + c, a + b, a - b + c], { min: 0 }), `First add: ${a} + ${b} = ${a + b}. Then subtract: ${a + b} − ${c} = ${a + b - c}.`)
    },
  },
  {
    name: 'Multiplication as equal groups', count: 3, make: (r) => {
      const t = r.pick(THINGS)
      const [name] = twoNames(r)
      const g = r.int(2, 5), m = r.pick([2, 3, 4, 5, 10]), total = g * m
      const wrong = nums(total, [g + m, total + m, total - m], { min: 1 })
      const kind = r.int(0, 3)
      if (kind === 0) {
        const cols = colors(r, g)
        return ask(r, `There are ${g} bags with ${m} ${t.many} in each bag. How many ${t.many} are there altogether?`, String(total), wrong, `${g} groups of ${m} is ${g} × ${m} = ${total}.`, iconsVisual(...cols.map((c) => iconGroup(t, m, c))))
      }
      if (kind === 1) { const a = r.pick([2, 3, 4, 5, 10]), b = r.int(2, 10); return ask(r, `Find ${a} × ${b} = ?`, String(a * b), nums(a * b, [a + b, a * b + a, a * b - b], { min: 1 }), `${a} groups of ${b}: ${a} × ${b} = ${a * b}.`) }
      if (kind === 2) return ask(r, `${name} buys ${g} packs of ${t.many}. Each pack has ${m} ${t.many}. How many ${t.many} does ${name} buy?`, String(total), wrong, `${g} × ${m} = ${total}.`)
      const legs = r.pick([2, 4]), animals = r.int(3, 9)
      return ask(r, `A ${legs === 2 ? 'bird' : 'dog'} has ${legs} legs. How many legs do ${animals} ${legs === 2 ? 'birds' : 'dogs'} have in all?`, String(legs * animals), nums(legs * animals, [legs + animals, legs * animals + legs], { min: 1 }), `${animals} × ${legs} = ${legs * animals}.`)
    },
  },
  {
    name: 'Division as equal sharing', count: 2, make: (r) => {
      const t = r.pick(THINGS)
      const [name] = twoNames(r)
      const k = r.pick([2, 3, 4, 5, 10]), q = r.int(2, 10), total = k * q
      const kind = r.int(0, 2)
      if (kind === 0) return ask(r, `${total} ${t.many} are shared equally between ${k} children. How many ${t.many} does each child get?`, String(q), nums(q, [total - k, k, q + 1], { min: 1 }), `${total} ÷ ${k} = ${q}.`, total <= 12 ? iconsVisual(iconGroup(t, total, colors(r, 1)[0])) : undefined)
      if (kind === 1) return ask(r, `Find ${total} ÷ ${k} = ?`, String(q), nums(q, [total - k, k, q + 1], { min: 1 }), `${k} × ${q} = ${total}, so ${total} ÷ ${k} = ${q}.`)
      return ask(r, `${name} puts ${total} ${t.many} into bags of ${k}. How many bags does ${name} fill?`, String(q), nums(q, [total - k, k], { min: 1 }), `${total} ÷ ${k} = ${q} bags.`)
    },
  },
  {
    name: 'Simple fractions', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      if (kind === 0) {
        const d = r.pick([3, 4, 4, 5, 6, 8]), n = r.int(1, d - 1)
        const left: Fraction = [d - n, d]
        return ask(r, `A pizza is cut into ${d} equal slices. ${n} slice${n === 1 ? ' is' : 's are'} eaten. What fraction of the pizza is left?`, `${d - n}/${d}`, fractions(left, [[n, d], [d - n, n]]), `${d - n} of the ${d} slices are left, which is ${d - n}/${d}.`)
      }
      if (kind === 1) { const k = r.int(2, 9); return ask(r, `What is half of ${2 * k}?`, String(k), nums(k, [2 * k - 2, 2 * k], { min: 1 }), `Half means share into 2 equal parts: ${2 * k} ÷ 2 = ${k}.`) }
      if (kind === 2) { const k = r.int(2, 8); return ask(r, `What is one quarter of ${4 * k}?`, String(k), nums(k, [k * 2, 4 * k - 4], { min: 1 }), `One quarter means share into 4 equal parts: ${4 * k} ÷ 4 = ${k}.`) }
      if (kind === 3) { const k = r.int(2, 8); return ask(r, `What is one third of ${3 * k}?`, String(k), nums(k, [k * 2, 3 * k - 3], { min: 1 }), `One third means share into 3 equal parts: ${3 * k} ÷ 3 = ${k}.`) }
      const ds = r.shuffle([2, 3, 4, 5, 6, 8, 10]).slice(0, 4)
      const big = r.int(0, 1) === 0
      const pick = big ? Math.min(...ds) : Math.max(...ds)
      return ask(r, `Which fraction is the ${big ? 'biggest' : 'smallest'}?`, `1/${pick}`, ds.filter((d) => d !== pick).map((d) => `1/${d}`), `When the top number is 1, a ${big ? 'smaller' : 'bigger'} bottom number means a ${big ? 'bigger' : 'smaller'} piece. So 1/${pick} is the ${big ? 'biggest' : 'smallest'}.`)
    },
  },
  {
    name: 'Time and money', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      if (kind === 0) {
        const h = r.int(1, 12), k = r.int(1, 11), m = k * 5
        const others = [...new Set([clock(h, (m + 5) % 60), clock(h, (m + 10) % 60), clock(h === 12 ? 1 : h + 1, m), clock(h, k), clock(h, 60 - m === 60 ? 5 : 60 - m)])].filter((c) => c !== clock(h, m))
        return ask(r, `The hour hand is just past ${h} and the minute hand points to ${k}. What time is it?`, clock(h, m), others, `The minute hand on ${k} means ${k} × 5 = ${m} minutes past the hour. It is ${clock(h, m)}.`)
      }
      if (kind === 1) {
        const h = r.int(1, 11), start = r.int(0, 5) * 5, gap = r.int(1, 5) * 5 + (r.int(0, 1) * 0)
        const end = start + gap
        return ask(r, `How many minutes are there from ${clock(h, start)} to ${clock(h, end)}?`, String(gap), nums(gap, [gap + 5, gap - 5, start], { min: 5 }), `${end} − ${start} = ${gap} minutes.`)
      }
      if (kind === 2) { const a = r.int(2, 9), b = r.int(2, 9); return ask(r, `A pencil costs $${a} and a ruler costs $${b}. How much do they cost together?`, `$${a + b}`, nums(a + b, [Math.abs(a - b), a * b], { min: 1, fmt: (n) => `$${n}` }), `$${a} + $${b} = $${a + b}.`) }
      if (kind === 3) { const cost = r.int(3, 18), paid = r.pick([20, 50].filter((p) => p > cost)); return ask(r, `A toy costs $${cost}. Zoe pays with $${paid}. How much change is given?`, `$${paid - cost}`, nums(paid - cost, [paid + cost, cost], { min: 1, fmt: (n) => `$${n}` }), `$${paid} − $${cost} = $${paid - cost}.`) }
      const coin = r.pick([5, 10]), n = r.int(3, 9)
      return ask(r, `How many ${coin}-cent coins make ${coin * n} cents?`, String(n), nums(n, [n + 1, coin], { min: 1 }), `${coin * n} ÷ ${coin} = ${n} coins.`)
    },
  },
  {
    name: 'Geometry: sides, corners and shapes', count: 2, make: (r) => {
      const solids = [
        { name: 'cube', faces: 6, edges: 12, corners: 8 }, { name: 'cuboid', faces: 6, edges: 12, corners: 8 },
        { name: 'triangular prism', faces: 5, edges: 9, corners: 6 }, { name: 'square-based pyramid', faces: 5, edges: 8, corners: 5 },
      ]
      const kind = r.int(0, 2)
      if (kind === 0) {
        const s = r.pick(solids), prop = r.pick(['faces', 'edges', 'corners'] as const)
        return ask(r, `How many ${prop} does a ${s.name} have?`, String(s[prop]), nums(s[prop], [s[prop] + 1, s[prop] - 1, s[prop] + 2], { min: 2 }), `A ${s.name} has ${s.faces} faces, ${s.edges} edges and ${s.corners} corners.`)
      }
      if (kind === 1) { const k = r.int(2, 14); return ask(r, `A square has sides of ${k} cm. What is the distance all the way around it?`, `${4 * k} cm`, nums(4 * k, [k * 2, k * k, k + 4], { min: 1, fmt: (n) => `${n} cm` }), `A square has 4 equal sides: 4 × ${k} = ${4 * k} cm.`) }
      const n = r.int(3, 6)
      return ask(r, `${n} triangles are drawn. How many corners do they have in all?`, String(3 * n), nums(3 * n, [n + 3, 4 * n], { min: 3 }), `Each triangle has 3 corners. ${n} × 3 = ${3 * n}.`)
    },
  },
  {
    name: 'Word problems', count: 3, make: (r) => {
      const [n1, n2] = twoNames(r)
      const t = r.pick(THINGS)
      const kind = r.int(0, 4)
      if (kind === 0) {
        const a = r.int(25, 75), b = r.int(18, 49), c = r.int(5, Math.min(a + b - 1, 30))
        return ask(r, `${n1} has ${a} ${t.many}. ${n1} wins ${b} more and then loses ${c}. How many ${t.many} does ${n1} have now?`, String(a + b - c), nums(a + b - c, [a + b + c, a + b, a - b + c], { min: 0 }), `${a} + ${b} = ${a + b}. Then ${a + b} − ${c} = ${a + b - c}.`)
      }
      if (kind === 1) {
        const g = r.int(3, 6), m = r.pick([3, 4, 5, 6]), extra = r.int(2, 9)
        return ask(r, `${n1} has ${g} boxes with ${m} ${t.many} in each box and ${extra} more ${t.many} loose. How many ${t.many} does ${n1} have?`, String(g * m + extra), nums(g * m + extra, [g * m, g + m + extra, g * m - extra], { min: 1 }), `${g} × ${m} = ${g * m}. Then ${g * m} + ${extra} = ${g * m + extra}.`)
      }
      if (kind === 2) {
        const k = r.pick([2, 3, 4, 5]), q = r.int(3, 9), extra = r.int(2, 8)
        return ask(r, `${n1} shares ${k * q} ${t.many} equally among ${k} friends. Then ${n1} gives each friend ${extra} more. How many ${t.many} does each friend have now?`, String(q + extra), nums(q + extra, [q, k * q + extra], { min: 1 }), `${k * q} ÷ ${k} = ${q}. Then ${q} + ${extra} = ${q + extra}.`)
      }
      if (kind === 3) {
        const a = r.int(120, 480), b = r.int(110, 400)
        return ask(r, `A shop sold ${a} ${t.many} on Monday and ${b} on Tuesday. How many ${t.many} did it sell on the two days?`, String(a + b), nums(a + b, [a + b - 10, a - b], { min: 0 }), `${a} + ${b} = ${a + b}.`)
      }
      const price = r.int(2, 9), n = r.int(2, 6), paid = 5 * Math.ceil((price * n + 1) / 5)
      return ask(r, `${n2} buys ${n} ${t.many} at $${price} each and pays with $${paid}. How much change is given?`, `$${paid - price * n}`, nums(paid - price * n, [price * n, paid + price * n], { min: 1, fmt: (v) => `$${v}` }), `${n} × $${price} = $${price * n}. Then $${paid} − $${price * n} = $${paid - price * n}.`)
    },
  },
]
