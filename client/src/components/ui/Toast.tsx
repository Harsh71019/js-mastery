import React, { useEffect, useState } from 'react'

type ToastVariant = 'success' | 'error'

interface ToastProps {
  readonly message: string
  readonly variant: ToastVariant
  readonly onDismiss: () => void
  readonly durationMs?: number
}

const BORDER_STYLE: Record<ToastVariant, string> = {
  success: 'border-accent-green/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
  error:   'border-accent-red/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
}

const PREFIX: Record<ToastVariant, string> = {
  success: 'SYS_LOG_OK',
  error:   'SYS_ERR_FAIL',
}

const TEXT_COLOR: Record<ToastVariant, string> = {
  success: 'text-accent-green',
  error:   'text-accent-red',
}

export const Toast = ({
  message,
  variant,
  onDismiss,
  durationMs = 3500,
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
        fixed top-20 right-6 z-[250]
        glass-panel rounded-xl px-5 py-4 w-[340px]
        transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1)
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}
        ${BORDER_STYLE[variant]}
      `}
    >
      <div className="flex flex-col gap-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-bold uppercase tracking-[0.2em] font-geist ${TEXT_COLOR[variant]}`}>
            {PREFIX[variant]}
          </span>
          <div className="flex gap-1">
             <div className={`w-1 h-1 rounded-full ${variant === 'success' ? 'bg-accent-green' : 'bg-accent-red'} animate-pulse`} />
             <div className="w-1 h-1 rounded-full bg-white/10" />
          </div>
        </div>
        <p className="text-text-primary text-[11px] font-geist leading-relaxed tracking-tight">
          {message.toUpperCase()}
        </p>
        <div className="mt-1 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
           <div 
             className={`h-full bg-current transition-all linear`}
             style={{ 
               width: isVisible ? '0%' : '100%', 
               transitionDuration: `${durationMs}ms`,
               color: variant === 'success' ? 'var(--color-accent-green)' : 'var(--color-accent-red)'
             }} 
           />
        </div>
      </div>
    </div>
  )
}
