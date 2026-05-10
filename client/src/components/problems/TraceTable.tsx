import React, { useState } from 'react'
import { ChevronDown, Table as TableIcon } from 'lucide-react'
import type { Problem } from '@/types/problem'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface TraceTableProps {
  readonly traceTable: Problem['traceTable']
  readonly onRowClick?: () => void
}

export const TraceTable = ({ traceTable, onRowClick }: TraceTableProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <TableIcon size={14} className="text-accent-blue opacity-60" />
           <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest font-geist opacity-60">Trace_Registry</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible((prev) => !prev)}
          className="text-accent-blue text-[10px] font-bold uppercase tracking-widest font-geist border border-accent-blue/10 hover:bg-accent-blue/5"
        >
          {isVisible ? 'Hide_Simulation' : 'Initialize_Sim'}
          <ChevronDown size={12} className={`ml-2 transition-transform duration-300 ${isVisible ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isVisible ? '1000px' : '0px', opacity: isVisible ? 1 : 0 }}
      >
        <Card className="bg-white/[0.01] border-white/5 overflow-hidden">
          <div className="bg-white/[0.03] border-b border-white/10 px-4 py-3">
             <p className="text-text-secondary text-[11px] font-bold font-geist tracking-tight">INPUT_STREAM: {traceTable.inputLabel}</p>
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-white/[0.02]">
                  {traceTable.columns.map((column) => (
                    <th
                      key={column}
                      className="text-left px-4 py-3 text-text-tertiary uppercase tracking-widest font-bold font-geist border-b border-white/5"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {traceTable.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={onRowClick}
                    className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-200 ${onRowClick ? 'cursor-crosshair' : ''}`}
                  >
                    {traceTable.columns.map((column) => (
                      <td
                        key={column}
                        className="px-4 py-3 text-text-primary font-geist tabular-nums"
                      >
                        <span className={column.toLowerCase() === 'result' || column.toLowerCase() === 'output' ? 'text-accent-blue font-bold' : ''}>
                           {String(row[column] ?? '')}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
