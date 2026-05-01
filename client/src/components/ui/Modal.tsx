import React, { useEffect } from 'react'

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        className="bg-bg-secondary border border-border-default rounded-lg p-6 w-full max-w-sm mx-4"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-text-primary text-base font-medium mb-2">{title}</h3>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-text-secondary bg-bg-tertiary border border-border-default rounded hover:border-border-hover transition-colors duration-150 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-accent-red/20 border border-accent-red/40 rounded hover:bg-accent-red/30 transition-colors duration-150 cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
