import { EMOJI, POLYGONS, SHAPES, THINGS, UNIQUE_BY_SIDES, ask, colors, iconGroup, iconsVisual, nums, sequenceVisual, twoNames } from './helpers'
import type { Topic } from './helpers'

export const kindergarten: Topic[] = [
  {
    name: 'Counting objects to 20', count: 3, bank: 25, make: (r) => {
      const t = r.pick(THINGS)
      const [c1, c2] = colors(r, 2)
      const kind = r.int(0, 4)
      if (kind === 0) {
        const n = r.int(1, 12)
        return ask(r, `How many ${t.many} are there?`, String(n), nums(n, [n + 1, n - 1], { min: 1 }), `Count each one once. There are ${n}.`, iconsVisual(iconGroup(t, n, c1)))
      }
      if (kind === 1) {
        const [name] = twoNames(r)
        const n = r.int(1, 12)
        return ask(r, `${name} has some ${t.many}. How many ${t.many} does ${name} have?`, String(n), nums(n, [n + 1, n - 1], { min: 1 }), `Count each one once. ${name} has ${n}.`, iconsVisual(iconGroup(t, n, c1)))
      }
      if (kind === 3) {
        const n = r.int(3, 9)
        return ask(r, `Which group shows exactly ${n} stars?`, '★'.repeat(n), [n + 1, n - 1, n + 2, n - 2].filter((m) => m >= 1).map((m) => '★'.repeat(m)), `Count the stars in each group. Only one group has exactly ${n}.`)
      }
      if (kind === 4) {
        const counts = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
        const most = r.int(0, 1) === 0
        const answer = most ? Math.max(...counts) : Math.min(...counts)
        return ask(r, `Which group has the ${most ? 'MOST' : 'FEWEST'} dots?`, '●'.repeat(answer), counts.filter((c) => c !== answer).map((c) => '●'.repeat(c)), `Count the dots in each group. ${answer} is the ${most ? 'most' : 'fewest'}.`)
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
    name: 'Addition within 10', count: 2, bank: 15, make: (r) => {
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
    name: 'Subtraction within 10', count: 2, bank: 15, make: (r) => {
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
    name: 'Basic shapes', count: 2, bank: 15, make: (r) => {
      const kind = r.int(0, 5)
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
      if (kind === 4) {
        const s = r.pick(UNIQUE_BY_SIDES)
        return ask(r, `Which shape has ${s.sides} corners?`, s.name, ['circle', ...SHAPES.filter((o) => o.sides !== s.sides && o.sides >= 3).map((o) => o.name)].reverse(), `A ${s.name} has ${s.sides} corners (one corner for each side).`)
      }
      if (kind === 5) {
        const rolls = r.pick(['Sphere (ball)', 'Cylinder (can)'])
        const flat = r.shuffle(['Cube (block)', 'Flat square', 'Rectangle box', 'Triangle block'])
        return ask(r, 'Which shape can roll easily?', rolls, flat, `A curved shape such as a ${rolls.toLowerCase()} rolls. Shapes with flat faces and corners do not roll easily.`)
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
    name: 'Add and subtract within 10, two steps', count: 1, bank: 10, make: (r) => {
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
  {
    name: 'Number order and skip counting', count: 2, bank: 20, make: (r) => {
      const kind = r.int(0, 5)
      if (kind === 0) {
        const a = r.int(1, 16)
        return ask(r, `Which number comes next? ${a}, ${a + 1}, ${a + 2}, __`, String(a + 3), nums(a + 3, [a + 4, a + 2, a], { min: 0 }), `The numbers go up by 1. After ${a + 2} comes ${a + 3}.`, sequenceVisual([a, a + 1, a + 2, '?']))
      }
      if (kind === 1) {
        const n = r.int(2, 20)
        return ask(r, `Which number comes just BEFORE ${n}?`, String(n - 1), nums(n - 1, [n + 1, n - 2, n], { min: 0 }), `Count back one from ${n}. The number before ${n} is ${n - 1}.`)
      }
      if (kind === 2) {
        const n = r.int(1, 19)
        return ask(r, `Which number comes just AFTER ${n}?`, String(n + 1), nums(n + 1, [n - 1, n + 2, n], { min: 0 }), `Count on one from ${n}. The number after ${n} is ${n + 1}.`)
      }
      if (kind === 3) {
        const a = r.int(1, 18)
        return ask(r, `Which number is between ${a} and ${a + 2}?`, String(a + 1), nums(a + 1, [a, a + 2, a + 3], { min: 0 }), `${a}, ${a + 1}, ${a + 2}. The number in the middle is ${a + 1}.`)
      }
      if (kind === 4) {
        const step = r.pick([2, 5, 10])
        const shown = [step, step * 2, step * 3]
        const answer = step * 4
        return ask(r, `Complete the counting sequence: ${shown.join(', ')}, __`, String(answer), nums(answer, [answer + 1, answer - 1, shown[2] + 1], { min: 0 }), `Count on by ${step} each time. ${shown[2]} + ${step} = ${answer}.`, sequenceVisual([...shown, '?']))
      }
      const n = r.int(4, 20)
      return ask(r, `Count back. What comes next? ${n}, ${n - 1}, ${n - 2}, __`, String(n - 3), nums(n - 3, [n - 4, n - 1, n - 2], { min: 0 }), `The numbers go down by 1. After ${n - 2} comes ${n - 3}.`, sequenceVisual([n, n - 1, n - 2, '?']))
    },
  },
  {
    name: 'Everyday word problems', count: 2, bank: 30, make: (r) => {
      const kind = r.int(0, 8)
      const [name, other] = twoNames(r)
      if (kind === 0) {
        const creature = r.pick([{ many: 'ants', one: 'ant', legs: 6 }, { many: 'spiders', one: 'spider', legs: 8 }, { many: 'cats', one: 'cat', legs: 4 }, { many: 'birds', one: 'bird', legs: 2 }, { many: 'bees', one: 'bee', legs: 6 }])
        const n = r.int(2, 3)
        const total = creature.legs * n
        return ask(r, `A ${creature.one} has ${creature.legs} legs. How many legs do ${n} ${creature.many} have altogether?`, String(total), nums(total, [creature.legs + n, creature.legs, total + creature.legs], { min: 1 }), `${n} groups of ${creature.legs}: ${Array(n).fill(creature.legs).join(' + ')} = ${total}.`)
      }
      if (kind === 1) {
        const s = r.pick([{ name: 'triangle', plural: 'triangles', corners: 3 }, { name: 'square', plural: 'squares', corners: 4 }, { name: 'rectangle', plural: 'rectangles', corners: 4 }])
        const n = r.int(2, 4)
        const total = s.corners * n
        return ask(r, `A ${s.name} has ${s.corners} corners. How many corners do ${n} ${s.plural} have altogether?`, String(total), nums(total, [s.corners + n, total + 1, total - 1], { min: 1 }), `${n} groups of ${s.corners}: ${Array(n).fill(s.corners).join(' + ')} = ${total}.`)
      }
      if (kind === 2) {
        const a = r.int(1, 7)
        const b = r.int(1, 10 - a)
        return ask(r, `There are ${a} ducks in a pond. ${b} more ducks join them. How many ducks are there now?`, String(a + b), nums(a + b, [a, b, a + b + 1], { min: 0 }), `${a} + ${b} = ${a + b}.`)
      }
      if (kind === 3) {
        const total = r.int(5, 10)
        const used = r.int(1, total - 1)
        return ask(r, `You have ${total} blocks and use ${used} to build a tower. How many blocks are not used?`, String(total - used), nums(total - used, [total + used, used, total], { min: 0 }), `${total} − ${used} = ${total - used}.`)
      }
      if (kind === 4) {
        const a = r.int(4, 10)
        const b = r.int(1, a - 1)
        return ask(r, `${name} has ${a} shells. ${name} gives ${b} to a friend. How many shells does ${name} have left?`, String(a - b), nums(a - b, [a + b, b, a - b + 1], { min: 0 }), `${a} − ${b} = ${a - b}.`)
      }
      if (kind === 5) {
        const kids = r.int(2, 5)
        const each = r.int(1, 4)
        const total = kids * each
        return ask(r, `If you share ${total} cookies equally between ${kids} children, how many does each child get?`, String(each), nums(each, [total, kids, each + 1], { min: 1 }), `Share ${total} equally into ${kids} groups: ${total} ÷ ${kids} = ${each}.`)
      }
      if (kind === 6) {
        const cost = r.int(4, 10)
        const have = r.int(1, cost - 1)
        return ask(r, `A toy costs ${cost} coins. ${name} has ${have} coins. How many more coins does ${name} need?`, String(cost - have), nums(cost - have, [cost + have, have, cost], { min: 1 }), `${cost} − ${have} = ${cost - have} more coins.`)
      }
      if (kind === 7) {
        const n = r.int(4, 10)
        return ask(r, `There are ${n} children in a line. ${name} is first and ${other} is last. How many children are between them?`, String(n - 2), nums(n - 2, [n, n - 1, n - 3], { min: 0 }), `Take away the first and the last child: ${n} − 2 = ${n - 2}.`)
      }
      const a = r.int(1, 6)
      const b = r.int(1, 10 - a)
      const [c1, c2] = r.pick([['red', 'blue'], ['green', 'yellow'], ['red', 'green']])
      return ask(r, `There are ${a} ${c1} blocks and ${b} ${c2} block${b === 1 ? '' : 's'}. How many blocks are there altogether?`, String(a + b), nums(a + b, [a, b, a + b + 1], { min: 0 }), `${a} + ${b} = ${a + b}.`)
    },
  },
  {
    name: 'Measurement, days and time', count: 2, bank: 30, make: (r) => {
      const kind = r.int(0, 4)
      if (kind === 0) {
        const items = r.shuffle(['pencil', 'crayon', 'straw', 'ribbon', 'stick', 'rope']).slice(0, 4)
        const lengths = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15]).slice(0, 4)
        const shortest = r.int(0, 1) === 0
        const best = shortest ? Math.min(...lengths) : Math.max(...lengths)
        const labels = items.map((item, i) => `${lengths[i]} cm ${item}`)
        const answerIndex = lengths.indexOf(best)
        return ask(r, `Which item is the ${shortest ? 'shortest' : 'longest'}?`, labels[answerIndex], labels.filter((_, i) => i !== answerIndex), `Compare the lengths. ${best} cm is the ${shortest ? 'shortest' : 'longest'}.`)
      }
      if (kind === 1) {
        const [a, b, c] = r.shuffle(['Ben', 'Ana', 'Jo', 'Sam', 'Mia', 'Lee', 'Zoe', 'Tom'])
        const ask3 = r.int(0, 2)
        const question = ['Who is the tallest?', 'Who is the shortest?', 'Who is in the middle?'][ask3]
        const answer = [a, c, b][ask3]
        return ask(r, `${a} is taller than ${b}. ${b} is taller than ${c}. ${question}`, answer, [a, b, c, 'It cannot be told'].filter((o) => o !== answer), `Order them from tallest to shortest: ${a}, ${b}, ${c}. ${answer} is the answer.`)
      }
      if (kind === 2) {
        const heavy = ['A large book', 'A brick', 'A bag of rice', 'A watermelon', 'A bucket of sand', 'A bicycle']
        const light = ['A feather', 'An empty paper', 'A leaf', 'A balloon', 'A coin', 'A button']
        const heaviest = r.int(0, 1) === 0
        const answer = r.pick(heaviest ? heavy : light)
        const wrong = r.shuffle(heaviest ? light : heavy).slice(0, 3)
        return ask(r, `Which item is likely to be the ${heaviest ? 'heaviest' : 'lightest'}?`, answer, wrong, `${answer} is ${heaviest ? 'much heavier' : 'much lighter'} than the others.`)
      }
      if (kind === 3) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const i = r.int(0, 6)
        const type = r.int(0, 2)
        const offset = type === 0 ? 1 : type === 1 ? -1 : 2
        const answer = days[(i + offset + 7) % 7]
        const prompt = type === 0 ? `If today is ${days[i]}, what day comes next?` : type === 1 ? `Which day comes just before ${days[i]}?` : `If today is ${days[i]}, what day is it in two days?`
        return ask(r, prompt, answer, r.shuffle(days.filter((d) => d !== answer && d !== days[i])), `The days go: ${days.join(', ')}, then Sunday again. The answer is ${answer}.`)
      }
      const hour = r.int(1, 12)
      const label = (h: number) => `${h} o'clock`
      return ask(r, `The clock shows the long hand at 12 and the short hand at ${hour}. What time is it?`, label(hour), [12, 3, 6, 9, 1, 2, 4].filter((h) => h !== hour).map(label), `The long hand at 12 means o'clock. The short hand points to ${hour}, so it is ${hour} o'clock.`)
    },
  },
]
