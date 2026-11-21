import React from 'react'
import type { Problem } from '@/types/problem'
import { LoopVisualizer } from '@/components/problems/LoopVisualizer'

interface TraceTableProps {
  readonly traceTable: Problem['traceTable']
  readonly onRowClick?: () => void
}

export const TraceTable = ({ traceTable, onRowClick }: TraceTableProps): React.JSX.Element => {
  return <LoopVisualizer traceTable={traceTable} onRowClick={onRowClick} />
}
