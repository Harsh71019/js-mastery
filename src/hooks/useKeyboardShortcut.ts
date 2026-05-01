import { useEffect } from 'react'

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; meta?: boolean } = { ctrl: true, meta: true },
): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const isModifier =
        (options.ctrl && event.ctrlKey) || (options.meta && event.metaKey)
      if (isModifier && event.key === key) {
        event.preventDefault()
        callback()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, options.ctrl, options.meta])
}
