import React, { useMemo, useState } from 'react'
import {
  Sparkles,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  Code2,
  Zap,
  BookOpen,
} from 'lucide-react'
import { analyzeJsCode, type FindingSeverity } from '@/utils/jsCodeAnalyzer'
import { Button } from '@/components/ui/Button'

interface JsMentorModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly code: string
}

const SEVERITY_CONFIG: Record<
  FindingSeverity,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  error: {
    label: 'Critical Bug Trap',
    badgeClass: 'text-accent-red bg-accent-red/10 border-accent-red/20',
    icon: <AlertCircle size={14} className="text-accent-red shrink-0" />,
  },
  warning: {
    label: 'Performance / Loop Warning',
    badgeClass: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
    icon: <AlertTriangle size={14} className="text-accent-amber shrink-0" />,
  },
  info: {
    label: 'JS Language Quirk',
    badgeClass: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    icon: <Info size={14} className="text-accent-blue shrink-0" />,
  },
  optimal: {
    label: 'Optimal Pattern',
    badgeClass: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    icon: <CheckCircle2 size={14} className="text-accent-green shrink-0" />,
  },
}

export const JsMentorModal: React.FC<JsMentorModalProps> = ({ isOpen, onClose, code }) => {
  const [filter, setFilter] = useState<'all' | 'issues' | 'optimal'>('all')

  const analysis = useMemo(() => analyzeJsCode(code), [code])

  const filteredFindings = useMemo(() => {
    if (filter === 'issues') {
      return analysis.findings.filter((f) => f.severity === 'error' || f.severity === 'warning')
    }
    if (filter === 'optimal') {
      return analysis.findings.filter((f) => f.severity === 'optimal')
    }
    return analysis.findings
  }, [analysis.findings, filter])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] bg-[#0c0c0c] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden font-geist">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent-amber/10 border border-accent-amber/20 text-accent-amber">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                  JavaScript Code Mentor
                </h2>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    analysis.score === 'Critical Issues'
                      ? 'text-accent-red border-accent-red/30 bg-accent-red/10'
                      : analysis.score === 'Needs Attention'
                        ? 'text-accent-amber border-accent-amber/30 bg-accent-amber/10'
                        : 'text-accent-green border-accent-green/30 bg-accent-green/10'
                  }`}
                >
                  {analysis.score}
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">
                Pattern: <strong className="text-text-secondary">{analysis.patternDetected}</strong>
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-text-tertiary hover:text-white p-1.5 h-8 w-8"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Telemetry Bar & Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-black/40 border-b border-white/[0.05] text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              All ({analysis.findings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('issues')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                filter === 'issues'
                  ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              Pitfalls ({analysis.errorCount + analysis.warningCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('optimal')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                filter === 'optimal'
                  ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              Patterns ({analysis.optimalCount})
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
            {analysis.errorCount > 0 && (
              <span className="flex items-center gap-1 text-accent-red font-medium">
                <AlertCircle size={11} /> {analysis.errorCount} Error{analysis.errorCount > 1 ? 's' : ''}
              </span>
            )}
            {analysis.warningCount > 0 && (
              <span className="flex items-center gap-1 text-accent-amber font-medium">
                <AlertTriangle size={11} /> {analysis.warningCount} Warning{analysis.warningCount > 1 ? 's' : ''}
              </span>
            )}
            {analysis.optimalCount > 0 && (
              <span className="flex items-center gap-1 text-accent-green font-medium">
                <CheckCircle2 size={11} /> {analysis.optimalCount} Idiomatic
              </span>
            )}
          </div>
        </div>

        {/* Findings Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {filteredFindings.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-text-tertiary">
              <CheckCircle2 size={36} className="text-accent-green opacity-40 mb-3" />
              <p className="text-sm font-semibold text-text-primary">
                No issues found!
              </p>
              <p className="text-xs text-text-tertiary mt-1 max-w-sm">
                Your JavaScript code avoids common iteration pitfalls, off-by-one errors, and nested linear scans.
              </p>
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const cfg = SEVERITY_CONFIG[finding.severity]
              return (
                <div
                  key={finding.id}
                  className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col gap-3 transition-colors hover:border-white/15"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {cfg.icon}
                      <h3 className="text-xs font-bold text-text-primary">
                        {finding.title}
                      </h3>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${cfg.badgeClass}`}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  {finding.codeSnippet && (
                    <div className="bg-[#050505] p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-text-secondary flex items-center justify-between">
                      <code>{finding.codeSnippet}</code>
                      {finding.line && (
                        <span className="text-[10px] text-text-tertiary uppercase font-geist">
                          Line {finding.line}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {finding.message}
                  </p>

                  {/* Why in JavaScript */}
                  <div className="p-3 rounded-lg bg-accent-blue/[0.04] border border-accent-blue/15 text-xs text-text-secondary leading-relaxed">
                    <div className="flex items-center gap-1.5 text-accent-blue font-bold text-[10px] uppercase tracking-wider mb-1.5 font-geist">
                      <BookOpen size={11} /> Why in JavaScript:
                    </div>
                    <p className="text-[11px] text-text-secondary/90 leading-relaxed font-geist">
                      {finding.whyInJavaScript}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="flex items-start gap-2 text-xs text-text-primary bg-accent-green/[0.04] p-3 rounded-lg border border-accent-green/15">
                    <Zap size={13} className="text-accent-green shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed">
                      <span className="font-bold text-accent-green mr-1">Recommended Fix:</span>
                      <span className="font-geist">{finding.recommendation}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between text-xs text-text-tertiary">
          <span className="flex items-center gap-1.5 text-[10px]">
            <Code2 size={12} className="text-accent-blue" />
            V8 JavaScript Engine & Complexity Rules
          </span>
          <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
            Got It
          </Button>
        </div>
      </div>
    </div>
  )
}
