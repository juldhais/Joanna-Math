import { Apple, Bird, Circle, Cookie, Diamond, Flower, Heart, Moon, Square, Star, Triangle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { VisualMetadata } from '../types/quiz'

const iconMap: Record<string, LucideIcon> = { apple: Apple, bird: Bird, circle: Circle, cookie: Cookie, diamond: Diamond, flower: Flower, heart: Heart, moon: Moon, square: Square, star: Star, triangle: Triangle, rectangle: Square }

export function VisualHelper({ visual }: { visual?: VisualMetadata }) {
  if (!visual) return null

  if (visual.type === 'icons') return (
    <div className="visual-box visual-icons" aria-label="Question illustration">
      {visual.items.map((item, groupIndex) => {
        const Icon = iconMap[item.icon ?? 'star'] ?? Star
        return <div className="icon-group" key={`${item.icon}-${groupIndex}`}>
          {Array.from({ length: Math.min(item.count ?? 1, 12) }, (_, index) => <Icon key={index} className={item.color ?? 'text-indigo-500'} size={31} strokeWidth={2.2} />)}
        </div>
      })}
    </div>
  )

  if (visual.type === 'sequence') return <div className="visual-box sequence-box" aria-label="Pattern illustration">
    {visual.items.map((item, index) => <span className="sequence-item" key={index}>{item.label ?? '?'}</span>)}
  </div>

  if (visual.type === 'comparison_bars') return <div className="visual-box comparison-box" aria-label="Comparison illustration">
    {visual.items.map((item, index) => <div className="bar-row" key={index}><span>{item.label}</span><div className="bar-track"><div className={`bar-fill ${item.color ?? 'bg-indigo-500'}`} style={{ width: `${Math.min(100, ((item.value ?? 1) / Math.max(...visual.items.map((i) => i.value ?? 1))) * 100)}%` }} /></div><strong>{item.value}</strong></div>)}
  </div>

  return <div className="visual-box shapes-box" aria-label="Shape illustration">
    {visual.items.map((item, index) => {
      const Icon = iconMap[item.icon ?? 'circle'] ?? Circle
      return <div className="shape-item" key={index}><Icon className="text-indigo-500" size={36} strokeWidth={1.8} /><span>{item.label}</span></div>
    })}
  </div>
}
