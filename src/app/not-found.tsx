import Link from 'next/link'
import { ArrowLeftIcon, HomeIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Nexi } from '@/shared/ui/nexi'

export default function NotFound() {
  return (
    <div className="relative grow min-h-dvh flex items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 35%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 70%)'
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(70% 70% at 50% 40%, #000 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 40%, #000 0%, transparent 75%)'
        }}
      />

      <main className="relative z-10 flex flex-col items-center text-center max-w-xl">
        <div className="flex items-center justify-center gap-2 sm:gap-4 select-none">
          <span className="text-[7rem] sm:text-[9rem] font-extrabold leading-none tracking-tighter bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            4
          </span>
          <Nexi
            state="empty"
            size={150}
            style={{ filter: 'drop-shadow(0 14px 30px color-mix(in oklch, var(--primary) 45%, transparent))' }}
          />
          <span className="text-[7rem] sm:text-[9rem] font-extrabold leading-none tracking-tighter bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            4
          </span>
        </div>

        <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Error 404 · Page not found
        </span>

        <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-foreground text-balance">
          Looks like this page got scrambled
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty">
          Nexi searched every layer of the cube but couldn&apos;t solve this one. The page you&apos;re after may have
          been moved or never existed.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/app">
            <Button size="lg">
              <ArrowLeftIcon className="size-4" /> Back to timer
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="lg">
              <HomeIcon className="size-4" /> Go to homepage
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
