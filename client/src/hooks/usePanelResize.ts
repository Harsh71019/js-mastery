import { useState, useRef, useCallback } from 'react'
import type React from 'react'

const PANEL_RATIO_KEY = 'js-trainer-panel-ratio'
const DEFAULT_LEFT_RATIO = 40

const getSavedRatio = (): number => {
  const saved = localStorage.getItem(PANEL_RATIO_KEY)
  const parsed = saved ? parseFloat(saved) : NaN
  return isNaN(parsed) ? DEFAULT_LEFT_RATIO : Math.min(75, Math.max(25, parsed))
}

interface UsePanelResizeResult {
  readonly leftRatio: number
  readonly containerRef: React.RefObject<HTMLDivElement | null>
  readonly handleMouseDown: () => void
  readonly handleMouseMove: (event: React.MouseEvent) => void
  readonly handleMouseUp: () => void
}

export const usePanelResize = (): UsePanelResizeResult => {
  const [leftRatio, setLeftRatio] = useState(getSavedRatio)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((): void => {
    isDragging.current = true
  }, [])

  const handleMouseMove = useCallback((event: React.MouseEvent): void => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const ratio = ((event.clientX - rect.left) / rect.width) * 100
    const clamped = Math.min(75, Math.max(25, ratio))
    setLeftRatio(clamped)
    localStorage.setItem(PANEL_RATIO_KEY, String(clamped))
  }, [])

  const handleMouseUp = useCallback((): void => {
    isDragging.current = false
  }, [])

  return { leftRatio, containerRef, handleMouseDown, handleMouseMove, handleMouseUp }
}
