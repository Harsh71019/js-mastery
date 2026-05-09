import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu } from 'lucide-react'
import type { PatternSummary } from '@/types/problem'
import { Card } from '@/components/ui/Card'

interface PatternCardProps {
  readonly pattern: PatternSummary
}

export const PatternCard = ({ pattern }: PatternCardProps): React.JSX.Element => (
  <Link
    to={`/patterns/${encodeURIComponent(pattern.tag)}`}
    className="group block"
  >
    <Card className="flex items-center justify-between gap-5 px-6 py-5 transition-all duration-500 hover:translate-x-1 border-white/5 hover:border-white/20">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-tertiary group-hover:text-accent-blue transition-colors duration-500">
          <Cpu size={18} className="opacity-60 group-hover:opacity-100" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-text-primary text-[11px] font-bold uppercase tracking-[0.2em] font-geist truncate group-hover:text-accent-blue transition-colors">{pattern.tag}</p>
          <p className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-geist opacity-60">
            Nodes Indexed: {pattern.count}
          </p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-tertiary group-hover:bg-accent-blue group-hover:text-white transition-all duration-500 border border-white/5 shadow-inner">
        <ArrowRight
          size={14}
          className="transition-transform duration-500 group-hover:translate-x-0.5"
        />
      </div>
    </Card>
  </Link>
)
