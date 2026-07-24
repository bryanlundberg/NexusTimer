'use client'
import { useBackgroundImageStore } from '@/shared/model/settings/useBackgroundImageStore'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function BackgroundImageApp({ children }: { children: ReactNode }) {
  const backgroundImage = useBackgroundImageStore((state) => state.backgroundImage)
  const pathname = usePathname()
  const showBackground = Boolean(backgroundImage) && pathname === '/app'

  return (
    <div className="relative flex flex-col select-none bg-background grow min-h-0">
      {showBackground && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        />
      )}
      <div className="relative z-10 flex flex-col justify-between gap-2 grow min-h-0">{children}</div>
    </div>
  )
}
