export function BrandMark() {
  return (
    <div className="flex aspect-square size-8 items-center justify-center notch-bl-tr [--notch-cut:8px] bg-sidebar-accent">
      <svg viewBox="0 0 512 512" className="size-5" role="img" aria-label="NexusTimer">
        <path className="fill-sidebar-mark" d="M256 40L443 148L443 228L186.7 80Z" />
        <path
          className="fill-sidebar-foreground"
          d="M129 113.4L291 206.9L291 371.8L373 324.5L373 251.6L443 292L443 364L256 472L221 451.8L221 246.5L139 199.1L139 404.4L69 364L69 148Z"
        />
      </svg>
    </div>
  )
}
