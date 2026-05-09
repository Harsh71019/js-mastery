import React from 'react'
import { BarChart2 } from 'lucide-react'
import { useMasteryBreakdown } from '@/hooks/useMasteryBreakdown'
import { MasteryDonut } from '@/components/stats/MasteryDonut'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
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
    <div className="flex items-center gap-4">
      <span className={`text-[9px] font-bold uppercase tracking-widest font-geist w-16 shrink-0 ${color}`}>{label}</span>
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <span className="text-[10px] font-bold font-geist text-text-tertiary w-6 text-right">{count}</span>
    </div>
  )
}

const CategoryRow = ({ title, clean, struggled, grinded, total }: CategoryMastery): React.JSX.Element => {
  const cleanPct     = (clean / total) * 100
  const struggledPct = (struggled / total) * 100
  const grindedPct   = (grinded / total) * 100
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold font-geist text-text-secondary truncate">{title}</span>
        <span className="text-[9px] font-bold font-geist text-text-tertiary opacity-50">{total}</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex">
        <div className="h-full transition-all duration-700" style={{ width: `${cleanPct}%`,     background: '#22c55e' }} />
        <div className="h-full transition-all duration-700" style={{ width: `${struggledPct}%`, background: '#f59e0b' }} />
        <div className="h-full transition-all duration-700" style={{ width: `${grindedPct}%`,   background: '#ef4444' }} />
      </div>
    </div>
  )
}

export const MasteryBreakdown = (): React.JSX.Element => {
  const { clean, struggled, grinded, total, byCategory } = useMasteryBreakdown()

  return (
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<BarChart2 size={16} />}
        title="Struggle vs Mastery Ratio"
        accent="amber"
        meta={`${total} solved`}
      />

      <Card className="p-6 bg-white/[0.01] flex flex-col gap-6">
        {total === 0 ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest font-geist text-text-tertiary opacity-30">
              Solve problems to see your mastery breakdown
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-8">
              <MasteryDonut clean={clean} struggled={struggled} grinded={grinded} total={total} />
              <div className="flex flex-col gap-3 flex-1">
                <BucketRow label="Clean"     count={clean}     total={total} color="text-accent-green" barColor="#22c55e" />
                <BucketRow label="Struggled" count={struggled} total={total} color="text-accent-amber" barColor="#f59e0b" />
                <BucketRow label="Grinded"   count={grinded}   total={total} color="text-accent-red"   barColor="#ef4444" />
              </div>
            </div>

            {byCategory.length > 0 && (
              <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist px-1">By Category</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                  {byCategory.map((cat) => (
                    <CategoryRow key={cat.slug} {...cat} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </section>
  )
}
