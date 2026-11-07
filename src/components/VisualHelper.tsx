import { ICON_MAP, MAX_ICON_COUNT, resolveIconName } from '../data/icons'
import type { VisualMetadata } from '../types/quiz'

export function VisualHelper({ visual }: { visual?: VisualMetadata }) {
  if (!visual || !Array.isArray(visual.items)) return null

  if (visual.type === 'icons') return (
    <div className="visual-box visual-icons" aria-label="Question illustration">
      {visual.items.map((item, groupIndex) => {
        const name = resolveIconName(item.icon)
        if (!name) return null
        const Icon = ICON_MAP[name]
        return <div className="icon-group" key={`${name}-${groupIndex}`}>
          {Array.from({ length: Math.min(Math.max(Math.floor(item.count ?? 1), 1), MAX_ICON_COUNT) }, (_, index) => <Icon key={index} className={item.color ?? 'text-indigo-500'} size={31} strokeWidth={2.2} />)}
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
      const name = resolveIconName(item.icon)
      if (!name) return null
      const Icon = ICON_MAP[name]
      return <div className="shape-item" key={index}><Icon className="text-indigo-500" size={36} strokeWidth={1.8} /><span>{item.label}</span></div>
    })}
  </div>
}
