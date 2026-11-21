import { useState, useEffect, useCallback, useRef } from 'react'
import type { ProblemNote, NoteSaveStatus } from '@/types/note'

const DEBOUNCE_DELAY_MS = 1000

export interface UseProblemNoteResult {
  readonly content: string
  readonly status: NoteSaveStatus
  readonly lastSavedAt: string | null
  readonly error: string | null
  readonly hasNote: boolean
  readonly updateContent: (text: string) => void
  readonly insertSnippet: (snippet: string) => void
  readonly saveNow: () => Promise<void>
  readonly clearNote: () => Promise<void>
}

export const useProblemNote = (problemId: string): UseProblemNoteResult => {
  const [content, setContent] = useState<string>('')
  const [savedContent, setSavedContent] = useState<string>('')
  const [status, setStatus] = useState<NoteSaveStatus>('loading')
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentContentRef = useRef<string>('')
  currentContentRef.current = content

  // Fetch initial note for problem
  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    // Clear any pending debounce from previous problem
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    fetch(`/api/notes/${problemId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ success: boolean; data: ProblemNote | null }>
      })
      .then((json) => {
        if (cancelled) return
        const initialText = json.data?.content ?? ''
        setContent(initialText)
        setSavedContent(initialText)
        setLastSavedAt(json.data?.updatedAt ?? null)
        setStatus('idle')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to fetch note')
        setStatus('idle')
      })

    return () => {
      cancelled = true
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [problemId])

  const performSave = useCallback(
    async (textToSave: string) => {
      setStatus('saving')
      setError(null)

      try {
        const res = await fetch(`/api/notes/${problemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: textToSave }),
        })

        if (!res.ok) throw new Error(`HTTP error ${res.status}`)

        const json = (await res.json()) as { success: boolean; data: ProblemNote }
        setSavedContent(textToSave)
        setLastSavedAt(json.data?.updatedAt ?? new Date().toISOString())
        setStatus('saved')
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to save note')
        setStatus('error')
      }
    },
    [problemId],
  )

  const updateContent = useCallback(
    (newText: string) => {
      setContent(newText)

      if (newText === savedContent) {
        setStatus('idle')
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
          debounceTimerRef.current = null
        }
        return
      }

      setStatus('unsaved')

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        void performSave(newText)
      }, DEBOUNCE_DELAY_MS)
    },
    [savedContent, performSave],
  )

  const insertSnippet = useCallback(
    (snippet: string) => {
      const current = currentContentRef.current
      const separator = current && !current.endsWith('\n\n') ? (current.endsWith('\n') ? '\n' : '\n\n') : ''
      const updated = current + separator + snippet
      updateContent(updated)
    },
    [updateContent],
  )

  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    await performSave(currentContentRef.current)
  }, [performSave])

  const clearNote = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    setStatus('saving')
    try {
      await fetch(`/api/notes/${problemId}`, { method: 'DELETE' })
      setContent('')
      setSavedContent('')
      setLastSavedAt(null)
      setStatus('idle')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete note')
      setStatus('error')
    }
  }, [problemId])

  const hasNote = Boolean(content && content.trim().length > 0)

  return {
    content,
    status,
    lastSavedAt,
    error,
    hasNote,
    updateContent,
    insertSnippet,
    saveNow,
    clearNote,
  }
}
