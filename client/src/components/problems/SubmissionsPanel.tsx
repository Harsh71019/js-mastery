import React, { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  Cpu,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Activity,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { useSubmissions, type SubmissionSummary } from '@/hooks/useSubmissions'
import { Button } from '@/components/ui/Button'
import { formatDistanceToNow } from 'date-fns'

interface SubmissionsPanelProps {
  readonly problemId: string
  readonly onLoadCode?: (code: string) => void
}

const getVerdictConfig = (verdict: string) => {
  const normalized = verdict.toLowerCase()
  if (normalized === 'accepted') {
    return {
      label: 'Accepted',
      icon: <CheckCircle2 size={13} className="text-accent-green shrink-0" />,
      colorClass: 'text-accent-green bg-accent-green/10 border-accent-green/30',
      badgeClass: 'text-accent-green',
    }
  }
  if (normalized === 'wrong-answer' || normalized === 'wrong answer') {
    return {
      label: 'Wrong Answer',
      icon: <XCircle size={13} className="text-accent-amber shrink-0" />,
      colorClass: 'text-accent-amber bg-accent-amber/10 border-accent-amber/30',
      badgeClass: 'text-accent-amber',
    }
  }
  if (normalized === 'time-limit-exceeded' || normalized === 'time limit exceeded') {
    return {
      label: 'Time Limit Exceeded',
      icon: <Clock size={13} className="text-purple-400 shrink-0" />,
      colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      badgeClass: 'text-purple-400',
    }
  }
  return {
    label: 'Runtime Error',
    icon: <AlertTriangle size={13} className="text-accent-red shrink-0" />,
    colorClass: 'text-accent-red bg-accent-red/10 border-accent-red/30',
    badgeClass: 'text-accent-red',
  }
}

export const SubmissionsPanel: React.FC<SubmissionsPanelProps> = ({ problemId, onLoadCode }) => {
  const { submissions, isLoading, error, refetch } = useSubmissions(problemId)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [submissionCodeMap, setSubmissionCodeMap] = useState<Record<string, string>>({})
  const [loadingCodeId, setLoadingCodeId] = useState<string | null>(null)

  const handleToggleExpand = async (item: SubmissionSummary) => {
    if (expandedId === item.submissionId) {
      setExpandedId(null)
      return
    }

    setExpandedId(item.submissionId)

    if (!submissionCodeMap[item.submissionId]) {
      setLoadingCodeId(item.submissionId)
      try {
        const res = await fetch(`/api/submissions/${problemId}/${item.submissionId}`)
        if (res.ok) {
          const json = (await res.json()) as { success: boolean; data: { code: string } }
          if (json.data?.code) {
            setSubmissionCodeMap((prev) => ({
              ...prev,
              [item.submissionId]: json.data.code,
            }))
          }
        }
      } catch {
        // Ignore fetch errors
      } finally {
        setLoadingCodeId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3 text-text-tertiary">
        <div className="w-6 h-6 border-2 border-white/10 border-t-accent-blue rounded-full animate-spin" />
        <span className="text-xs font-geist uppercase tracking-wider">Loading Submissions…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-accent-red/20 bg-accent-red/5 text-xs text-text-secondary flex flex-col gap-2">
        <p className="text-accent-red font-bold font-geist">Failed to load submissions</p>
        <p className="text-text-tertiary">{error}</p>
        <Button variant="secondary" size="sm" onClick={refetch} className="w-fit text-xs mt-2">
          Retry
        </Button>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="py-12 px-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-3 text-text-tertiary bg-white/[0.01]">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-tertiary">
          <Activity size={18} />
        </div>
        <div>
          <p className="text-text-primary text-sm font-bold font-geist mb-1">No Submissions Recorded</p>
          <p className="text-xs text-text-tertiary max-w-sm font-geist">
            Submit your solution to benchmark runtime speed, memory footprint, and track your iteration history.
          </p>
        </div>
      </div>
    )
  }

  const acceptedList = submissions.filter((s) => s.verdict.toString().toLowerCase() === 'accepted')
  const fastest = acceptedList.reduce<number | null>((min, s) => {
    if (typeof s.executionTimeMs === 'number') {
      return min === null ? s.executionTimeMs : Math.min(min, s.executionTimeMs)
    }
    return min
  }, null)

  const leastMemory = acceptedList.reduce<number | null>((min, s) => {
    if (typeof s.memoryUsageMb === 'number') {
      return min === null ? s.memoryUsageMb : Math.min(min, s.memoryUsageMb)
    }
    return min
  }, null)

  return (
    <div className="flex flex-col gap-5">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist">Total</span>
          <span className="text-base font-bold text-text-primary font-mono">{submissions.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist">Accepted</span>
          <span className="text-base font-bold text-accent-green font-mono">{acceptedList.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist">Best Speed</span>
          <span className="text-base font-bold text-accent-blue font-mono">
            {fastest !== null ? `${fastest.toFixed(1)} ms` : '—'}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider font-geist">Best Memory</span>
          <span className="text-base font-bold text-purple-400 font-mono">
            {leastMemory !== null ? `${leastMemory.toFixed(1)} MB` : '—'}
          </span>
        </div>
      </div>

      {/* Submissions List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-text-tertiary font-geist uppercase tracking-wider font-bold px-1">
          <span>Submission History</span>
          <span>{submissions.length} Attempts</span>
        </div>

        {submissions.map((item, idx) => {
          const config = getVerdictConfig(item.verdict.toString())
          const isExpanded = expandedId === item.submissionId
          const code = submissionCodeMap[item.submissionId]
          const isLoadingCode = loadingCodeId === item.submissionId

          let timeAgo = ''
          try {
            timeAgo = formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true })
          } catch {
            timeAgo = item.submittedAt
          }

          return (
            <div
              key={item.submissionId || idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-white/20 bg-[#0d0d0d]' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15'
              }`}
            >
              <div
                onClick={() => handleToggleExpand(item)}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">{config.icon}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold font-geist ${config.badgeClass}`}>{config.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-text-tertiary font-mono">
                        JS
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary font-geist mt-0.5">
                      <Calendar size={10} />
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
                    {typeof item.executionTimeMs === 'number' && (
                      <div className="flex items-center gap-1 text-accent-blue" title="Runtime">
                        <Cpu size={12} />
                        <span>{item.executionTimeMs.toFixed(1)} ms</span>
                      </div>
                    )}
                    {typeof item.memoryUsageMb === 'number' && (
                      <div className="flex items-center gap-1 text-purple-400" title="Memory">
                        <HardDrive size={12} />
                        <span>{item.memoryUsageMb.toFixed(1)} MB</span>
                      </div>
                    )}
                  </div>

                  <div className="text-text-tertiary hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </div>
              </div>

              {/* Expanded Details and Code View */}
              {isExpanded && (
                <div className="border-t border-white/[0.08] p-4 bg-black/40 flex flex-col gap-3.5">
                  {/* Telemetry row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-geist">
                    <div className="flex items-center gap-4">
                      {typeof item.beatsRuntime === 'number' && (
                        <div className="flex items-center gap-1.5 text-accent-green">
                          <Activity size={12} />
                          <span>
                            Beats <strong className="font-bold">{item.beatsRuntime.toFixed(1)}%</strong> runtime
                          </span>
                        </div>
                      )}
                      {typeof item.beatsMemory === 'number' && (
                        <div className="flex items-center gap-1.5 text-purple-400">
                          <Activity size={12} />
                          <span>
                            Beats <strong className="font-bold">{item.beatsMemory.toFixed(1)}%</strong> memory
                          </span>
                        </div>
                      )}
                    </div>

                    {code && onLoadCode && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onLoadCode(code)}
                        className="text-xs font-geist font-bold flex items-center gap-1.5 py-1 px-3"
                      >
                        <RotateCcw size={12} className="text-accent-blue" />
                        <span>Restore into Editor</span>
                      </Button>
                    )}
                  </div>

                  {/* Code snippet */}
                  <div className="relative rounded-lg bg-[#050505] border border-white/10 p-3 overflow-x-auto">
                    {isLoadingCode ? (
                      <div className="py-6 flex items-center justify-center text-xs text-text-tertiary font-geist">
                        Fetching submission code…
                      </div>
                    ) : code ? (
                      <pre className="text-xs font-mono text-text-secondary leading-relaxed whitespace-pre font-geist">
                        <code>{code}</code>
                      </pre>
                    ) : (
                      <div className="py-4 text-xs text-text-tertiary font-geist text-center">
                        Code for this submission is not stored.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
