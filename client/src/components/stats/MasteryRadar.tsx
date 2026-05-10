import React, { useMemo } from 'react'
import { type NeuralScores, CONCEPT_LABELS } from '@/utils/neuralMetrics'

interface MasteryRadarProps {
  readonly scores: NeuralScores
  readonly size?: number
}

export const MasteryRadar = ({ scores, size = 300 }: MasteryRadarProps): React.JSX.Element => {
  const center = size / 2
  const radius = (size / 2) * 0.75
  
  const categories = useMemo(() => [
    { key: 'iteration', angle: -Math.PI / 2 },
    { key: 'logic',     angle: (-Math.PI / 2) + (2 * Math.PI / 5) },
    { key: 'ds',        angle: (-Math.PI / 2) + (4 * Math.PI / 5) },
    { key: 'speed',     angle: (-Math.PI / 2) + (6 * Math.PI / 5) },
    { key: 'memory',    angle: (-Math.PI / 2) + (8 * Math.PI / 5) },
  ], [])

  const getPathPoints = (scale: number): string => {
    return categories
      .map(c => {
        const x = center + radius * scale * Math.cos(c.angle)
        const y = center + radius * scale * Math.sin(c.angle)
        return `${x},${y}`
      })
      .join(' ')
  }

  const userPoints = useMemo(() => {
    return categories
      .map(c => {
        const val = (scores[c.key as keyof NeuralScores] || 0) / 100
        const x = center + radius * val * Math.cos(c.angle)
        const y = center + radius * val * Math.sin(c.angle)
        return `${x},${y}`
      })
      .join(' ')
  }, [scores, categories, center, radius])

  return (
    <div className="flex items-center justify-center relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
          <polygon
            key={scale}
            points={getPathPoints(scale)}
            className="fill-none stroke-white/5"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {categories.map((c, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(c.angle)}
            y2={center + radius * Math.sin(c.angle)}
            className="stroke-white/5"
            strokeWidth="1"
          />
        ))}

        {/* User Data Polygon */}
        <polygon
          points={userPoints}
          className="fill-accent-blue/20 stroke-accent-blue shadow-glow"
          strokeWidth="2"
          style={{ transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />

        {/* Data Nodes */}
        {categories.map((c, i) => {
          const val = (scores[c.key as keyof NeuralScores] || 0) / 100
          const x = center + radius * val * Math.cos(c.angle)
          const y = center + radius * val * Math.sin(c.angle)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              className="fill-bg-primary stroke-accent-blue"
              strokeWidth="2"
              style={{ transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
            />
          )
        })}

        {/* Labels */}
        {categories.map((c, i) => {
          const x = center + (radius + 24) * Math.cos(c.angle)
          const y = center + (radius + 24) * Math.sin(c.angle)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-text-tertiary text-[9px] font-bold font-geist uppercase tracking-widest"
            >
              {CONCEPT_LABELS[c.key as keyof NeuralScores]}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
