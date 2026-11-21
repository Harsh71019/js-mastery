import React, { useState, useMemo } from 'react'
import {
  StickyNote,
  Save,
  Trash2,
  Copy,
  Check,
  Eye,
  Edit3,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { useProblemNote } from '@/hooks/useProblemNote'
import { Button } from '@/components/ui/Button'
import { formatDistanceToNow } from 'date-fns'

interface NotesPanelProps {
  readonly problemId: string
  readonly problemTitle?: string
}

const TEMPLATES = [
  {
    id: 'intuition',
    label: '💡 Intuition',
    snippet: `### 💡 Core Intuition & Strategy
- **Pattern:** 
- **Mental Model:** 
- **Key Observation:** `,
  },
  {
    id: 'complexity',
    label: '⏱️ Complexity',
    snippet: `### ⏱️ Complexity Analysis
- **Time Complexity:** O(n) — Single pass through elements.
- **Space Complexity:** O(1) — Constant auxiliary memory.`,
  },
  {
    id: 'edge_cases',
    label: '⚠️ Edge Cases',
    snippet: `### ⚠️ Critical Edge Cases
- [ ] Empty array / null input
- [ ] Single element
- [ ] Duplicate elements / identical values
- [ ] Boundary limits & negative numbers`,
  },
  {
    id: 'invariant',
    label: '🔄 Loop Invariant',
    snippet: `### 🔄 Loop Invariant & Pointers
- **Initial State:** 
- **Step Invariant:** 
- **Termination:** `,
  },
]

export const NotesPanel: React.FC<NotesPanelProps> = ({ problemId }) => {
  const {
    content,
    status,
    lastSavedAt,
    error,
    updateContent,
    insertSnippet,
    saveNow,
    clearNote,
  } = useProblemNote(problemId)

  const [mode, setMode] = useState<'write' | 'preview'>('write')
  const [copied, setCopied] = useState(false)
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)

  const wordCount = useMemo(() => {
    const trimmed = content.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }, [content])

  const charCount = content.length

  const handleCopy = () => {
    if (!content) return
    void navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = async () => {
    await clearNote()
    setIsConfirmingClear(false)
  }

  const renderMarkdownPreview = (text: string) => {
    if (!text.trim()) {
      return (
        <div className="py-12 flex flex-col items-center justify-center text-center text-text-tertiary">
          <StickyNote size={32} className="opacity-30 mb-3" />
          <p className="text-sm font-geist">No notes written yet.</p>
          <p className="text-xs text-text-tertiary/70 mt-1">
            Switch to the Write tab or click a template above to start taking notes.
          </p>
        </div>
      )
    }

    // Split text by lines and render elements
    const lines = text.split('\n')
    const elements: React.JSX.Element[] = []
    let inCodeBlock = false
    let codeBlockBuffer: string[] = []
    let codeBlockKey = 0

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          elements.push(
            <div
              key={`code-${codeBlockKey++}`}
              className="my-3 rounded-lg border border-white/10 bg-[#0d0d0d] overflow-hidden"
            >
              <div className="px-3 py-1 bg-white/[0.03] border-b border-white/5 text-[10px] text-text-tertiary uppercase font-mono">
                Code Snippet
              </div>
              <pre className="p-3 text-xs font-mono text-accent-blue overflow-x-auto whitespace-pre">
                {codeBlockBuffer.join('\n')}
              </pre>
            </div>,
          )
          codeBlockBuffer = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeBlockBuffer.push(line)
        return
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={index}
            className="text-sm font-bold text-text-primary mt-4 mb-2 flex items-center gap-2 font-geist"
          >
            {line.replace('### ', '')}
          </h3>,
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={index}
            className="text-base font-bold text-text-primary mt-5 mb-2 font-geist"
          >
            {line.replace('## ', '')}
          </h2>,
        )
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1
            key={index}
            className="text-lg font-bold text-text-primary mt-6 mb-3 font-geist"
          >
            {line.replace('# ', '')}
          </h1>,
        )
      } else if (line.trim().startsWith('- [ ] ') || line.trim().startsWith('- [x] ')) {
        // Checklist
        const isChecked = line.trim().startsWith('- [x] ')
        const itemText = line.trim().replace(/- \[[ x]\] /, '')
        elements.push(
          <div key={index} className="flex items-center gap-2 text-xs text-text-secondary my-1">
            <span
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                isChecked
                  ? 'bg-accent-green/20 border-accent-green/40 text-accent-green'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              {isChecked && <Check size={10} />}
            </span>
            <span className={isChecked ? 'line-through text-text-tertiary' : ''}>{itemText}</span>
          </div>,
        )
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        // Bullet
        const bulletText = line.trim().replace(/^[-*]\s+/, '')
        // Parse bold inline
        const parts = bulletText.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
        elements.push(
          <div key={index} className="flex items-start gap-2 text-xs text-text-secondary my-1 pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/70 mt-1.5 shrink-0" />
            <div className="leading-relaxed">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="text-text-primary font-semibold">
                      {part.slice(2, -2)}
                    </strong>
                  )
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                  return (
                    <code
                      key={pIdx}
                      className="px-1 py-0.5 rounded bg-white/[0.06] text-accent-amber font-mono text-[11px] border border-white/5"
                    >
                      {part.slice(1, -1)}
                    </code>
                  )
                }
                return <span key={pIdx}>{part}</span>
              })}
            </div>
          </div>,
        )
      } else if (!line.trim()) {
        elements.push(<div key={index} className="h-2" />)
      } else {
        // Normal paragraph
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
        elements.push(
          <p key={index} className="text-xs text-text-secondary leading-relaxed my-1">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="text-text-primary font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                )
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code
                    key={pIdx}
                    className="px-1 py-0.5 rounded bg-white/[0.06] text-accent-amber font-mono text-[11px] border border-white/5"
                  >
                    {part.slice(1, -1)}
                  </code>
                )
              }
              return <span key={pIdx}>{part}</span>
            })}
          </p>,
        )
      }
    })

    return <div className="space-y-0.5">{elements}</div>
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">
            <StickyNote size={15} />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] font-geist text-text-primary">
              Personal Notes
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              {status === 'saving' && (
                <span className="flex items-center gap-1 text-[10px] text-accent-amber font-geist">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-ping" />
                  Saving to cloud…
                </span>
              )}
              {status === 'saved' && (
                <span className="flex items-center gap-1 text-[10px] text-accent-green font-geist">
                  <CheckCircle2 size={10} />
                  Saved
                </span>
              )}
              {status === 'unsaved' && (
                <span className="flex items-center gap-1 text-[10px] text-accent-blue font-geist">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                  Unsaved changes
                </span>
              )}
              {status === 'error' && (
                <span className="flex items-center gap-1 text-[10px] text-accent-red font-geist">
                  <AlertCircle size={10} />
                  {error ?? 'Failed to save'}
                </span>
              )}
              {status === 'idle' && lastSavedAt && (
                <span className="flex items-center gap-1 text-[10px] text-text-tertiary font-geist">
                  <Clock size={9} />
                  Saved {formatDistanceToNow(new Date(lastSavedAt), { addSuffix: true })}
                </span>
              )}
              {status === 'loading' && (
                <span className="text-[10px] text-text-tertiary font-geist animate-pulse">
                  Loading notes…
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setMode('write')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                mode === 'write'
                  ? 'bg-accent-blue text-white shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Edit3 size={11} />
              Write
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                mode === 'preview'
                  ? 'bg-accent-blue text-white shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Eye size={11} />
              Preview
            </button>
          </div>

          {/* Copy Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!content}
            title="Copy Note Markdown"
            className="h-7 px-2 text-text-tertiary hover:text-text-primary"
          >
            {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
          </Button>

          {/* Manual Save Button */}
          {status === 'unsaved' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void saveNow()}
              className="h-7 px-2.5 text-[11px] gap-1 font-geist text-accent-blue hover:text-white"
            >
              <Save size={11} />
              Save
            </Button>
          )}

          {/* Clear Button */}
          {isConfirmingClear ? (
            <div className="flex items-center gap-1 bg-accent-red/10 border border-accent-red/30 px-2 py-0.5 rounded-md">
              <span className="text-[10px] text-accent-red font-medium">Delete?</span>
              <button
                type="button"
                onClick={() => void handleClear()}
                className="text-[10px] font-bold text-accent-red hover:underline px-1 cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className="text-[10px] text-text-tertiary hover:text-text-secondary px-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmingClear(true)}
              disabled={!content}
              title="Clear Note"
              className="h-7 px-2 text-text-tertiary hover:text-accent-red"
            >
              <Trash2 size={12} />
            </Button>
          )}
        </div>
      </div>

      {/* Template Quick Insert Pills */}
      {mode === 'write' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1 mr-1">
            <Sparkles size={11} className="text-accent-amber" /> Templates:
          </span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => insertSnippet(tmpl.snippet)}
              className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-[11px] text-text-secondary hover:text-text-primary transition-all font-geist cursor-pointer"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      )}

      {/* Editor or Preview Pane */}
      <div className="flex-1 flex flex-col min-h-[300px]">
        {mode === 'write' ? (
          <div className="flex-1 flex flex-col relative rounded-xl border border-white/10 bg-[#080808] overflow-hidden focus-within:border-accent-blue/50 transition-colors">
            <textarea
              value={content}
              onChange={(e) => updateContent(e.target.value)}
              placeholder="Jot down notes, pattern intuition, tricky loop invariants, or edge cases to watch out for... (Markdown supported)"
              className="w-full flex-1 p-4 bg-transparent text-text-primary font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder:text-text-tertiary/50 scrollbar-thin"
              rows={14}
            />
          </div>
        ) : (
          <div className="flex-1 p-5 rounded-xl border border-white/10 bg-[#080808] overflow-y-auto scrollbar-thin">
            {renderMarkdownPreview(content)}
          </div>
        )}
      </div>

      {/* Footer Info & Telemetry */}
      <div className="flex items-center justify-between text-[11px] text-text-tertiary pt-2 border-t border-white/[0.05] font-geist">
        <span className="flex items-center gap-1 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green/60" />
          Auto-saves on keystroke &bull; Persisted to cloud
        </span>
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>
    </div>
  )
}
