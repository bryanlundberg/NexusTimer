import type { ReactNode } from 'react'

interface FormSectionProps {
  id: string
  title: string
  description?: string
  children: ReactNode
}

export function FormSection({ id, title, description, children }: FormSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 space-y-4 pt-2">
      <div>
        <div className="flex items-center gap-3">
          <h3 id={`${id}-title`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        {description && <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}
