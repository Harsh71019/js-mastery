import React from 'react'

interface ProgressRingProps {
  readonly progress: number
  readonly size?: number
  readonly strokeWidth?: number
  readonly color?: string
}

export const ProgressRing = ({
  progress,
  size = 40,
  strokeWidth = 3,
  color = '#3b82f6',
}: ProgressRingProps): React.JSX.Element => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedProgress = Math.min(100, Math.max(0, progress))
  const offset = circumference - (clampedProgress / 100) * circumference

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2a2a2a"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 300ms ease' }}
      />
    </svg>
  )
}
