import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface ConfirmDialogProps {
  icon: ReactNode
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** In-app replacement for window.confirm: large buttons, plain words, and Escape or a backdrop tap to cancel. */
export function ConfirmDialog({ icon, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return <div className="dialog-backdrop" onClick={onCancel}>
    <div className="dialog-panel confirm-panel" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" onClick={(event) => event.stopPropagation()}>
      <span className="dialog-icon">{icon}</span>
      <h2 id="confirm-title">{title}</h2>
      <p id="confirm-message" className="muted">{message}</p>
      <div className="dialog-actions"><button ref={cancelRef} className="button button-secondary" onClick={onCancel}>{cancelLabel}</button><button className="button button-primary" onClick={onConfirm}>{confirmLabel}</button></div>
    </div>
  </div>
}
