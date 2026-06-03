export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <p className="rounded-md bg-muted/40 px-2.5 py-2 font-mono text-xs leading-relaxed wrap-break-word text-foreground/90">
        {value}
      </p>
    </div>
  )
}
