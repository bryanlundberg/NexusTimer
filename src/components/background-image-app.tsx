'use client'
import { useBackgroundImageStore } from '@/shared/model/settings/useBackgroundImageStore'
import { ReactNode } from 'react'

export default function BackgroundImageApp({ children }: { children: ReactNode }) {
  const backgroundImage = useBackgroundImageStore((state) => state.backgroundImage)
  return (
    <>
        <div
          className="flex flex-col justify-between gap-2 select-none bg-background grow"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : '',
            backgroundPosition: backgroundImage ? 'center' : '',
            backgroundAttachment: backgroundImage ? 'fixed' : '',
            backgroundRepeat: backgroundImage ? 'no-repeat' : '',
            backgroundSize: backgroundImage ? 'cover' : ''
          }}
        >
          {children}
        </div>
    </>
  )
}
