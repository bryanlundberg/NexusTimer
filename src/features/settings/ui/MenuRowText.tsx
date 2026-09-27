interface MenuRowTextProps {
  label: string
  description?: string
}

export function MenuRowText({ label, description }: MenuRowTextProps) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="text-sm font-medium leading-tight">{label}</span>
      {description && <span className="text-xs leading-snug text-muted-foreground">{description}</span>}
    </span>
  )
}
