import { useState, useRef, useCallback } from 'react'

const TERMINAL_HEIGHT_KEY = 'js-trainer-terminal-height'
const DEFAULT_HEIGHT = 220
const MIN_HEIGHT = 100
const MAX_HEIGHT = 600

const getSavedHeight = (): number => {
  const saved = localStorage.getItem(TERMINAL_HEIGHT_KEY)
  const parsed = saved ? parseInt(saved, 10) : NaN
  return isNaN(parsed) ? DEFAULT_HEIGHT : Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, parsed))
}

interface UseVerticalResizeResult {
  readonly height: number
  readonly isDragging: boolean
  readonly handleMouseDown: (event: React.MouseEvent) => void
  readonly handleMouseMove: (event: MouseEvent) => void
  readonly handleMouseUp: () => void
}

export const useVerticalResize = (): UseVerticalResizeResult => {
  const [height, setHeight] = useState(getSavedHeight)
  const [isDragging, setIsDragging] = useState(false)
  const draggingRef = useRef(false)

  const handleMouseDown = useCallback((event: React.MouseEvent): void => {
    event.preventDefault()
    draggingRef.current = true
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent): void => {
    if (!draggingRef.current) return
    
    // We calculate from the bottom up since the terminal is anchored to the bottom area
    const newHeight = window.innerHeight - event.clientY - 56 // Adjust for bottom button and padding
    const clamped = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight))
    
    setHeight(clamped)
    localStorage.setItem(TERMINAL_HEIGHT_KEY, String(clamped))
  }, [])

  const handleMouseUp = useCallback((): void => {
    draggingRef.current = false
    setIsDragging(false)
  }, [])

  return { height, isDragging, handleMouseDown, handleMouseMove, handleMouseUp }
}
