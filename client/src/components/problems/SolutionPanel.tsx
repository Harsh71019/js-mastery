import React, { useState, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const Editor = lazy(() => import('@monaco-editor/react'))

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
      <div className="flex items-center gap-3 text-text-tertiary px-1 py-2 bg-white/[0.02] border border-white/5 rounded-lg border-dashed">
        <Lock size={12} className="opacity-40" />
        <span className="text-[10px] font-bold uppercase tracking-widest font-geist opacity-40">Solution Protocol: Locked (Solve Required)</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {!isRevealed ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsRevealed(true)}
          className="text-accent-blue font-geist text-[10px] font-bold uppercase tracking-widest self-start border border-accent-blue/20 hover:bg-accent-blue/10"
        >
          <Eye size={12} className="mr-2" /> Reveal_Ref_Architecture
        </Button>
      ) : (
        <>
          <div className="flex items-center justify-between px-1 mb-1">
             <h3 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] font-geist opacity-60">Verified Reference Solution</h3>
             <span className="text-accent-blue text-[9px] font-bold uppercase tracking-widest bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20 font-geist">Optimization: Primary</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/5 shadow-inner" style={{ height: '260px' }}>
            <Suspense fallback={<div className="w-full h-full bg-bg-primary" />}>
            <Editor
              height="260px"
              language="javascript"
              value={solution}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                fontFamily: 'Geist Mono, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'off',
                scrollbar: { vertical: 'auto', horizontal: 'auto', verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                padding: { top: 16, bottom: 16 }
              }}
              onMount={(_, monaco) => {
                monaco.editor.defineTheme('app-dark-terminal', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: { 
                    'editor.background': '#0a0a0a',
                    'editor.lineHighlightBackground': '#121212'
                  },
                })
                monaco.editor.setTheme('app-dark-terminal')
              }}
            />
            </Suspense>
          </div>

          <Card className="bg-accent-purple/[0.03] border-accent-purple/20 p-5 group/sol">
            <Link
              to={`/patterns/${encodeURIComponent(patternTag)}`}
              className="text-accent-purple text-[10px] font-bold tracking-widest uppercase mb-2 block hover:underline font-geist"
            >
              Logical Pattern: {patternTag}
            </Link>
            <p className="text-text-secondary text-xs leading-relaxed font-medium transition-colors duration-300 group-hover/sol:text-text-primary">{patternExplanation}</p>
          </Card>
        </>
      )}
    </div>
  )
}
