export function BrandMark() {
  return (
    <div className="flex aspect-square size-8 items-center justify-center notch-bl-tr [--notch-cut:8px] border border-sidebar-border bg-sidebar-accent">
      <svg viewBox="0 0 512 512" className="size-5" role="img" aria-label="NexusTimer">
        <path className="fill-sidebar-mark" d="M200 79L262 41L443 147L443 228Z" />
        <path
          className="fill-sidebar-foreground"
          d="M129 113L291 220L293 407L378 357L378 256L443 291L443 383L282 490L225 458L225 262L141 206L142 420L69 378L69 146Z"
        />
      </svg>
    </div>
  )
}
