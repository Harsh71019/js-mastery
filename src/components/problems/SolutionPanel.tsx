import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import Editor from '@monaco-editor/react'

interface SolutionPanelProps {
  readonly solution: string
  readonly patternTag: string
  readonly patternExplanation: string
  readonly hasAttempted: boolean
}

export const SolutionPanel = ({
  solution,
  patternTag,
  patternExplanation,
  hasAttempted,
}: SolutionPanelProps): React.JSX.Element => {
  const [isRevealed, setIsRevealed] = useState(false)

  if (!hasAttempted) {
    return (
      <div className="flex items-center gap-2 text-text-tertiary text-xs">
        <Lock size={12} />
        <span>Run your code first to unlock the solution</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {!isRevealed ? (
        <button
          type="button"
          onClick={() => setIsRevealed(true)}
          className="text-accent-blue text-xs hover:underline cursor-pointer text-left"
        >
          Show solution
        </button>
      ) : (
        <>
          <div className="rounded overflow-hidden border border-border-default" style={{ height: '220px' }}>
            <Editor
              height="220px"
              language="javascript"
              value={solution}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'off',
                scrollbar: { vertical: 'auto', horizontal: 'auto', verticalScrollbarSize: 6 },
              }}
              onMount={(_, monaco) => {
                monaco.editor.defineTheme('app-dark', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: { 'editor.background': '#0a0a0a' },
                })
                monaco.editor.setTheme('app-dark')
              }}
            />
          </div>

          <div className="bg-accent-purple/10 border-l-[3px] border-accent-purple rounded-r px-4 py-3">
            <p className="text-accent-purple text-xs font-medium mb-1">Pattern: {patternTag}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{patternExplanation}</p>
          </div>
        </>
      )}
    </div>
  )
}
