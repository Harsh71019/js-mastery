import React from 'react'
import { useMasteryBreakdown } from '@/hooks/useMasteryBreakdown'
import { MasteryDonut } from '@/components/stats/MasteryDonut'
import { Card } from '@/components/ui/Card'
import type { CategoryMastery } from '@/hooks/useMasteryBreakdown'

interface BucketRowProps {
  readonly label:    string
  readonly count:    number
  readonly total:    number
  readonly color:    string
  readonly barColor: string
}

const BucketRow = ({ label, count, total, color, barColor }: BucketRowProps): React.JSX.Element => {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-6 group/bucket">
      <span className={`text-[10px] font-bold uppercase tracking-[0.1em] font-geist w-20 shrink-0 ${color}`}>{label}</span>
      <div className="flex-1 h-3 bg-white/5 rounded-sm overflow-hidden relative border border-white/[0.03]">
        <div
          className="h-full rounded-sm transition-all duration-1000 ease-out"
          style={{ 
            width: `${pct}%`, 
            backgroundColor: barColor,
            boxShadow: `0 0 10px ${barColor}44`
          }}
        />
      </div>
      <span className="text-[10px] font-bold font-geist text-text-tertiary w-8 text-right tabular-nums group-hover/bucket:text-text-secondary transition-colors">{count}</span>
    </div>
  )
}

const CategoryRow = ({ title, clean, struggled, grinded, total }: CategoryMastery): React.JSX.Element => {
  const cleanPct     = (clean / total) * 100
  const struggledPct = (struggled / total) * 100
  const grindedPct   = (grinded / total) * 100
  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold font-geist text-text-secondary truncate uppercase tracking-tight">{title}</span>
        <span className="text-[9px] font-bold font-geist text-text-tertiary opacity-40">{total} NODE</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex">
        <div className="h-full transition-all duration-1000" style={{ width: `${cleanPct}%`,     backgroundColor: 'var(--color-accent-green)' }} />
        <div className="h-full transition-all duration-1000" style={{ width: `${struggledPct}%`, backgroundColor: 'var(--color-accent-amber)' }} />
        <div className="h-full transition-all duration-1000" style={{ width: `${grindedPct}%`,   backgroundColor: 'var(--color-accent-red)' }} />
      </div>
    </div>
  )
}

export const MasteryBreakdown = (): React.JSX.Element => {
  const { clean, struggled, grinded, total, byCategory } = useMasteryBreakdown()

  return (
    <Card className="p-8 bg-white/[0.01] flex flex-col gap-8 h-full min-h-[300px]">
      {total === 0 ? (
        <div className="h-full flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary opacity-30 text-center max-w-[200px]">
            Syncing segmentation protocols... Complete verification to view.
          </span>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="shrink-0 relative">
               <div className="absolute inset-0 bg-accent-amber/5 blur-3xl rounded-full" />
               <MasteryDonut clean={clean} struggled={struggled} grinded={grinded} total={total} />
            </div>
            <div className="flex flex-col gap-4 flex-1 w-full">
              <BucketRow label="Clean"     count={clean}     total={total} color="text-accent-green" barColor="var(--color-accent-green)" />
              <BucketRow label="Struggled" count={struggled} total={total} color="text-accent-amber" barColor="var(--color-accent-amber)" />
              <BucketRow label="Grinded"   count={grinded}   total={total} color="text-accent-red"   barColor="var(--color-accent-red)" />
            </div>
          </div>

          {byCategory.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist opacity-60">Node Segmentation</span>
                 <div className="h-px bg-white/5 flex-1" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {byCategory.map((cat) => (
                  <CategoryRow key={cat.slug} {...cat} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
