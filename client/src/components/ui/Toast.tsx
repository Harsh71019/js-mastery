import React, { useEffect, useState } from 'react'

type ToastVariant = 'success' | 'error'

interface ToastProps {
  readonly message: string
  readonly variant: ToastVariant
  readonly onDismiss: () => void
  readonly durationMs?: number
}

const BORDER_COLOR: Record<ToastVariant, string> = {
  success: 'border-accent-green',
  error: 'border-accent-red',
}

export const Toast = ({
  message,
  variant,
  onDismiss,
  durationMs = 3000,
}: ToastProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const showTimer = requestAnimationFrame(() => setIsVisible(true))
    const hideTimer = setTimeout(() => setIsVisible(false), durationMs - 300)
    const dismissTimer = setTimeout(onDismiss, durationMs)

    return () => {
      cancelAnimationFrame(showTimer)
      clearTimeout(hideTimer)
      clearTimeout(dismissTimer)
    }
  }, [durationMs, onDismiss])

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        bg-bg-secondary border-l-4 ${BORDER_COLOR[variant]}
        rounded px-4 py-3 text-sm text-text-primary
        shadow-none
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
      `}
    >
      {message}
    </div>
  )
}
