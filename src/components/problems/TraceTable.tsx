import React, { useState } from 'react'
import type { Problem } from '@/types/problem'

interface TraceTableProps {
  readonly traceTable: Problem['traceTable']
}

export const TraceTable = ({ traceTable }: TraceTableProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-tertiary text-xs uppercase tracking-wide">Trace table</span>
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="text-accent-blue text-xs hover:underline cursor-pointer"
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>

      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: isVisible ? '500px' : '0px', opacity: isVisible ? 1 : 0 }}
      >
        <p className="text-text-secondary text-xs font-jetbrains mb-2">{traceTable.inputLabel}</p>
        <div className="overflow-x-auto rounded border border-border-default">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-bg-tertiary">
                {traceTable.columns.map((column) => (
                  <th
                    key={column}
                    className="text-left px-3 py-2 text-text-secondary uppercase tracking-wide font-medium border-b border-border-default"
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
                  className={rowIndex % 2 === 0 ? 'bg-bg-tertiary' : 'bg-bg-secondary'}
                >
                  {traceTable.columns.map((column) => (
                    <td
                      key={column}
                      className="px-3 py-2 text-text-primary font-jetbrains"
                    >
                      {String(row[column] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
