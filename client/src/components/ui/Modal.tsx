import React, { useEffect } from 'react'
import { Button } from './Button'

interface ModalProps {
  readonly isOpen: boolean
  readonly title: string
  readonly message: string
  readonly confirmLabel?: string
  readonly cancelLabel?: string
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

export const Modal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ModalProps): React.JSX.Element | null => {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        className="glass-panel rounded-2xl p-5 sm:p-7 w-full max-w-md mx-4 shadow-2xl relative overflow-hidden border-white/10 bg-[#0e0e0e]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-accent-blue shadow-[0_0_10px_var(--color-accent-blue)]" />
        <h3 id="modal-title" className="text-text-primary text-base sm:text-lg font-bold font-geist tracking-tight uppercase mb-2">{title}</h3>
        <p id="modal-desc" className="text-text-secondary text-xs sm:text-sm font-medium mb-5 sm:mb-7 leading-relaxed">{message}</p>
        <div className="flex gap-2.5 sm:gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-xs uppercase tracking-wider font-geist px-4 border border-white/10 hover:border-white/20"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="text-xs uppercase tracking-wider font-geist px-5"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
