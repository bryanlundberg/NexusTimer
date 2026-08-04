'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface EraCarouselProps {
  images: string[]
  ratio: number
  label: string
  accent: string
}

export default function EraCarousel({ images, ratio, label, accent }: EraCarouselProps) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const total = images.length

  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    }
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1))
        touchStartX.current = null
      }}
      className="group relative w-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div
        className="relative w-full overflow-hidden notch-bl-tr [--nblt:18px] border border-gray-900/10 bg-gray-900/[0.04]"
        style={{ aspectRatio: ratio }}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${label} (${i + 1}/${total})`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="lazy"
            className={`object-contain transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={i !== index}
          />
        ))}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={`${label}: previous`}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-gray-800 shadow-sm backdrop-blur transition-opacity duration-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={`${label}: next`}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-gray-800 shadow-sm backdrop-blur transition-opacity duration-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <span className="absolute right-3 top-3 rounded-full bg-gray-900/70 px-2 py-0.5 text-[10px] font-medium tabular-nums text-white backdrop-blur">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={`${label}: ${i + 1}`}
              aria-current={i === index}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 20 : 6,
                backgroundColor: i === index ? accent : 'rgba(17,24,39,0.15)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
