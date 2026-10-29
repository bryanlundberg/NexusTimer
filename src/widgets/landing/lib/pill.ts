const base =
  'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-12 md:px-6 md:text-base'

export const pillSolid = `${base} bg-primary text-primary-foreground hover:bg-primary/85`
export const pillInverse = `${base} bg-foreground text-background hover:bg-foreground/88`
export const pillGhost = `${base} border border-border bg-background/40 text-foreground backdrop-blur-sm hover:bg-foreground/8`
export const pillSmall = 'h-9 px-4 text-sm md:h-9 md:px-4 md:text-sm'
