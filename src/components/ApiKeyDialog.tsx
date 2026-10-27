import { useEffect, useState } from 'react'
import { Eye, EyeOff, KeyRound, X } from 'lucide-react'
import { DEFAULT_MODEL } from '../services/openrouter'

interface ApiKeyDialogProps {
  open: boolean
  onClose: () => void
  onSave: (apiKey: string, model: string) => void
}

export function ApiKeyDialog({ open, onClose, onSave }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    setApiKey(localStorage.getItem('fiso_openrouter_key') ?? '')
    setModel(localStorage.getItem('fiso_openrouter_model') ?? DEFAULT_MODEL)
  }, [open])

  if (!open) return null

  const save = () => {
    onSave(apiKey.trim(), model.trim() || DEFAULT_MODEL)
    onClose()
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="dialog-heading">
          <div className="dialog-icon"><KeyRound size={20} /></div>
          <button className="icon-button" onClick={onClose} aria-label="Close settings"><X size={20} /></button>
        </div>
        <h2 id="settings-title">AI question settings</h2>
        <p className="muted">Add your OpenRouter key to generate fresh questions for the selected FISO level. Without a key, saved questions are used when available; the built-in bank is for Kindergarten.</p>
        <label className="field-label" htmlFor="api-key">OpenRouter API key</label>
        <div className="input-with-action">
          <input id="api-key" type={showKey ? 'text' : 'password'} value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="sk-or-v1-…" autoComplete="off" />
          <button className="icon-button" onClick={() => setShowKey(!showKey)} aria-label={showKey ? 'Hide API key' : 'Show API key'}>{showKey ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        <label className="field-label" htmlFor="model">Model slug</label>
        <input id="model" value={model} onChange={(event) => setModel(event.target.value)} placeholder={DEFAULT_MODEL} />
        <p className="field-help">Default: <code>openrouter/free</code>. Your key is stored in this browser’s local storage and sent directly to OpenRouter.</p>
        <div className="dialog-actions">
          <button className="button button-secondary" onClick={() => { setApiKey(''); onSave('', model.trim() || DEFAULT_MODEL); onClose() }}>Remove key</button>
          <button className="button button-primary" onClick={save}>Save settings</button>
        </div>
      </section>
    </div>
  )
}
