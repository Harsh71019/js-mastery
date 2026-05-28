import React from 'react'

interface ProgressRingProps {
  readonly progress: number
  readonly size?: number
  readonly strokeWidth?: number
  readonly color?: string
  readonly glow?: boolean
  readonly children?: React.ReactNode
  readonly className?: string
}

export const ProgressRing = ({
  progress,
  size = 40,
  strokeWidth = 3,
  color = '#3b82f6',
  glow = false,
  children,
  className = '',
}: ProgressRingProps): React.JSX.Element => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedProgress = Math.min(100, Math.max(0, progress))
  const offset = circumference - (clampedProgress / 100) * circumference

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg className="-rotate-90 absolute inset-0" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.03)"
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
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)',
            filter: glow ? (color.startsWith('var(') ? `drop-shadow(0 0 8px ${color})` : `drop-shadow(0 0 8px ${color}55)`) : 'none'
          }}
        />
      </svg>
      {children && <div className="z-10 flex flex-col items-center justify-center">{children}</div>}
    </div>
  )
}

