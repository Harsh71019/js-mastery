import React, { useRef } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface CodeEditorProps {
  readonly value: string
  readonly onChange: (value: string) => void
}

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
  }

  return (
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
      }}
    />
  )
}
