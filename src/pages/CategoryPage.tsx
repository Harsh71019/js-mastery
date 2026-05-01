import React from 'react'
import { useParams } from 'react-router-dom'

export const CategoryPage = (): React.JSX.Element => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="p-6">
      <h1 className="text-text-primary text-xl font-medium">Category: {slug}</h1>
    </div>
  )
}
