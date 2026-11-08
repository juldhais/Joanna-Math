import { THINGS, ask, dec, nums, sameValue, twoNames } from './helpers'
import type { Fraction, Topic } from './helpers'

const cm = (n: number) => `${n} cm`
const cm2 = (n: number) => `${n} cm²`

export const level3: Topic[] = [
  {
    name: 'Multi-digit addition and subtraction', count: 3, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) {
        const a = r.int(300, 900), b = r.int(150, 700), c = r.int(100, Math.min(a + b - 1, 600))
        return ask(r, `Find ${a} + ${b} − ${c} = ?`, String(a + b - c), nums(a + b - c, [a + b + c, a + b, a - b + c], { min: 0 }), `First add: ${a} + ${b} = ${a + b}. Then subtract ${c}: ${a + b - c}.`)
      }
      if (kind === 1) {
        const a = r.int(1200, 6800), b = r.int(1100, 9800 - a)
        return ask(r, `Find ${a} + ${b} = ?`, String(a + b), nums(a + b, [a + b - 100, a + b + 100, a + b - 10], { min: 0 }), `Add column by column, regrouping when needed: ${a} + ${b} = ${a + b}.`)
      }
      if (kind === 2) {
        const b = r.int(1100, 4800), a = r.int(5000, 9900)
        return ask(r, `Find ${a} − ${b} = ?`, String(a - b), nums(a - b, [a - b + 100, a - b - 100, a - b + 10], { min: 0 }), `Subtract column by column, regrouping when needed: ${a} − ${b} = ${a - b}.`)
      }
      const a = r.int(1200, 4800), b = r.int(1100, 3800), c = r.int(100, 900)
      return ask(r, `A school had ${a} books. It bought ${b} more and gave away ${c}. How many books does it have now?`, String(a + b - c), nums(a + b - c, [a + b + c, a + b, a - b + c], { min: 0 }), `${a} + ${b} = ${a + b}. Then ${a + b} − ${c} = ${a + b - c}.`)
    },
  },
  {
    name: 'Multiplication and division', count: 4, make: (r) => {
      const kind = r.int(0, 5)
      const a = r.int(3, 12), b = r.int(3, 12)
      if (kind === 0) return ask(r, `Find ${a} × ${b} = ?`, String(a * b), nums(a * b, [a * b + a, a * b - b, a + b], { min: 1 }), `${a} × ${b} = ${a * b}.`)
      if (kind === 1) return ask(r, `Find ${a * b} ÷ ${b} = ?`, String(a), nums(a, [a + 1, a - 1, a * b - b], { min: 1 }), `${b} × ${a} = ${a * b}, so ${a * b} ÷ ${b} = ${a}.`)
      if (kind === 2) { const x = r.int(12, 99), y = r.int(3, 9); return ask(r, `Find ${x} × ${y} = ?`, String(x * y), nums(x * y, [x * y + 10, x * y - 10, x + y], { min: 1 }), `${Math.floor(x / 10) * 10} × ${y} = ${Math.floor(x / 10) * 10 * y} and ${x % 10} × ${y} = ${(x % 10) * y}. Add them: ${x * y}.`) }
      if (kind === 3) { const q = r.int(12, 99), d = r.int(3, 9); return ask(r, `Find ${q * d} ÷ ${d} = ?`, String(q), nums(q, [q + 10, q - 10, q + 1], { min: 1 }), `${d} × ${q} = ${q * d}, so ${q * d} ÷ ${d} = ${q}.`) }
      if (kind === 4) { const d = r.int(3, 9), q = r.int(4, 12), rem = r.int(1, d - 1); return ask(r, `What is the remainder when ${d * q + rem} is divided by ${d}?`, String(rem), nums(rem, [q, d - rem, rem + 1], { min: 0 }), `${d} × ${q} = ${d * q}. ${d * q + rem} − ${d * q} = ${rem}.`) }
      const t = r.pick(THINGS), per = r.int(6, 12), boxes = r.int(4, 9)
      return ask(r, `A box holds ${per} ${t.many}. How many ${t.many} are in ${boxes} boxes?`, String(per * boxes), nums(per * boxes, [per + boxes, per * boxes + per], { min: 1 }), `${boxes} × ${per} = ${per * boxes}.`)
    },
  },
  {
    name: 'Equivalent and comparing fractions', count: 2, make: (r) => {
      const kind = r.int(0, 2)
      if (kind === 0) {
        const b = r.pick([2, 3, 4, 5, 6]), a = r.int(1, b - 1), k = r.int(2, 5)
        const target: Fraction = [a, b]
        const wrong = ([[a + k, b + k], [a, b * k], [a * k, b], [a + k, b * k], [b, a]] as Fraction[]).filter((f) => !sameValue(f, target))
        return ask(r, `Which fraction is equal to ${a}/${b}?`, `${a * k}/${b * k}`, wrong.map((f) => `${f[0]}/${f[1]}`), `Multiply the top and bottom by ${k}: ${a}/${b} = ${a * k}/${b * k}.`)
      }
      if (kind === 1) {
        const b = r.pick([2, 3, 4, 5]), a = r.int(1, b - 1), k = r.int(2, 6)
        return ask(r, `Fill in the missing number: ${a}/${b} = __/${b * k}`, String(a * k), nums(a * k, [a + k, a, b * k], { min: 1 }), `${b} × ${k} = ${b * k}, so multiply the top by ${k} as well: ${a} × ${k} = ${a * k}.`)
      }
      const denominators = r.shuffle([2, 3, 4, 5, 6, 8, 10, 12])
      const items: Fraction[] = []
      for (const d of denominators) {
        const f: Fraction = [r.int(1, d - 1), d]
        if (!items.some((g) => sameValue(g, f))) items.push(f)
        if (items.length === 4) break
      }
      const greatest = r.int(0, 1) === 0
      const value = (f: Fraction) => f[0] / f[1]
      const best = [...items].sort((x, y) => (greatest ? value(y) - value(x) : value(x) - value(y)))[0]
      if (items.length < 4 || Math.abs(value(items[0]) - value(items[1])) < 1e-9) throw new Error('retry')
      return ask(r, `Which fraction is the ${greatest ? 'greatest' : 'smallest'}? ${items.map((f) => `${f[0]}/${f[1]}`).join(', ')}`, `${best[0]}/${best[1]}`, items.filter((f) => f !== best).map((f) => `${f[0]}/${f[1]}`), `Write them with a common denominator or compare them with decimals. ${best[0]}/${best[1]} is the ${greatest ? 'greatest' : 'smallest'}.`)
    },
  },
  {
    name: 'Decimals (tenths and hundredths)', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      if (kind === 0) { const a = r.int(11, 89) / 10, b = r.int(11, 89) / 10; const s = a + b; return ask(r, `Find ${dec(a, 1)} + ${dec(b, 1)} = ?`, dec(s, 1), nums(s, [s + 1, s - 1, s + 0.1], { fmt: (n) => dec(n, 1), min: 0 }).map(String), `Line up the decimal points and add: ${dec(a, 1)} + ${dec(b, 1)} = ${dec(s, 1)}.`) }
      if (kind === 1) { const a = r.int(60, 99) / 10, b = r.int(11, 59) / 10, d = a - b; return ask(r, `Find ${dec(a, 1)} − ${dec(b, 1)} = ?`, dec(d, 1), nums(d, [d + 1, d - 1, d + 0.1], { fmt: (n) => dec(n, 1), min: 0 }), `Line up the decimal points and subtract: ${dec(a, 1)} − ${dec(b, 1)} = ${dec(d, 1)}.`) }
      if (kind === 2) { const n = r.int(1, 9); return ask(r, `What is ${n}/10 as a decimal?`, dec(n / 10, 1), [dec(n / 100, 2), String(n), dec(n * 10, 0), dec(n / 10 + 0.1, 1)], `${n}/10 means ${n} tenths, which is ${dec(n / 10, 1)}.`) }
      if (kind === 3) {
        const a = r.int(11, 99), b = r.int(11, 99)
        if (a === b) throw new Error('retry')
        const sets = [`0.${a}`, `0.${b}`]
        const bigger = a > b ? sets[0] : sets[1]
        return ask(r, `Which is greater: ${sets[0]} or ${sets[1]}?`, bigger, [a > b ? sets[1] : sets[0], 'They are equal', 'It cannot be told'], `Compare the hundredths: ${Math.max(a, b)} hundredths is more than ${Math.min(a, b)} hundredths.`)
      }
      const whole = r.int(1, 9), t = r.int(1, 9), h = r.int(1, 9)
      const place = r.pick(['tenths', 'hundredths'] as const)
      const answer = place === 'tenths' ? t : h
      const others = [t, h, whole, (answer + 3) % 10, (answer + 5) % 10].filter((v) => v !== answer).map(String)
      return ask(r, `Which digit is in the ${place} place of ${whole}.${t}${h}?`, String(answer), others, `In ${whole}.${t}${h}, the ${t} is in the tenths place and the ${h} is in the hundredths place.`)
    },
  },
  {
    name: 'Perimeter and area of rectangles', count: 3, make: (r) => {
      const l = r.int(4, 15), w = r.int(2, l - 1)
      const kind = r.int(0, 5)
      if (kind === 0) return ask(r, `A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter?`, cm(2 * (l + w)), nums(2 * (l + w), [l + w, l * w, 2 * l + w], { min: 1, fmt: cm }), `Perimeter = 2 × (${l} + ${w}) = 2 × ${l + w} = ${2 * (l + w)} cm.`)
      if (kind === 1) return ask(r, `A rectangle is ${l} cm long and ${w} cm wide. What is its area?`, cm2(l * w), nums(l * w, [2 * (l + w), l + w, l * w + l], { min: 1, fmt: cm2 }), `Area = length × width = ${l} × ${w} = ${l * w} cm².`)
      if (kind === 2) return ask(r, `A square has sides of ${w + 1} cm. What is its area?`, cm2((w + 1) ** 2), nums((w + 1) ** 2, [4 * (w + 1), 2 * (w + 1)], { min: 1, fmt: cm2 }), `Area = ${w + 1} × ${w + 1} = ${(w + 1) ** 2} cm².`)
      if (kind === 3) return ask(r, `The area of a rectangle is ${l * w} cm². Its length is ${l} cm. What is its width?`, cm(w), nums(w, [l * w - l, l, w + 1], { min: 1, fmt: cm }), `Width = area ÷ length = ${l * w} ÷ ${l} = ${w} cm.`)
      if (kind === 4) return ask(r, `The perimeter of a rectangle is ${2 * (l + w)} cm. Its length is ${l} cm. What is its width?`, cm(w), nums(w, [2 * (l + w) - l, l + w, w + 1], { min: 1, fmt: cm }), `Length + width = ${2 * (l + w)} ÷ 2 = ${l + w}. Width = ${l + w} − ${l} = ${w} cm.`)
      return ask(r, `A garden is ${l} m long and ${w} m wide. A fence goes all the way around it. How long is the fence?`, `${2 * (l + w)} m`, nums(2 * (l + w), [l * w, l + w], { min: 1, fmt: (n) => `${n} m` }), `The fence is the perimeter: 2 × (${l} + ${w}) = ${2 * (l + w)} m.`)
    },
  },
  {
    name: 'Multi-step word problems', count: 4, make: (r) => {
      const [n1, n2] = twoNames(r)
      const t = r.pick(THINGS)
      const kind = r.int(0, 6)
      if (kind === 0) {
        const price = r.int(3, 9), n = r.int(3, 8), paid = 10 * Math.ceil((price * n + 1) / 10)
        return ask(r, `${n1} buys ${n} ${t.many} at $${price} each and pays with $${paid}. How much change does ${n1} get?`, `$${paid - price * n}`, nums(paid - price * n, [price * n, paid + price * n], { min: 1, fmt: (v) => `$${v}` }), `${n} × $${price} = $${price * n}. $${paid} − $${price * n} = $${paid - price * n}.`)
      }
      if (kind === 1) {
        const cap = r.pick([20, 25, 30, 40]), people = cap * r.int(2, 5) + r.int(1, cap - 1)
        const buses = Math.ceil(people / cap)
        return ask(r, `A bus holds ${cap} people. How many buses are needed for ${people} people?`, String(buses), nums(buses, [Math.floor(people / cap), buses + 1], { min: 1 }), `${people} ÷ ${cap} is ${Math.floor(people / cap)} remainder ${people % cap}. The extra people need one more bus, so ${buses} buses.`)
      }
      if (kind === 2) {
        const pages = r.int(150, 400), perDay = r.int(12, 30), days = r.int(3, 6)
        return ask(r, `A book has ${pages} pages. ${n1} reads ${perDay} pages a day for ${days} days. How many pages are left to read?`, String(pages - perDay * days), nums(pages - perDay * days, [perDay * days, pages + perDay * days], { min: 0 }), `${perDay} × ${days} = ${perDay * days} pages read. ${pages} − ${perDay * days} = ${pages - perDay * days}.`)
      }
      if (kind === 3) {
        const friends = r.int(3, 6), each = r.int(4, 12), a = r.int(10, 40)
        const b = friends * each - a
        if (b < 5) throw new Error('retry')
        return ask(r, `${n1} has ${a} stickers and ${n2} has ${b}. They share all the stickers equally among ${friends} friends. How many stickers does each friend get?`, String(each), nums(each, [a + b, a, each + 1], { min: 1 }), `${a} + ${b} = ${a + b}. Then ${a + b} ÷ ${friends} = ${each}.`)
      }
      if (kind === 4) {
        const n = r.int(3, 7), cost = r.int(4, 12), weeks = r.int(3, 8), saved = Math.ceil((n * cost + 5) / weeks)
        return ask(r, `${n1} saves $${saved} every week for ${weeks} weeks. ${n1} then buys ${n} ${t.many} costing $${cost} each. How much money does ${n1} have left?`, `$${saved * weeks - n * cost}`, nums(saved * weeks - n * cost, [saved * weeks, n * cost, saved * weeks + n * cost], { min: 0, fmt: (v) => `$${v}` }), `${weeks} × $${saved} = $${saved * weeks} saved. ${n} × $${cost} = $${n * cost} spent. $${saved * weeks} − $${n * cost} = $${saved * weeks - n * cost}.`)
      }
      if (kind === 5) {
        const speed = r.int(40, 90), hours = r.int(2, 5), extra = r.int(20, 90)
        return ask(r, `A train travels ${speed} km each hour for ${hours} hours, then ${extra} km more. How far does it travel in all?`, `${speed * hours + extra} km`, nums(speed * hours + extra, [speed * hours, speed + hours + extra], { min: 1, fmt: (v) => `${v} km` }), `${speed} × ${hours} = ${speed * hours}. ${speed * hours} + ${extra} = ${speed * hours + extra} km.`)
      }
      const age = r.int(6, 12), gap = r.int(20, 30), yrs = r.int(2, 8)
      return ask(r, `${n1} is ${age} years old. ${n1}'s father is ${gap} years older. How old will the father be in ${yrs} years?`, String(age + gap + yrs), nums(age + gap + yrs, [age + gap, age + yrs, gap + yrs], { min: 1 }), `The father is ${age} + ${gap} = ${age + gap} now. In ${yrs} years: ${age + gap + yrs}.`)
    },
  },
  {
    name: 'Data reading and number patterns', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      if (kind <= 1) {
        const names = r.shuffle(['Ali', 'Ben', 'Cara', 'Dev', 'Eli', 'Fay']).slice(0, r.int(3, 4))
        const values = names.map(() => r.int(3, 18))
        const cols = ['bg-indigo-500', 'bg-sky-400', 'bg-rose-500', 'bg-emerald-500']
        const visual = { type: 'comparison_bars' as const, items: names.map((label, i) => ({ label, value: values[i], color: cols[i] })) }
        const [i, j] = r.shuffle(names.map((_, k) => k))
        if (values[i] === values[j]) throw new Error('retry')
        if (kind === 0) {
          const hi = values[i] > values[j] ? i : j, lo = hi === i ? j : i
          return ask(r, `Look at the bars. How many more books did ${names[hi]} read than ${names[lo]}?`, String(values[hi] - values[lo]), nums(values[hi] - values[lo], [values[hi] + values[lo], values[hi]], { min: 1 }), `${names[hi]} read ${values[hi]} and ${names[lo]} read ${values[lo]}. ${values[hi]} − ${values[lo]} = ${values[hi] - values[lo]}.`, visual)
        }
        const total = values.reduce((x, y) => x + y, 0)
        return ask(r, `Look at the bars. How many books did the children read altogether?`, String(total), nums(total, [total - values[0], total + 1, Math.max(...values)], { min: 1 }), `Add all the bars: ${values.join(' + ')} = ${total}.`, visual)
      }
      if (kind === 2) {
        const start = r.int(2, 30), step = r.pick([3, 4, 6, 7, 8, 9, 11, 12])
        const seq = Array.from({ length: 4 }, (_, i) => start + i * step)
        return ask(r, `What number comes next? ${seq.join(', ')}, __`, String(start + 4 * step), nums(start + 4 * step, [start + 4 * step - 1, start + 5 * step, start + 3 * step + 1], { min: 0 }), `The numbers go up by ${step} each time. ${seq[3]} + ${step} = ${start + 4 * step}.`)
      }
      const start = r.pick([1, 2, 3, 5]), ratio = r.pick([2, 3])
      const seq = Array.from({ length: 4 }, (_, i) => start * ratio ** i)
      return ask(r, `What number comes next? ${seq.join(', ')}, __`, String(start * ratio ** 4), nums(start * ratio ** 4, [seq[3] + (seq[3] - seq[2]), seq[3] + ratio, seq[3] * ratio + 1], { min: 1 }), `Each number is multiplied by ${ratio}. ${seq[3]} × ${ratio} = ${start * ratio ** 4}.`)
    },
  },
]
