import React from 'react'
import { useParams } from 'react-router-dom'

export const ProblemPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-6">
      <h1 className="text-text-primary text-xl font-medium">Problem: {id}</h1>
    </div>
  )
}
