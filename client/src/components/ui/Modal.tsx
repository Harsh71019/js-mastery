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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="glass-panel rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl relative overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-accent-blue/40" />
        <h3 className="text-text-primary text-xl font-bold font-geist tracking-tight uppercase mb-3">{title}</h3>
        <p className="text-text-secondary text-sm font-medium mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-4 justify-end">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-[10px] uppercase tracking-widest font-geist px-6 border border-white/5"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="text-[10px] uppercase tracking-widest font-geist px-8 shadow-glow-sm"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
