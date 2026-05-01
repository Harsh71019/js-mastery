import React, { useRef, Suspense, lazy } from 'react'
import type { OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

const Editor = lazy(() => import('@monaco-editor/react'))

interface CodeEditorProps {
  readonly value: string
  readonly onChange: (value: string) => void
}

const EditorSkeleton = (): React.JSX.Element => (
  <div className="w-full h-full bg-bg-primary flex items-center justify-center">
    <span className="text-text-tertiary text-xs">Loading editor…</span>
  </div>
)

export const CodeEditor = ({ value, onChange }: CodeEditorProps): React.JSX.Element => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance

    monaco.editor.defineTheme('app-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: { 'editor.background': '#0a0a0a' },
    })
    monaco.editor.setTheme('app-dark')

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
          fontFamily: 'JetBrains Mono, monospace',
          lineNumbers: 'on',
          wordWrap: 'off',
          scrollBeyondLastLine: false,
          scrollbar: { vertical: 'auto', horizontal: 'auto', verticalScrollbarSize: 6 },
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: 'line',
          smoothScrolling: true,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          parameterHints: { enabled: false },
          hover: { enabled: false },
          wordBasedSuggestions: 'off',
          inlineSuggest: { enabled: false },
          suggest: { showWords: false },
        }}
      />
    </Suspense>
  )
}
