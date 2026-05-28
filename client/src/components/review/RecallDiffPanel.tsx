import React, { Suspense, lazy } from 'react'
import { CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Glow } from '@/components/ui/Glow'

const DiffEditor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.DiffEditor })))

interface RecallDiffPanelProps {
  readonly originalCode: string
  readonly modifiedCode: string
  readonly onComplete: () => void
  readonly isGaveUp?: boolean
}

const DiffSkeleton = (): React.JSX.Element => (
  <div className="w-full h-[400px] bg-bg-primary flex items-center justify-center border border-white/5 rounded-xl">
    <span className="text-text-tertiary text-xs font-geist uppercase tracking-widest animate-pulse">Analyzing Neural Delta…</span>
  </div>
)

export const RecallDiffPanel = ({
  originalCode,
  modifiedCode,
  onComplete,
  isGaveUp = false,
}: RecallDiffPanelProps): React.JSX.Element => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <Glow color={isGaveUp ? 'var(--color-accent-amber)' : 'var(--color-accent-green)'} size="xl" className="opacity-10" />
      
      <Card className="w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border-white/10 shadow-2xl relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-glow-sm ${isGaveUp ? 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20' : 'bg-accent-green/10 text-accent-green border border-accent-green/20'}`}>
              {isGaveUp ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <div>
              <h2 className="text-text-primary text-lg font-bold font-geist tracking-tight uppercase">
                {isGaveUp ? 'Recall Skipped' : 'Sequence Recalled'}
              </h2>
              <p className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest opacity-60">
                {isGaveUp ? 'Comparing Buffer with Stored Log' : 'Neural Pathway Re-established'}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={onComplete}
            className={`font-geist text-[10px] font-bold uppercase tracking-widest px-6 gap-2 ${isGaveUp ? 'bg-accent-amber/90 hover:bg-accent-amber' : 'bg-accent-green/90 hover:bg-accent-green shadow-[0_0_12px_rgba(34,197,94,0.3)]'}`}
          >
            {isGaveUp ? 'Return to Queue' : 'Mark as Recalled'}
            <ChevronRight size={14} />
          </Button>
        </div>

        <div className="flex-1 min-h-[400px] relative">
          <div className="absolute top-4 left-6 z-10 flex items-center gap-6">
             <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/5">Local_Buffer</span>
             <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/5 ml-[42%]">Stored_Log</span>
          </div>
          
          <Suspense fallback={<DiffSkeleton />}>
            <DiffEditor
              original={modifiedCode}
              modified={originalCode}
              language="javascript"
              theme="vs-dark"
              height="100%"
              options={{
                renderSideBySide: true,
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'Geist Mono, JetBrains Mono, monospace',
                scrollBeyondLastLine: false,
                padding: { top: 48, bottom: 24 },
                scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                diffWordWrap: 'on',
                originalEditable: false,
                automaticLayout: true,
              }}
              onMount={() => {
                const monaco = (window as any).monaco;
                if (monaco) {
                  monaco.editor.defineTheme('diff-dark', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [],
                    colors: { 
                      'editor.background': '#050505',
                      'diffEditor.insertedTextBackground': '#22c55e15',
                      'diffEditor.removedTextBackground': '#ef444415',
                    },
                  })
                  monaco.editor.setTheme('diff-dark')
                }
              }}
            />
          </Suspense>
        </div>

        <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
           <p className="text-text-tertiary text-[10px] font-medium leading-relaxed max-w-2xl uppercase tracking-wider">
             {isGaveUp 
               ? "The sequence has been revealed. No interval increase will be applied to this recalibration pass."
               : "Generation effect verified. Neural stability has been extended via high-fidelity active retrieval."}
           </p>
        </div>
      </Card>
    </div>
  )
}
