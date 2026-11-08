import { THINGS, ask, dec, fractions, gcd, mixed, nums, reduce, twoNames } from './helpers'
import type { Fraction, Topic } from './helpers'

const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n))
const percent = (n: number) => `${dec(n, 1)}%`
const point = (x: number, y: number) => `(${signed(x)}, ${signed(y)})`

export const level5: Topic[] = [
  {
    name: 'Percentages', count: 3, make: (r) => {
      const kind = r.int(0, 4)
      const [n1] = twoNames(r)
      if (kind === 0) { const p = r.pick([10, 20, 25, 30, 40, 50, 60, 75, 5, 15]), base = r.pick([40, 60, 80, 120, 160, 200, 240, 360, 400]); const ans = (p * base) / 100; return ask(r, `What is ${p}% of ${base}?`, dec(ans), nums(ans, [base / p, p + base, ans * 2, 100 - p], { min: 0, fmt: (n) => dec(n) }), `${p}% of ${base} = ${p}/100 × ${base} = ${dec(ans)}.`) }
      if (kind === 1) { const p = r.pick([10, 20, 25, 30, 40, 50]), price = r.pick([40, 60, 80, 100, 120, 200, 250]); const sale = price - (price * p) / 100; return ask(r, `A jacket costs $${price}. It is on sale for ${p}% off. What is the sale price?`, `$${dec(sale)}`, nums(sale, [(price * p) / 100, price + (price * p) / 100, price - p], { min: 0, fmt: (n) => `$${dec(n)}` }), `${p}% of $${price} = $${dec((price * p) / 100)}. $${price} − $${dec((price * p) / 100)} = $${dec(sale)}.`) }
      if (kind === 2) { const p = r.pick([10, 20, 25, 50]), base = r.pick([40, 80, 120, 200, 400]); const up = base + (base * p) / 100; return ask(r, `${n1}'s savings of $${base} increase by ${p}%. How much are the savings now?`, `$${dec(up)}`, nums(up, [(base * p) / 100, base - (base * p) / 100, base + p], { min: 0, fmt: (n) => `$${dec(n)}` }), `${p}% of $${base} = $${dec((base * p) / 100)}. $${base} + $${dec((base * p) / 100)} = $${dec(up)}.`) }
      if (kind === 3) { const pairs: [number, number][] = [[9, 20], [3, 4], [7, 10], [13, 20], [4, 5], [3, 5], [7, 25], [11, 50], [17, 20], [3, 8], [1, 8], [19, 25]]; const [a, b] = r.pick(pairs); const p = (a / b) * 100; return ask(r, `Write ${a}/${b} as a percentage.`, percent(p), nums(p, [b - a, a * 10, 100 / b, 100 - p], { min: 1, fmt: percent }), `${a}/${b} = ${dec(p, 1)}/100 = ${percent(p)}.`) }
      const total = r.pick([20, 25, 40, 50, 80]), got = r.int(1, total - 1), p = (got / total) * 100
      if (!Number.isInteger(p * 2)) throw new Error('retry')
      return ask(r, `${n1} scored ${got} out of ${total} on a test. What percentage is that?`, percent(p), nums(p, [got, total - got, (total / got) * 10], { min: 1, fmt: percent }), `${got} ÷ ${total} × 100 = ${dec(p, 1)}%.`)
    },
  },
  {
    name: 'Ratio and proportion', count: 3, make: (r) => {
      const kind = r.int(0, 4)
      const t = r.pick(THINGS)
      if (kind === 0) { const n = r.int(3, 8), unit = r.int(2, 9), m = r.int(n + 1, 12); return ask(r, `${n} ${t.many} cost $${n * unit}. How much do ${m} ${t.many} cost?`, `$${m * unit}`, nums(m * unit, [m + unit, n * unit + m - n, (n * unit) / m], { min: 1, fmt: (v) => `$${dec(v)}` }), `One costs $${n * unit} ÷ ${n} = $${unit}. ${m} cost ${m} × $${unit} = $${m * unit}.`) }
      if (kind === 1) { const a = r.int(2, 7), b = r.int(2, 7), c = r.int(2, 7); if (a === b || gcd(a, b) !== 1) throw new Error('retry'); const total = (a + b + c) * r.int(3, 9); const k = total / (a + b + c); return ask(r, `A prize of $${total} is shared in the ratio ${a} : ${b} : ${c}. What is the smallest share?`, `$${Math.min(a, b, c) * k}`, nums(Math.min(a, b, c) * k, [total / 3, k, Math.max(a, b, c) * k], { min: 1, fmt: (v) => `$${dec(v)}` }), `${a} + ${b} + ${c} = ${a + b + c} parts. Each part is $${k}. The smallest share is ${Math.min(a, b, c)} × $${k} = $${Math.min(a, b, c) * k}.`) }
      if (kind === 2) { const scale = r.pick([2, 5, 10, 20, 50]), map = r.int(3, 12); return ask(r, `On a map, 1 cm represents ${scale} km. Two towns are ${map} cm apart on the map. How far apart are they in real life?`, `${map * scale} km`, nums(map * scale, [map + scale, map / scale], { min: 1, fmt: (v) => `${dec(v)} km` }), `${map} × ${scale} = ${map * scale} km.`) }
      if (kind === 3) { const a = r.int(2, 9), b = r.int(2, 9), k = r.int(2, 7); if (a === b) throw new Error('retry'); return ask(r, `${a} : ${b} = ${a * k} : ?`, String(b * k), nums(b * k, [b + k, b + a * k - a, a * k], { min: 1 }), `${a} × ${k} = ${a * k}, so multiply ${b} by ${k} as well: ${b * k}.`) }
      const speed = r.pick([4, 6, 8, 12, 15]), h1 = r.int(2, 5), h2 = r.int(6, 9)
      return ask(r, `A machine makes ${speed * h1} toys in ${h1} hours. How many toys does it make in ${h2} hours at the same rate?`, String(speed * h2), nums(speed * h2, [speed * h1 + h2 - h1, speed + h2], { min: 1 }), `It makes ${speed} toys each hour. ${speed} × ${h2} = ${speed * h2}.`)
    },
  },
  {
    name: 'Integers', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      if (kind === 0) { const a = r.int(-15, -3), b = r.int(8, 25), c = r.int(2, 15); const ans = a + b - c; return ask(r, `Find ${signed(a)} + ${b} − ${c} = ?`, signed(ans), nums(ans, [a - b - c, a + b + c, -ans], { fmt: signed }), `First ${signed(a)} + ${b} = ${signed(a + b)}. Then ${signed(a + b)} − ${c} = ${signed(ans)}.`) }
      if (kind === 1) { const start = r.int(2, 12), drop = r.int(start + 2, start + 14); const end = start - drop; return ask(r, `The temperature is ${start}°C. It falls by ${drop}°C. What is the new temperature?`, `${signed(end)}°C`, nums(end, [drop - start, start + drop, -start], { fmt: (n) => `${signed(n)}°C` }), `${start} − ${drop} = ${signed(end)}°C.`) }
      if (kind === 2) { const a = r.int(-12, -1), b = r.int(-12, -1); if (a === b) throw new Error('retry'); const smaller = Math.min(a, b); return ask(r, `Which is smaller: ${signed(a)} or ${signed(b)}?`, signed(smaller), [signed(Math.max(a, b)), 'They are equal', 'They are both positive'], `On the number line, the number further left is smaller. ${signed(smaller)} is further left.`) }
      if (kind === 3) { const a = r.int(2, 9), b = r.int(2, 9); return ask(r, `Find (−${a}) × ${b} = ?`, signed(-a * b), [String(a * b), signed(-(a + b)), String(a + b), signed(-a * b - b)], `A negative times a positive is negative. ${a} × ${b} = ${a * b}, so the answer is −${a * b}.`) }
      const a = r.int(-9, 9), b = r.int(2, 9), d = a - b
      return ask(r, `Find ${signed(a)} − ${b} = ?`, signed(d), nums(d, [a + b, -(a + b), b - a], { fmt: signed }), `Start at ${signed(a)} and move ${b} steps down: ${signed(d)}.`)
    },
  },
  {
    name: 'Expressions and simple equations', count: 3, make: (r) => {
      const kind = r.int(0, 5)
      const x = r.int(2, 12)
      if (kind === 0) { const a = r.int(3, 20); return ask(r, `Solve x + ${a} = ${x + a}. What is x?`, String(x), nums(x, [x + a + a, x + a, a], { min: 0 }), `Subtract ${a} from both sides: x = ${x + a} − ${a} = ${x}.`) }
      if (kind === 1) { const a = r.int(2, 9); return ask(r, `Solve ${a}x = ${a * x}. What is x?`, String(x), nums(x, [a * x - a, a * x, a], { min: 0 }), `Divide both sides by ${a}: x = ${a * x} ÷ ${a} = ${x}.`) }
      if (kind === 2) { const a = r.int(2, 6), b = r.int(1, 9); return ask(r, `Find the value of ${a}n + ${b} when n = ${x}.`, String(a * x + b), nums(a * x + b, [a + x + b, a * (x + b), a * x - b], { min: 0 }), `${a} × ${x} = ${a * x}. Then ${a * x} + ${b} = ${a * x + b}.`) }
      if (kind === 3) { const a = r.int(2, 9), b = r.int(2, 9); return ask(r, `Simplify ${a}p + ${b}p.`, `${a + b}p`, [`${a * b}p`, `${a + b}p²`, `${a}${b}p`, `${a + b + 1}p`], `Add the like terms: ${a}p + ${b}p = ${a + b}p.`) }
      if (kind === 4) { const a = r.int(2, 6), b = r.int(1, 12); return ask(r, `Solve ${a}x + ${b} = ${a * x + b}. What is x?`, String(x), nums(x, [a * x, a * x + b - a, x + b], { min: 0 }), `Subtract ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}.`) }
      const a = r.int(2, 5), b = r.int(2, 9)
      return ask(r, `A number is multiplied by ${a} and then ${b} is added. The result is ${a * x + b}. What is the number?`, String(x), nums(x, [a * x, a * x + b - a, x + b], { min: 1 }), `Work backwards: ${a * x + b} − ${b} = ${a * x}. Then ${a * x} ÷ ${a} = ${x}.`)
    },
  },
  {
    name: 'Coordinate geometry', count: 2, make: (r) => {
      const kind = r.int(0, 4)
      const x = r.int(-6, 8), y = r.int(-6, 8)
      if (kind === 0) { const dx = r.int(1, 6), dy = r.int(1, 6); return ask(r, `Point A is at ${point(x, y)}. It moves ${dx} units right and ${dy} units up. What are its new coordinates?`, point(x + dx, y + dy), [point(x + dy, y + dx), point(x - dx, y + dy), point(x + dx, y - dy), point(x + dx + dy, y)], `Right adds to x and up adds to y: (${signed(x)} + ${dx}, ${signed(y)} + ${dy}) = ${point(x + dx, y + dy)}.`) }
      if (kind === 1) { if (x === 0 || y === 0) throw new Error('retry'); return ask(r, `The point ${point(x, y)} is reflected in the x-axis. What are its new coordinates?`, point(x, -y), [point(-x, y), point(-x, -y), point(y, x), point(x, y + 1)], `Reflecting in the x-axis changes the sign of the y-coordinate only: ${point(x, -y)}.`) }
      if (kind === 2) { const x2 = x + 2 * r.int(1, 4), y2 = y + 2 * r.int(1, 4); return ask(r, `What is the midpoint of ${point(x, y)} and ${point(x2, y2)}?`, point((x + x2) / 2, (y + y2) / 2), [point(x2 - x, y2 - y), point(x + x2, y + y2), point((x + x2) / 2 + 1, (y + y2) / 2), point((x + x2) / 2, (y + y2) / 2 - 1)], `Average the coordinates: ((${signed(x)} + ${signed(x2)}) ÷ 2, (${signed(y)} + ${signed(y2)}) ÷ 2) = ${point((x + x2) / 2, (y + y2) / 2)}.`) }
      if (kind === 3) { if (x === 0 || y === 0) throw new Error('retry'); const q = x > 0 ? (y > 0 ? 'first' : 'fourth') : y > 0 ? 'second' : 'third'; return ask(r, `In which quadrant is the point ${point(x, y)}?`, `The ${q} quadrant`, ['first', 'second', 'third', 'fourth'].filter((n) => n !== q).map((n) => `The ${n} quadrant`), `x is ${x > 0 ? 'positive' : 'negative'} and y is ${y > 0 ? 'positive' : 'negative'}, which is the ${q} quadrant.`) }
      const len = r.int(3, 9)
      return ask(r, `Points P and Q are at ${point(x, y)} and ${point(x, y + len)}. How far apart are they?`, `${len} units`, nums(len, [len * 2, Math.abs(2 * y + len)], { min: 1, fmt: (n) => `${n} units` }), `They have the same x-coordinate, so the distance is the difference in y: ${len} units.`)
    },
  },
  {
    name: 'Probability of simple events', count: 2, make: (r) => {
      const kind = r.int(0, 3)
      const show = (f: Fraction) => mixed(reduce(f))
      if (kind === 0) { const red = r.int(1, 8), blue = r.int(1, 8), green = r.int(1, 6); const total = red + blue + green; return ask(r, `A bag has ${red} red, ${blue} blue and ${green} green marbles. One marble is picked at random. What is the probability that it is red?`, show([red, total]), fractions(reduce([red, total]), [[red, blue + green], [blue, total], [total - red, total]]), `There are ${red} red marbles out of ${total}, so the probability is ${red}/${total}${gcd(red, total) > 1 ? ` = ${show([red, total])}` : ''}.`) }
      if (kind === 1) { const k = r.int(1, 5); return ask(r, `A fair six-sided die is rolled. What is the probability of rolling a number greater than ${k}?`, show([6 - k, 6]), fractions(reduce([6 - k, 6]), [[k, 6], [6 - k, k], [1, 6]]), `The numbers greater than ${k} are ${Array.from({ length: 6 - k }, (_, i) => k + 1 + i).join(', ')}. That is ${6 - k} out of 6, which is ${show([6 - k, 6])}.`) }
      if (kind === 2) { const red = r.int(2, 9), total = r.int(red + 2, 20); return ask(r, `The probability of picking a red counter is ${red}/${total}. What is the probability of not picking a red counter?`, show([total - red, total]), fractions(reduce([total - red, total]), [[red, total - red], [1, total], [red, total]]), `The two probabilities add up to 1. 1 − ${red}/${total} = ${total - red}/${total}.`) }
      const times = r.pick([40, 60, 100, 120, 200])
      return ask(r, `A fair coin is tossed ${times} times. About how many heads would you expect?`, String(times / 2), nums(times / 2, [times / 4, times, times / 3], { min: 1 }), `Heads has probability 1/2, so expect about ${times} × 1/2 = ${times / 2}.`)
    },
  },
  {
    name: 'Non-routine multi-step problems', count: 5, make: (r) => {
      const [n1, n2] = twoNames(r)
      const kind = r.int(0, 9)
      if (kind === 0) { const people = r.int(5, 14); const total = (people * (people - 1)) / 2; return ask(r, `${people} players each play one game against every other player. How many games are played?`, String(total), nums(total, [people * (people - 1), people * 2, total + people], { min: 1 }), `Each of ${people} players plays ${people - 1} others, and each game is counted twice: ${people} × ${people - 1} ÷ 2 = ${total}.`) }
      if (kind === 1) { const heads = r.int(8, 20), rabbits = r.int(2, heads - 2); const legs = rabbits * 4 + (heads - rabbits) * 2; return ask(r, `A farm has chickens and rabbits. There are ${heads} heads and ${legs} legs in all. How many rabbits are there?`, String(rabbits), nums(rabbits, [heads - rabbits, legs / 4, rabbits + 1], { min: 1 }), `If all were chickens there would be ${heads * 2} legs. The extra ${legs - heads * 2} legs come from rabbits having 2 more each: ${(legs - heads * 2) / 2} rabbits.`) }
      if (kind === 2) { const s = r.int(10, 60), diff = 2 * r.int(2, 10); const total = 2 * s + diff; return ask(r, `Two numbers add up to ${total}. Their difference is ${diff}. What is the larger number?`, String(s + diff), nums(s + diff, [s, total - diff, total / 2], { min: 1 }), `Larger = (${total} + ${diff}) ÷ 2 = ${s + diff}.`) }
      if (kind === 3) { const pairs: [number, number][] = [[6, 3], [12, 6], [10, 15], [20, 5], [30, 20], [12, 4], [15, 10], [24, 8], [8, 8], [9, 18], [14, 7]]; const [a, b] = r.pick(pairs); const t = (a * b) / (a + b); if (!Number.isInteger(t)) throw new Error('retry'); return ask(r, `${n1} can paint a fence in ${a} hours. ${n2} can paint the same fence in ${b} hours. How long will they take working together?`, `${t} hours`, nums(t, [(a + b) / 2, a + b, Math.abs(a - b)], { min: 1, fmt: (n) => `${dec(n, 1)} hours` }), `In one hour they paint 1/${a} + 1/${b} = ${a + b}/${a * b} of the fence, so they need ${a * b}/${a + b} = ${t} hours.`) }
      if (kind === 4) { const sum = r.int(8, 18); const count = Array.from({ length: 90 }, (_, i) => i + 10).filter((n) => Math.floor(n / 10) + (n % 10) === sum).length; return ask(r, `How many two-digit numbers have digits that add up to ${sum}?`, String(count), nums(count, [count + 1, count - 1, sum - 1], { min: 1 }), `List them: the tens digit can be any digit that leaves a single-digit ones digit. There are ${count} such numbers.`) }
      if (kind === 5) { const n = r.int(3, 10); const total = (n * (n + 1)) / 2; return ask(r, `A staircase has ${n} steps. The first step uses 1 block, the second uses 2 blocks, and so on, with each step using 1 more block. How many blocks are used in all?`, String(total), nums(total, [n * n, n * 2, total + n], { min: 1 }), `1 + 2 + … + ${n} = ${n} × ${n + 1} ÷ 2 = ${total}.`) }
      if (kind === 6) { const a = r.int(3, 9), yrs = r.int(2, 6), gap = r.int(10, 30); return ask(r, `${n1} is ${a} years old and ${n2} is ${gap + a} years old. How old will ${n2} be when ${n1} is ${a + yrs}?`, String(gap + a + yrs), nums(gap + a + yrs, [gap + a, a + yrs, gap + yrs], { min: 1 }), `${yrs} years pass for both. ${gap + a} + ${yrs} = ${gap + a + yrs}.`) }
      if (kind === 8) { const a = r.int(3, 7), steps = r.int(4, 8); const pos = steps * a - (steps - 1); return ask(r, `A snail climbs up a wall ${a} cm every minute for ${steps} minutes. It slips back 1 cm at the end of every minute except the last. How far up the wall is it after ${steps} minutes?`, `${pos} cm`, nums(pos, [steps * a, steps * (a - 1), pos + 1], { min: 1, fmt: (n) => `${n} cm` }), `It climbs ${steps} × ${a} = ${steps * a} cm and slips back ${steps - 1} times: ${steps * a} − ${steps - 1} = ${pos} cm.`) }
      if (kind === 7) { const w = r.int(3, 12), l = w + r.int(2, 8), strip = r.int(1, 2); const area = (l - 2 * strip) * (w - 2 * strip); if (w - 2 * strip < 1) throw new Error('retry'); return ask(r, `A ${l} cm by ${w} cm rectangle has a border ${strip} cm wide cut off all the way around. What is the area of the rectangle that is left?`, `${area} cm²`, nums(area, [l * w - area, l * w, (l - strip) * (w - strip)], { min: 1, fmt: (n) => `${n} cm²` }), `The inner rectangle is ${l - 2 * strip} cm by ${w - 2 * strip} cm. ${l - 2 * strip} × ${w - 2 * strip} = ${area} cm².`) }
      const base = r.int(3, 9), more = r.int(3, 9); const total = base * 3 + more * 2
      return ask(r, `${n1} buys 3 notebooks at $${base} each and 2 pens at $${more} each. What is the total cost?`, `$${total}`, nums(total, [base + more, (base + more) * 5, base * 2 + more * 3], { min: 1, fmt: (n) => `$${n}` }), `3 × $${base} = $${base * 3} and 2 × $${more} = $${more * 2}. $${base * 3} + $${more * 2} = $${total}.`)
    },
  },
]

