export function RecordDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[11px] text-muted-foreground">
      <span className="text-foreground/70">{label}:</span> {value}
    </span>
  )
}
