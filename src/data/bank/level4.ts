import { THINGS, ask, dec, fractions, gcd, lcm, mixed, nums, reduce, twoNames } from './helpers'
import type { Fraction, Topic } from './helpers'

const isPrime = (n: number) => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every((d) => n % d !== 0)
const COLUMNS = ['bg-indigo-500', 'bg-sky-400', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500']

export const level4: Topic[] = [
  {
    name: 'Fraction operations', count: 3, make: (r) => {
      const kind = r.int(0, 4)
      const dens = [2, 3, 4, 5, 6, 8, 10, 12]
      if (kind <= 1) {
        const b = r.pick(dens), d = r.pick(dens)
        if (b === d || lcm(b, d) > 24) throw new Error('retry')
        const a = r.int(1, b - 1), c = r.int(1, d - 1)
        const L = lcm(b, d)
        const add = kind === 0
        const top = add ? a * (L / b) + c * (L / d) : a * (L / b) - c * (L / d)
        if (top <= 0) throw new Error('retry')
        const ans: Fraction = [top, L]
        return ask(r, `Find ${a}/${b} ${add ? '+' : '−'} ${c}/${d} = ?`, mixed(ans), fractions(reduce(ans), [[add ? a + c : a - c, add ? b + d : Math.abs(b - d) || 1]]), `Use a common denominator of ${L}: ${a * (L / b)}/${L} ${add ? '+' : '−'} ${c * (L / d)}/${L} = ${top}/${L}, which is ${mixed(ans)}.`)
      }
      if (kind === 2) {
        const d = r.pick([3, 4, 5, 6, 8]), n = r.int(1, d - 1), k = r.int(2, 9)
        const whole = d * k
        const ans = n * k
        return ask(r, `What is ${n}/${d} of ${whole}?`, String(ans), nums(ans, [whole / d, whole - ans, ans + k], { min: 1 }), `${whole} ÷ ${d} = ${k}. Then ${k} × ${n} = ${ans}.`)
      }
      if (kind === 3) {
        const d = r.pick([2, 3, 4, 5, 6, 8]), w = r.int(1, 4), n = r.int(1, d - 1)
        const top = w * d + n
        return ask(r, `Write ${w} ${n}/${d} as an improper fraction.`, `${top}/${d}`, [`${w * n + d}/${d}`, `${top}/${w}`, `${top + d}/${d}`, `${w + n}/${d}`], `${w} × ${d} + ${n} = ${top}, so ${w} ${n}/${d} = ${top}/${d}.`)
      }
      const d = r.pick([3, 4, 5, 6, 8]), w = r.int(1, 5), n = r.int(1, d - 1), top = w * d + n
      return ask(r, `Write ${top}/${d} as a mixed number.`, `${w} ${n}/${d}`, [`${w + 1} ${n}/${d}`, `${w} ${n}/${d + 1}`, `${n} ${w}/${d}`, `${w} ${n + 1}/${d}`], `${top} ÷ ${d} = ${w} remainder ${n}, so ${top}/${d} = ${w} ${n}/${d}.`)
    },
  },
  {
    name: 'Decimal operations and comparison', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      const f = (n: number) => dec(n, 3)
      if (kind === 0) { const a = r.int(110, 899) / 100, b = r.int(110, 899) / 100; const s = a + b; return ask(r, `Find ${dec(a)} + ${dec(b)} = ?`, dec(s), nums(s, [s + 0.1, s - 0.1, s + 1], { min: 0, fmt: (n) => dec(n) }), `Line up the decimal points: ${dec(a)} + ${dec(b)} = ${dec(s)}.`) }
      if (kind === 1) { const a = r.int(500, 999) / 100, b = r.int(110, 499) / 100; const d = a - b; return ask(r, `Find ${dec(a)} − ${dec(b)} = ?`, dec(d), nums(d, [d + 0.1, d - 0.1, d + 1], { min: 0, fmt: (n) => dec(n) }), `Line up the decimal points: ${dec(a)} − ${dec(b)} = ${dec(d)}.`) }
      if (kind === 2) { const a = r.int(12, 95) / 10, k = r.int(3, 9); const p = a * k; return ask(r, `Find ${dec(a, 1)} × ${k} = ?`, dec(p, 1), nums(p, [p * 10, p / 10, p + 1], { min: 0, fmt: (n) => dec(n, 2) }), `${Math.round(a * 10)} × ${k} = ${Math.round(a * 10) * k}. Divide by 10 for the tenths: ${dec(p, 1)}.`) }
      if (kind === 3) { const k = r.int(2, 9), q = r.int(11, 99) / 10; const total = q * k; return ask(r, `Find ${dec(total, 1)} ÷ ${k} = ?`, dec(q, 1), nums(q, [q * 10, q / 10, q + 1], { min: 0, fmt: (n) => dec(n, 2) }), `${dec(q, 1)} × ${k} = ${dec(total, 1)}, so ${dec(total, 1)} ÷ ${k} = ${dec(q, 1)}.`) }
      const set = r.shuffle([0.3, 0.35, 0.305, 0.5, 0.53, 0.503, 0.25, 0.205, 0.52, 0.055, 0.5]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)
      const smallest = r.int(0, 1) === 0
      const answer = smallest ? Math.min(...set) : Math.max(...set)
      return ask(r, `Which is the ${smallest ? 'smallest' : 'largest'} number? ${set.map(f).join(', ')}`, f(answer), set.filter((v) => v !== answer).map(f), `Compare place by place (tenths, hundredths, thousandths). ${f(answer)} is the ${smallest ? 'smallest' : 'largest'}.`)
    },
  },
  {
    name: 'Factors, multiples, LCM and HCF', count: 3, make: (r) => {
      const kind = r.int(0, 5)
      if (kind === 0) { const a = r.int(3, 12), b = r.int(3, 12); if (a === b) throw new Error('retry'); const L = lcm(a, b); return ask(r, `What is the lowest common multiple of ${a} and ${b}?`, String(L), nums(L, [a * b === L ? a + b : a * b, gcd(a, b), Math.max(a, b)], { min: 1 }), `List the multiples of each number. The first one they share is ${L}.`) }
      if (kind === 1) { const g = r.int(2, 9), x = r.int(2, 6), y = r.int(2, 6); if (gcd(x, y) !== 1 || x === y) throw new Error('retry'); const a = g * x, b = g * y; return ask(r, `What is the highest common factor of ${a} and ${b}?`, String(g), nums(g, [a - b > 0 ? a - b : b - a, lcm(a, b), 1], { min: 1 }), `The biggest number that divides both ${a} and ${b} is ${g}.`) }
      if (kind === 2) { const n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 48]); const factors = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0); return ask(r, `How many factors does ${n} have?`, String(factors.length), nums(factors.length, [factors.length - 1, factors.length + 1, n / 2], { min: 2 }), `The factors of ${n} are ${factors.join(', ')}. That is ${factors.length} factors.`) }
      if (kind === 3) { const a = r.pick([3, 4, 5, 6, 7]), b = r.pick([8, 9, 11, 12, 13].filter((x) => x !== a)); const L = lcm(a, b); const wrongs = nums(L, [L + a, L - b, a * b + 1, L + b], { min: 1 }); return ask(r, `Which number is a multiple of both ${a} and ${b}?`, String(L), wrongs.filter((v) => Number(v) % a !== 0 || Number(v) % b !== 0), `${L} ÷ ${a} = ${L / a} and ${L} ÷ ${b} = ${L / b}, so ${L} is a multiple of both.`) }
      if (kind === 4) { const start = r.int(10, 80); const options = r.shuffle(Array.from({ length: 40 }, (_, i) => start + i)); const primes = options.filter(isPrime), composites = options.filter((v) => !isPrime(v)); return ask(r, 'Which of these numbers is a prime number?', String(primes[0]), composites.slice(0, 3).map(String), `${primes[0]} has no factors other than 1 and itself. The other numbers can be divided evenly by other numbers.`) }
      const n = r.int(24, 90), k = r.pick([3, 4, 6, 7, 8, 9]); const answer = Math.floor(n / k)
      return ask(r, `How many multiples of ${k} are there from 1 to ${n}?`, String(answer), nums(answer, [answer + 1, answer - 1, n - k], { min: 1 }), `${n} ÷ ${k} = ${(n / k).toFixed(2)}, so the whole number of multiples is ${answer}.`)
    },
  },
  {
    name: 'Ratios', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      const a = r.int(1, 6), b = r.int(1, 6)
      if (a === b || gcd(a, b) !== 1) throw new Error('retry')
      const k = r.int(2, 8)
      if (kind === 0) return ask(r, `The ratio of red to blue marbles is ${a} : ${b}. There are ${a * k} red marbles. How many blue marbles are there?`, String(b * k), nums(b * k, [a * k + b, b + k, a * k - b], { min: 1 }), `${a * k} red is ${k} groups of ${a}. So blue is ${k} groups of ${b}: ${b * k}.`)
      if (kind === 1) return ask(r, `Share ${(a + b) * k} sweets in the ratio ${a} : ${b}. What is the bigger share?`, String(Math.max(a, b) * k), nums(Math.max(a, b) * k, [Math.min(a, b) * k, (a + b) * k / 2, Math.max(a, b)], { min: 1 }), `${a} + ${b} = ${a + b} parts. ${(a + b) * k} ÷ ${a + b} = ${k} per part. The bigger share is ${Math.max(a, b)} × ${k} = ${Math.max(a, b) * k}.`)
      if (kind === 2) return ask(r, `Simplify the ratio ${a * k} : ${b * k}.`, `${a} : ${b}`, [`${a * k} : ${b}`, `${a} : ${b * k}`, `${b} : ${a}`, `${a + 1} : ${b}`], `Divide both numbers by ${k}: ${a * k} ÷ ${k} = ${a} and ${b * k} ÷ ${k} = ${b}.`)
      const eggs = r.pick([2, 3, 4]), flour = r.pick([100, 150, 200]), times = r.int(2, 5)
      return ask(r, `A recipe uses ${eggs} eggs and ${flour} g of flour. How much flour is needed for ${eggs * times} eggs?`, `${flour * times} g`, nums(flour * times, [flour + times, flour + eggs * times], { min: 1, fmt: (n) => `${n} g` }), `${eggs * times} eggs is ${times} times as many, so use ${times} × ${flour} = ${flour * times} g.`)
    },
  },
  {
    name: 'Measurement conversions', count: 2, make: (r) => {
      const kind = r.int(0, 6)
      const n = r.int(2, 9)
      if (kind === 0) return ask(r, `How many centimetres are in ${n} m?`, String(n * 100), [String(n * 10), String(n * 1000), String(n), String(n * 100 + 10)], `1 m = 100 cm, so ${n} m = ${n * 100} cm.`)
      if (kind === 1) return ask(r, `How many metres are in ${n} km?`, String(n * 1000), [String(n * 100), String(n * 10000), String(n), String(n * 1000 + 100)], `1 km = 1000 m, so ${n} km = ${n * 1000} m.`)
      if (kind === 2) return ask(r, `How many grams are in ${n} kg?`, String(n * 1000), [String(n * 100), String(n * 10), String(n * 10000), String(n)], `1 kg = 1000 g, so ${n} kg = ${n * 1000} g.`)
      if (kind === 3) return ask(r, `How many millilitres are in ${n} litres?`, String(n * 1000), [String(n * 100), String(n * 10), String(n * 100000), String(n)], `1 litre = 1000 mL, so ${n} litres = ${n * 1000} mL.`)
      if (kind === 4) { const h = r.int(1, 4), m = r.pick([10, 15, 20, 30, 45]); return ask(r, `How many minutes are in ${h} hour${h > 1 ? 's' : ''} ${m} minutes?`, String(h * 60 + m), nums(h * 60 + m, [h * 100 + m, h + m, h * 60], { min: 1 }), `${h} × 60 = ${h * 60}. ${h * 60} + ${m} = ${h * 60 + m} minutes.`) }
      if (kind === 5) { const km = r.int(1, 9), tenths = r.int(1, 9); return ask(r, `${km}.${tenths} km is how many metres?`, String(km * 1000 + tenths * 100), nums(km * 1000 + tenths * 100, [km * 100 + tenths * 10, km * 1000 + tenths * 10, km * 1000 + tenths], { min: 1 }), `${km}.${tenths} × 1000 = ${km * 1000 + tenths * 100} m.`) }
      const m = r.int(2, 9), c = r.pick([25, 50, 75]); return ask(r, `A rope is ${m} m ${c} cm long. How many centimetres is that?`, String(m * 100 + c), nums(m * 100 + c, [m * 10 + c, m + c, m * 1000 + c], { min: 1 }), `${m} m = ${m * 100} cm. ${m * 100} + ${c} = ${m * 100 + c} cm.`)
    },
  },
  {
    name: 'Angles and angle facts', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      const deg = (n: number) => `${n}°`
      if (kind === 0) { const x = r.int(20, 160); return ask(r, `Two angles on a straight line add up to 180°. One angle is ${x}°. What is the other angle?`, deg(180 - x), nums(180 - x, [90 - x > 0 ? 90 - x : x, 360 - x, x], { min: 1, fmt: deg }), `180° − ${x}° = ${180 - x}°.`) }
      if (kind === 1) { const a = r.int(30, 80), b = r.int(30, 100 - 1); if (a + b >= 175) throw new Error('retry'); return ask(r, `Two angles of a triangle are ${a}° and ${b}°. What is the third angle?`, deg(180 - a - b), nums(180 - a - b, [360 - a - b, 90 - a, a + b], { min: 1, fmt: deg }), `The angles of a triangle add up to 180°. 180° − ${a}° − ${b}° = ${180 - a - b}°.`) }
      if (kind === 2) { const x = r.int(25, 80), y = r.int(40, 120); if (x + y >= 340) throw new Error('retry'); return ask(r, `Angles around a point add up to 360°. Two of the angles are ${x}° and ${y}°. The third angle completes the point. What is it?`, deg(360 - x - y), nums(360 - x - y, [180 - x - y, 360 - x, x + y], { min: 1, fmt: deg }), `360° − ${x}° − ${y}° = ${360 - x - y}°.`) }
      if (kind === 3) { const x = r.int(10, 80); return ask(r, `Two angles make a right angle. One is ${x}°. What is the other?`, deg(90 - x), nums(90 - x, [180 - x, x, 360 - x], { min: 1, fmt: deg }), `A right angle is 90°. 90° − ${x}° = ${90 - x}°.`) }
      const a = r.int(70, 120), b = r.int(60, 110), c = r.int(60, 110); if (a + b + c >= 355) throw new Error('retry')
      return ask(r, `Three angles of a four-sided shape are ${a}°, ${b}° and ${c}°. The four angles add up to 360°. What is the fourth angle?`, deg(360 - a - b - c), nums(360 - a - b - c, [180 - a - b - c > 0 ? 180 - a - b - c : 20, a + b + c], { min: 1, fmt: deg }), `360° − ${a}° − ${b}° − ${c}° = ${360 - a - b - c}°.`)
    },
  },
  {
    name: 'Data interpretation', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      const labels = r.shuffle(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).slice(0, 4)
      const values = labels.map(() => r.int(5, 40))
      if (new Set(values).size < 4) throw new Error('retry')
      const visual = { type: 'comparison_bars' as const, items: labels.map((label, i) => ({ label, value: values[i], color: COLUMNS[i] })) }
      const total = values.reduce((a, b) => a + b, 0)
      if (kind === 0) { const best = values.indexOf(Math.max(...values)), least = values.indexOf(Math.min(...values)); return ask(r, `Look at the bars showing cars sold each day. How many more cars were sold on ${labels[best]} than on ${labels[least]}?`, String(values[best] - values[least]), nums(values[best] - values[least], [values[best] + values[least], values[best]], { min: 1 }), `${labels[best]} sold ${values[best]} and ${labels[least]} sold ${values[least]}. ${values[best]} − ${values[least]} = ${values[best] - values[least]}.`, visual) }
      if (kind === 1) return ask(r, 'Look at the bars showing cars sold each day. How many cars were sold in total?', String(total), nums(total, [total - values[0], Math.max(...values)], { min: 1 }), `Add the bars: ${values.join(' + ')} = ${total}.`, visual)
      if (kind === 2) { const [n1] = twoNames(r); const scores = r.shuffle([12, 14, 15, 16, 18, 20, 22, 24, 9, 11]).slice(0, 4); const sum = scores.reduce((a, b) => a + b, 0); return ask(r, `${n1} scored ${scores.join(', ')} in four games. What is the total score?`, String(sum), nums(sum, [sum - 10, sum + 10, Math.max(...scores)], { min: 1 }), `${scores.join(' + ')} = ${sum}.`) }
      const best = values.indexOf(Math.max(...values))
      return ask(r, 'Look at the bars showing cars sold each day. On which day were the most cars sold?', labels[best], labels.filter((_, i) => i !== best), `${labels[best]} has the longest bar (${values[best]}), so the most cars were sold then.`, visual)
    },
  },
  {
    name: 'Multi-step reasoning problems', count: 4, make: (r) => {
      const [n1, n2] = twoNames(r)
      const t = r.pick(THINGS)
      const kind = r.int(0, 7)
      if (kind === 0) { const n = r.int(3, 9), start = r.int(5, 40); const total = n * start + (n * (n - 1)) / 2; return ask(r, `What is the sum of ${n} consecutive whole numbers starting at ${start}?`, String(total), nums(total, [n * start, n * (start + n), total + n], { min: 1 }), `The numbers are ${Array.from({ length: n }, (_, i) => start + i).join(', ')}. Their sum is ${total}.`) }
      if (kind === 1) { const price = r.int(3, 9), n = r.int(3, 7), price2 = r.int(2, 8), m = r.int(2, 5), paid = 10 * Math.ceil((price * n + price2 * m + 1) / 10); return ask(r, `${n1} buys ${n} ${t.many} at $${price} each and ${m} pens at $${price2} each. ${n1} pays with $${paid}. How much change is given?`, `$${paid - price * n - price2 * m}`, nums(paid - price * n - price2 * m, [price * n + price2 * m, paid - price * n], { min: 0, fmt: (v) => `$${v}` }), `${n} × $${price} = $${price * n} and ${m} × $${price2} = $${price2 * m}. Total $${price * n + price2 * m}. Change: $${paid - price * n - price2 * m}.`) }
      if (kind === 2) { const a = r.int(6, 12), yrs = r.int(3, 8), mult = r.int(2, 4); return ask(r, `${n1} is ${a} years old and ${n2} is ${mult} times as old. How old will ${n2} be in ${yrs} years?`, String(a * mult + yrs), nums(a * mult + yrs, [a * mult, a + yrs, (a + yrs) * mult], { min: 1 }), `${n2} is ${a} × ${mult} = ${a * mult} now. In ${yrs} years: ${a * mult + yrs}.`) }
      if (kind === 3) { const whole = r.pick([24, 36, 48, 60, 72, 120]); const spent1 = whole / 4, left1 = whole - spent1; const spent2 = left1 / 3; if (!Number.isInteger(spent2)) throw new Error('retry'); return ask(r, `${n1} has $${whole}. ${n1} spends 1/4 of it, then spends 1/3 of the money that is left. How much money does ${n1} have now?`, `$${left1 - spent2}`, nums(left1 - spent2, [left1, whole - spent1 - whole / 3, whole / 12], { min: 1, fmt: (v) => `$${v}` }), `1/4 of ${whole} is ${spent1}, leaving ${left1}. 1/3 of ${left1} is ${spent2}. ${left1} − ${spent2} = ${left1 - spent2}.`) }
      if (kind === 4) { const speed = r.int(40, 80), h = r.int(2, 5), back = r.int(30, 90); return ask(r, `A car drives at ${speed} km/h for ${h} hours. Then it drives ${back} km back. How far is it from its start?`, `${speed * h - back} km`, nums(speed * h - back, [speed * h + back, speed * h], { min: 1, fmt: (v) => `${v} km` }), `${speed} × ${h} = ${speed * h} km out. ${speed * h} − ${back} = ${speed * h - back} km from the start.`) }
      if (kind === 5) { const girls = r.int(8, 20), diff = r.int(2, 6), boys = girls + diff; return ask(r, `There are ${boys} boys in a club. There are ${diff} fewer girls than boys. How many children are in the club?`, String(boys + girls), nums(boys + girls, [boys + diff, boys - diff, girls], { min: 1 }), `Girls: ${boys} − ${diff} = ${girls}. Total: ${boys} + ${girls} = ${boys + girls}.`) }
      if (kind === 6) { const rows = r.int(4, 9), cols = r.int(4, 9), removed = r.int(2, rows); return ask(r, `A hall has ${rows} rows of ${cols} chairs. ${removed} chairs are taken away. How many chairs are left?`, String(rows * cols - removed), nums(rows * cols - removed, [rows * cols, rows + cols - removed, rows * cols + removed], { min: 1 }), `${rows} × ${cols} = ${rows * cols}. ${rows * cols} − ${removed} = ${rows * cols - removed}.`) }
      const a = r.int(2, 5), people = r.int(5, 12); const total = (people * (people - 1)) / 2
      return ask(r, `${people} friends each shake hands once with every other friend. How many handshakes are there?`, String(total), nums(total, [people * (people - 1), people * a, total + people], { min: 1 }), `Each of ${people} friends shakes hands with ${people - 1} others, but each handshake is counted twice: ${people} × ${people - 1} ÷ 2 = ${total}.`)
    },
  },
]

