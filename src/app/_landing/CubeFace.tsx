import Image from 'next/image'
import { cn } from '@/shared/lib/utils'

type Sticker = { color: string; radius: string; logo?: boolean }

const FACE: Sticker[] = [
  { color: 'var(--cube-blue)', radius: '0' },
  { color: 'var(--cube-yellow)', radius: '0 0 50% 50%' },
  { color: 'var(--cube-green)', radius: '0' },
  { color: 'var(--cube-green)', radius: '0 50% 50% 0' },
  { color: 'var(--cube-white)', radius: '30%', logo: true },
  { color: 'var(--cube-orange)', radius: '50% 0 0 50%' },
  { color: 'var(--cube-red)', radius: '0' },
  { color: 'var(--cube-blue)', radius: '50% 50% 0 0' },
  { color: 'var(--cube-yellow)', radius: '0' }
]

export function CubeFace({ className }: { className?: string }) {
  return (
    <span
      className={cn('grid aspect-square grid-cols-3 grid-rows-3', className)}
      style={{
        containerType: 'inline-size',
        backgroundColor: 'oklch(0.155 0.022 268)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 13cqw 31cqw -12cqw rgba(0,0,0,0.7)'
      }}
    >
      {FACE.map((sticker, i) => (
        <span
          key={i}
          className="relative block"
          style={{
            backgroundColor: sticker.color,
            borderRadius: sticker.radius,
            boxShadow: 'inset 0 -1.3cqw 0 rgba(0,0,0,0.24), inset 0 0.9cqw 0 rgba(255,255,255,0.24)'
          }}
        >
          {sticker.logo ? (
            <Image
              src="/logo.png"
              alt=""
              width={64}
              height={64}
              unoptimized
              className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          ) : null}
        </span>
      ))}
    </span>
  )
}
