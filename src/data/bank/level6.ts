import { ask, dec, fractions, gcd, mixed, nums, reduce, twoNames } from './helpers'
import type { Fraction, Topic } from './helpers'

const show = (f: Fraction) => mixed(reduce(f))

export const level6: Topic[] = [
  {
    name: 'Algebraic reasoning', count: 4, make: (r) => {
      const kind = r.int(0, 6)
      const x = r.int(2, 15)
      if (kind === 0) { const a = r.int(2, 9), b = r.int(1, 20); return ask(r, `Solve ${a}x + ${b} = ${a * x + b}. What is x?`, String(x), nums(x, [a * x, a * x + b - a, x + b], { min: 0 }), `Subtract ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}.`) }
      if (kind === 1) { const a = r.int(2, 6), b = r.int(2, 9); if (x <= b) throw new Error('retry'); return ask(r, `Solve ${a}(x − ${b}) = ${a * (x - b)}. What is x?`, String(x), nums(x, [x - b, x + b, a * x], { min: 0 }), `Divide both sides by ${a}: x − ${b} = ${x - b}. Add ${b}: x = ${x}.`) }
      if (kind === 2) { const a = r.int(2, 5), b = r.int(1, 6); if (a - b === 0) throw new Error('retry'); const c = r.int(2, 9); const rhs = (a + b) * x + c, lhs = `${a + b}x + ${c}`; return ask(r, `Solve ${lhs} = ${rhs}. What is x?`, String(x), nums(x, [x + c, (a + b) * x - a, rhs - c], { min: 0 }), `Subtract ${c}: ${a + b}x = ${(a + b) * x}. Divide by ${a + b}: x = ${x}.`) }
      if (kind === 3) { const a = r.int(3, 9), d = r.int(2, 9), n = r.int(10, 25); const nth = a + (n - 1) * d; return ask(r, `A sequence starts ${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, … What is the ${n}th term?`, String(nth), nums(nth, [a + n * d, a + d * n - d * 2, n * d, nth + d], { min: 1 }), `The terms go up by ${d}. The nth term is ${a} + (n − 1) × ${d}. For n = ${n}: ${a} + ${n - 1} × ${d} = ${nth}.`) }
      if (kind === 4) { const a = r.int(2, 6), b = r.int(2, 9); return ask(r, `Expand and simplify ${a}(x + ${b}).`, `${a}x + ${a * b}`, [`${a}x + ${b}`, `x + ${a * b}`, `${a + 1}x + ${a * b}`, `${a}x + ${a + b}`], `Multiply each term by ${a}: ${a} × x = ${a}x and ${a} × ${b} = ${a * b}.`) }
      if (kind === 5) { const y = r.int(1, x - 1); return ask(r, `x + y = ${x + y} and x − y = ${x - y}. What is x?`, String(x), nums(x, [y, x + y, x - y, x + 1], { min: 0 }), `Add the equations: 2x = ${2 * x}, so x = ${x}.`) }
      const a = r.int(2, 5), b = r.int(2, 9), n = r.int(2, 7); const value = a * n * n - b
      return ask(r, `Find the value of ${a}n² − ${b} when n = ${n}.`, String(value), nums(value, [(a * n) ** 2 - b, a * n * 2 - b, a * n * n + b], { min: -50 }), `n² = ${n * n}. ${a} × ${n * n} = ${a * n * n}. ${a * n * n} − ${b} = ${value}.`)
    },
  },
  {
    name: 'Proportional reasoning, rates and speed', count: 3, make: (r) => {
      const kind = r.int(0, 4)
      const [n1] = twoNames(r)
      if (kind === 0) { const speed = r.pick([12, 18, 24, 30, 36, 45, 60, 72]), h1 = r.pick([2, 3, 4, 5]), h2 = r.int(6, 9); return ask(r, `A car travels ${speed * h1} km in ${h1} hours at a constant speed. How far does it travel in ${h2} hours?`, `${speed * h2} km`, nums(speed * h2, [speed * h1 + h2, speed + h2, speed * h1 * 2], { min: 1, fmt: (n) => `${n} km` }), `Speed = ${speed * h1} ÷ ${h1} = ${speed} km/h. In ${h2} hours: ${speed} × ${h2} = ${speed * h2} km.`) }
      if (kind === 1) { const d1 = r.int(2, 5) * 30, s1 = r.pick([30, 40, 60]), d2 = r.int(2, 5) * 40, s2 = r.pick([40, 50, 80]); const t1 = d1 / s1, t2 = d2 / s2; if (!Number.isInteger(t1) || !Number.isInteger(t2)) throw new Error('retry'); const avg = (d1 + d2) / (t1 + t2); if (!Number.isInteger(avg)) throw new Error('retry'); return ask(r, `${n1} drives ${d1} km at ${s1} km/h, then ${d2} km at ${s2} km/h. What is the average speed for the whole trip?`, `${avg} km/h`, nums(avg, [(s1 + s2) / 2, s1 + s2 - avg, avg + 5], { min: 1, fmt: (n) => `${dec(n, 1)} km/h` }), `Time: ${d1} ÷ ${s1} = ${t1} h and ${d2} ÷ ${s2} = ${t2} h. Average = ${d1 + d2} ÷ ${t1 + t2} = ${avg} km/h.`) }
      if (kind === 2) { const kmh = r.pick([18, 36, 54, 72, 90, 108]); return ask(r, `A cyclist rides at ${kmh} km/h. What is that speed in metres per second?`, `${kmh / 3.6} m/s`, nums(kmh / 3.6, [kmh / 36, kmh * 3.6, kmh / 6], { min: 1, fmt: (n) => `${dec(n, 1)} m/s` }), `${kmh} km/h = ${kmh * 1000} m per ${3600} s = ${kmh / 3.6} m/s.`) }
      if (kind === 3) { const rate = r.pick([15, 20, 25, 30, 40]), m1 = r.int(2, 6) * 5, m2 = m1 + r.pick([10, 15, 20, 25]); return ask(r, `A tap fills ${rate * m1} litres in ${m1} minutes. How many litres does it fill in ${m2} minutes?`, `${rate * m2} litres`, nums(rate * m2, [rate * m1 + m2 - m1, rate + m2], { min: 1, fmt: (n) => `${n} litres` }), `It fills ${rate} litres each minute. ${rate} × ${m2} = ${rate * m2} litres.`) }
      const w1 = r.int(3, 8), d1 = r.int(4, 12), w2 = r.pick([2, 4, 6, 9, 12]); const total = w1 * d1; if (total % w2 !== 0) throw new Error('retry')
      return ask(r, `${w1} workers finish a job in ${d1} days. At the same rate, how many days would ${w2} workers take?`, String(total / w2), nums(total / w2, [d1 + w1 - w2, d1 * w2 / w1, w1 + d1], { min: 1 }), `The job needs ${w1} × ${d1} = ${total} worker-days. ${total} ÷ ${w2} = ${total / w2} days.`)
    },
  },
  {
    name: 'Percentages: successive and reverse', count: 3, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) { const base = r.pick([100, 200, 400, 500, 250]), up = r.pick([10, 20, 25, 50]), down = r.pick([10, 20, 25, 50]); const result = (base * (100 + up) * (100 - down)) / 10000; if (!Number.isInteger(result)) throw new Error('retry'); return ask(r, `A price of $${base} is increased by ${up}% and the new price is then decreased by ${down}%. What is the final price?`, `$${dec(result)}`, nums(result, [base + (base * (up - down)) / 100, (base * (100 + up)) / 100, (base * (100 - down)) / 100], { min: 1, fmt: (n) => `$${dec(n)}` }), `After the increase: $${(base * (100 + up)) / 100}. Then ${down}% off: $${(base * (100 + up)) / 100} × ${(100 - down) / 100} = $${dec(result)}.`) }
      if (kind === 1) { const orig = r.pick([50, 80, 120, 200, 250, 400]), p = r.pick([20, 25, 10, 40, 50]); const sale = (orig * (100 - p)) / 100; if (!Number.isInteger(sale)) throw new Error('retry'); return ask(r, `After a ${p}% discount, a bag costs $${sale}. What was the original price?`, `$${orig}`, nums(orig, [sale + (sale * p) / 100, sale + p, sale * 2], { min: 1, fmt: (n) => `$${dec(n)}` }), `$${sale} is ${100 - p}% of the original price. Original = $${sale} ÷ ${(100 - p) / 100} = $${orig}.`) }
      if (kind === 2) { const orig = r.pick([40, 60, 80, 120, 200]), p = r.pick([25, 20, 50, 10]); const up = orig + (orig * p) / 100; if (!Number.isInteger(up)) throw new Error('retry'); return ask(r, `A number is increased by ${p}% to give ${up}. What was the number?`, String(orig), nums(orig, [up - p, up - (up * p) / 100, up / 2], { min: 1 }), `${up} is ${100 + p}% of the number. The number is ${up} ÷ ${(100 + p) / 100} = ${orig}.`) }
      const base = r.pick([200, 400, 800, 1000]), p = r.pick([10, 20, 25]); const result = (base * (100 + p) * (100 + p)) / 10000
      if (!Number.isInteger(result * 4)) throw new Error('retry')
      return ask(r, `A town has ${base} people. Its population grows by ${p}% each year for 2 years. What is the population after 2 years?`, dec(result), nums(result, [base + (2 * base * p) / 100, base * (1 + p / 100), base + p * 2], { min: 1, fmt: (n) => dec(n) }), `Year 1: ${base} × ${(100 + p) / 100} = ${(base * (100 + p)) / 100}. Year 2: ${(base * (100 + p)) / 100} × ${(100 + p) / 100} = ${dec(result)}.`)
    },
  },
  {
    name: 'Geometry: angles, area and composite shapes', count: 3, make: (r) => {
      const kind = r.int(0, 7)
      if (kind === 0) { const n = r.int(5, 12); return ask(r, `What is the sum of the interior angles of a polygon with ${n} sides?`, `${(n - 2) * 180}°`, nums((n - 2) * 180, [n * 180, (n - 1) * 180, 360], { min: 100, fmt: (v) => `${v}°` }), `The sum is (n − 2) × 180° = ${n - 2} × 180° = ${(n - 2) * 180}°.`) }
      if (kind === 1) { const n = r.pick([5, 6, 8, 9, 10, 12]); const a = ((n - 2) * 180) / n; return ask(r, `What is the size of one interior angle of a regular polygon with ${n} sides?`, `${dec(a, 0)}°`, nums(a, [360 / n, 180 - 360 / n + 10, 180 / n], { min: 1, fmt: (v) => `${dec(v, 0)}°` }), `The angle sum is ${(n - 2) * 180}°. Divide by ${n}: ${dec(a, 0)}°.`) }
      if (kind === 2) { const b = r.int(4, 20), h = r.int(3, 14) * 2; return ask(r, `A triangle has base ${b} cm and height ${h} cm. What is its area?`, `${(b * h) / 2} cm²`, nums((b * h) / 2, [b * h, b + h, (b * h) / 4], { min: 1, fmt: (n) => `${n} cm²` }), `Area = ½ × base × height = ½ × ${b} × ${h} = ${(b * h) / 2} cm².`) }
      if (kind === 3) { const rad = r.pick([7, 14, 21, 28]); return ask(r, `Take π = 22/7. What is the circumference of a circle with radius ${rad} cm?`, `${2 * 22 * (rad / 7)} cm`, nums(2 * 22 * (rad / 7), [22 * rad * (rad / 7), 22 * (rad / 7), 4 * 22 * (rad / 7)], { min: 1, fmt: (n) => `${n} cm` }), `Circumference = 2πr = 2 × 22/7 × ${rad} = ${2 * 22 * (rad / 7)} cm.`) }
      if (kind === 4) { const L = r.int(8, 16), W = r.int(7, 12), cutL = r.int(2, L - 4), cutW = r.int(2, W - 3); return ask(r, `An L-shape is made by cutting a ${cutL} cm by ${cutW} cm rectangle from the corner of a ${L} cm by ${W} cm rectangle. What is the area of the L-shape?`, `${L * W - cutL * cutW} cm²`, nums(L * W - cutL * cutW, [L * W, cutL * cutW, 2 * (L + W)], { min: 1, fmt: (n) => `${n} cm²` }), `${L} × ${W} = ${L * W}. ${cutL} × ${cutW} = ${cutL * cutW}. ${L * W} − ${cutL * cutW} = ${L * W - cutL * cutW} cm².`) }
      if (kind === 5) { const triples: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]]; const [a, b, c] = r.pick(triples); return ask(r, `A right-angled triangle has two shorter sides of ${a} cm and ${b} cm. How long is the longest side?`, `${c} cm`, nums(c, [a + b, b - a, (a * b) / 2], { min: 1, fmt: (n) => `${n} cm` }), `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, and √${c * c} = ${c}.`) }
      if (kind === 6) { const b = r.int(5, 15), h = r.int(3, 10); return ask(r, `A parallelogram has base ${b} cm and height ${h} cm. What is its area?`, `${b * h} cm²`, nums(b * h, [(b * h) / 2, 2 * (b + h), b + h], { min: 1, fmt: (n) => `${dec(n, 1)} cm²` }), `Area = base × height = ${b} × ${h} = ${b * h} cm².`) }
      const x = r.int(25, 80), y = r.int(30, 80); if (x + y >= 175) throw new Error('retry')
      return ask(r, `In a triangle, one exterior angle is ${x + y}°. The two interior angles not next to it are ${x}° and ${y}°. Which statement is true?`, 'The exterior angle equals the sum of those two angles', ['The exterior angle equals 180° minus their sum', 'The exterior angle is always 90°', 'The exterior angle is smaller than each of them'], `An exterior angle of a triangle equals the sum of the two opposite interior angles: ${x}° + ${y}° = ${x + y}°.`)
    },
  },
  {
    name: 'Statistics: mean, median and mode', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      const list = Array.from({ length: r.pick([5, 7]) }, () => r.int(2, 20))
      const sorted = [...list].sort((a, b) => a - b)
      const total = list.reduce((a, b) => a + b, 0)
      if (kind === 0) { const n = list.length, mean = total / n; if (!Number.isInteger(mean)) throw new Error('retry'); return ask(r, `Find the mean of ${list.join(', ')}.`, String(mean), nums(mean, [sorted[(n - 1) / 2], total, Math.max(...list)], { min: 1, fmt: (v) => dec(v, 1) }), `Total = ${total}. Mean = ${total} ÷ ${n} = ${mean}.`) }
      if (kind === 1) { const n = list.length, median = sorted[(n - 1) / 2]; return ask(r, `Find the median of ${list.join(', ')}.`, String(median), nums(median, [list[(n - 1) / 2], total / n, Math.max(...list)], { min: 1, fmt: (v) => dec(v, 1) }), `In order: ${sorted.join(', ')}. The middle value is ${median}.`) }
      if (kind === 2) { const mode = r.int(3, 15), others = r.shuffle([2, 4, 5, 6, 8, 9, 10, 12, 14, 16, 18].filter((v) => v !== mode)).slice(0, 4); const data = r.shuffle([mode, mode, mode, ...others]); return ask(r, `What is the mode of ${data.join(', ')}?`, String(mode), others.map(String), `${mode} appears most often (3 times), so it is the mode.`) }
      if (kind === 3) { const mean = r.int(8, 20), known = Array.from({ length: 4 }, () => r.int(mean - 5, mean + 5)); const fifth = mean * 5 - known.reduce((a, b) => a + b, 0); if (fifth < 1) throw new Error('retry'); return ask(r, `The mean of five numbers is ${mean}. Four of the numbers are ${known.join(', ')}. What is the fifth number?`, String(fifth), nums(fifth, [mean, known.reduce((a, b) => a + b, 0), fifth + 1], { min: 1 }), `The total is 5 × ${mean} = ${mean * 5}. The four numbers add to ${known.reduce((a, b) => a + b, 0)}. So the fifth is ${fifth}.`) }
      const range = Math.max(...list) - Math.min(...list); if (range === 0) throw new Error('retry')
      return ask(r, `Find the range of ${list.join(', ')}.`, String(range), nums(range, [Math.max(...list), Math.min(...list), total / list.length], { min: 1, fmt: (v) => dec(v, 1) }), `Range = largest − smallest = ${Math.max(...list)} − ${Math.min(...list)} = ${range}.`)
    },
  },
  {
    name: 'Probability of combined events', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      if (kind === 0) { const target = r.int(2, 12); const ways = [0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1][target]; return ask(r, `Two fair dice are rolled. What is the probability that the total is ${target}?`, show([ways, 36]), fractions(reduce([ways, 36]), [[ways, 12], [1, 6], [ways + 1, 36], [ways, 6]]), `There are 36 equally likely outcomes. ${ways} of them give a total of ${target}, so the probability is ${ways}/36 = ${show([ways, 36])}.`) }
      if (kind === 1) { const a = r.int(1, 5), b = r.int(2, 6), c = r.int(1, 4), d = r.int(2, 6); if (a >= b || c >= d) throw new Error('retry'); const top = a * c, bottom = b * d; return ask(r, `Event A has probability ${a}/${b} and event B has probability ${c}/${d}. They are independent. What is the probability that both happen?`, show([top, bottom]), fractions(reduce([top, bottom]), [[a * d + b * c, b * d], [a + c, b + d], [a, b]]), `Multiply: ${a}/${b} × ${c}/${d} = ${top}/${bottom} = ${show([top, bottom])}.`) }
      if (kind === 2) { const red = r.int(2, 6), blue = r.int(2, 6); const total = red + blue; return ask(r, `A bag has ${red} red and ${blue} blue counters. Two counters are taken out without replacement. What is the probability that both are red?`, show([red * (red - 1), total * (total - 1)]), fractions(reduce([red * (red - 1), total * (total - 1)]), [[red * red, total * total], [red, total], [red - 1, total - 1]]), `First red: ${red}/${total}. Then ${red - 1} red remain out of ${total - 1}. ${red}/${total} × ${red - 1}/${total - 1} = ${show([red * (red - 1), total * (total - 1)])}.`) }
      const face = r.int(1, 6)
      return ask(r, `A fair coin is tossed and a fair die is rolled. What is the probability of getting heads and a ${face}?`, '1/12', ['1/6', '1/2', '1/8', '7/12'], `Heads is 1/2 and rolling a ${face} is 1/6. 1/2 × 1/6 = 1/12.`)
    },
  },
  {
    name: 'Olympiad-style multi-step problems', count: 3, make: (r) => {
      const kind = r.int(0, 7)
      if (kind === 0) { const n = r.int(6, 14); const d = (n * (n - 3)) / 2; return ask(r, `How many diagonals does a polygon with ${n} sides have?`, String(d), nums(d, [n * (n - 3), n * (n - 1) / 2, n * (n - 2) / 2], { min: 1 }), `Each corner joins to ${n - 3} others by a diagonal, and each diagonal is counted twice: ${n} × ${n - 3} ÷ 2 = ${d}.`) }
      if (kind === 1) { const base = r.pick([2, 3, 7, 8, 9]), pow = r.int(20, 60); const cycle: Record<number, number[]> = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6], 9: [9, 1] }; const c = cycle[base]; const ans = c[(pow - 1) % c.length]; return ask(r, `What is the units digit of ${base}^${pow}?`, String(ans), [...new Set([...c, 0, 5].filter((v) => v !== ans))].map(String), `The units digits of powers of ${base} repeat in the cycle ${c.join(', ')}. Position ${((pow - 1) % c.length) + 1} in the cycle gives ${ans}.`) }
      if (kind === 2) { const n = r.int(20, 100); const answer = Math.floor(n / 5) + Math.floor(n / 25) + Math.floor(n / 125); return ask(r, `How many zeros are at the end of ${n}! (n factorial = 1 × 2 × … × ${n})?`, String(answer), nums(answer, [Math.floor(n / 5), Math.floor(n / 10), answer + 1], { min: 0 }), `Count the factors of 5: ${Math.floor(n / 5)} multiples of 5, plus ${Math.floor(n / 25)} extra from multiples of 25${n >= 125 ? ', plus more from 125' : ''}. Total ${answer}.`) }
      if (kind === 3) { const colors = r.int(2, 6); return ask(r, `A drawer has socks in ${colors} different colours. What is the smallest number of socks you must take out, without looking, to be sure of getting a matching pair?`, String(colors + 1), nums(colors + 1, [colors * 2, colors, colors - 1 > 0 ? colors - 1 : colors + 3], { min: 2 }), `In the worst case you pick one sock of each colour (${colors} socks). The next sock must match one of them, so ${colors + 1}.`) }
      if (kind === 4) { const n = r.int(10, 40); const total = (n * (n + 1)) / 2; return ask(r, `What is 1 + 2 + 3 + … + ${n}?`, String(total), nums(total, [n * n, total + n, total - n], { min: 1 }), `Pair the numbers: the sum is ${n} × ${n + 1} ÷ 2 = ${total}.`) }
      if (kind === 5) { const a = r.int(2, 9), n = r.int(30, 99), count = Math.floor(n / a); return ask(r, `How many whole numbers from 1 to ${n} are divisible by ${a}?`, String(count), nums(count, [count + 1, count - 1, n - a], { min: 1 }), `${n} ÷ ${a} = ${dec(n / a, 2)}, so there are ${count} multiples.`) }
      if (kind === 6) { const girls = r.int(4, 12), boys = r.int(5, 14), extraGirls = r.int(2, 6); const left = girls + boys; const ratioG = girls + extraGirls; return ask(r, `A class has ${girls} girls and ${boys} boys. ${extraGirls} more girls join the class. What fraction of the class is now girls?`, show([ratioG, left + extraGirls]), fractions(reduce([ratioG, left + extraGirls]), [[girls, left], [extraGirls, left + extraGirls], [ratioG, left]]), `Girls: ${girls} + ${extraGirls} = ${ratioG}. Class: ${left} + ${extraGirls} = ${left + extraGirls}. So the fraction is ${ratioG}/${left + extraGirls}${gcd(ratioG, left + extraGirls) > 1 ? ` = ${show([ratioG, left + extraGirls])}` : ''}.`) }
      const cuts = r.int(2, 9); const pieces = cuts + 1
      return ask(r, `A log is cut in a straight line into ${pieces} equal pieces. Each cut takes ${r.int(2, 6)} minutes. How many cuts are needed?`, String(cuts), nums(cuts, [pieces, pieces * 2, cuts - 1 > 0 ? cuts - 1 : cuts + 2], { min: 1 }), `${pieces} pieces need ${pieces} − 1 = ${cuts} cuts.`)
    },
  },
]

