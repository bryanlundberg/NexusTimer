interface MenuRowTextProps {
  label: string
  description?: string
}

export function MenuRowText({ label, description }: MenuRowTextProps) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[15px] leading-snug sm:text-sm">{label}</span>
      {description && <span className="text-[13px] leading-snug text-muted-foreground sm:text-xs">{description}</span>}
    </span>
  )
}
