import React, { useRef, Suspense, lazy, useImperativeHandle, forwardRef } from 'react'
import type { OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

const Editor = lazy(() => import('@monaco-editor/react'))

interface CodeEditorProps {
  readonly value: string
  readonly onChange: (value: string) => void
}

export interface CodeEditorHandle {
  readonly highlightPattern: (pattern: string) => void
  readonly clearHighlights: () => void
}

const EditorSkeleton = (): React.JSX.Element => (
  <div className="w-full h-full bg-bg-primary flex items-center justify-center">
    <span className="text-text-tertiary text-xs font-geist uppercase tracking-widest animate-pulse">Initializing Buffer…</span>
  </div>
)

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  ({ value, onChange }, ref): React.JSX.Element => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
    const decorationsRef = useRef<string[]>([])

    useImperativeHandle(ref, () => ({
      highlightPattern: (pattern: string) => {
        if (!editorRef.current) return
        const model = editorRef.current.getModel()
        if (!model) return

        // Search for the pattern (regex supported if we pass true as 3rd param)
        const matches = model.findMatches(pattern, false, true, false, null, true)
        
        if (matches.length > 0) {
          const range = matches[0].range
          decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
            {
              range,
              options: {
                isWholeLine: true,
                className: 'bg-accent-blue/10 border-l-2 border-accent-blue',
                inlineClassName: 'text-white font-bold bg-accent-blue/20 rounded-sm px-1 shadow-glow-sm',
              },
            },
          ])
          editorRef.current.revealRangeInCenterIfOutsideViewport(range, 1 /* Smooth */)
        }
      },
      clearHighlights: () => {
        if (editorRef.current) {
          decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [])
        }
      }
    }))

    const handleMount: OnMount = (editorInstance, monaco) => {
      editorRef.current = editorInstance

      monaco.editor.defineTheme('app-dark-pro', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: { 
          'editor.background': '#050505',
          'editor.lineHighlightBackground': '#ffffff05',
          'editorCursor.foreground': '#3b82f6',
          'editor.selectionBackground': '#3b82f633',
          'editor.inactiveSelectionBackground': '#3b82f611',
        },
      })
      monaco.editor.setTheme('app-dark-pro')

      editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        void editorInstance.getAction('editor.action.formatDocument')?.run()
      })
    }

    return (
      <Suspense fallback={<EditorSkeleton />}>
        <Editor
          language="javascript"
          value={value}
          theme="vs-dark"
          onChange={(newValue) => onChange(newValue ?? '')}
          onMount={handleMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Geist Mono, JetBrains Mono, monospace',
            lineNumbers: 'on',
            wordWrap: 'off',
            scrollBeyondLastLine: false,
            scrollbar: { vertical: 'auto', horizontal: 'auto', verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'all',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            parameterHints: { enabled: false },
            hover: { enabled: true },
            wordBasedSuggestions: 'off',
            inlineSuggest: { enabled: false },
            suggest: { showWords: false },
            fontLigatures: true,
          }}
        />
      </Suspense>
    )
  }
)

CodeEditor.displayName = 'CodeEditor'
