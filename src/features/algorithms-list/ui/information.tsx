import * as React from 'react'

interface InformationProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  title: string
  description?: string
}

export default function Information({ title, description }: InformationProps) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
