import { Layers } from '@/shared/types/enums'
import { FACE_COLOR_VAR } from '@/shared/const/face-colors'
import { cn } from '@/shared/lib/utils'

const PLASTIC = 'oklch(0.155 0.022 268)'
const IDLE_STICKER = 'oklch(0.3 0.014 268)'

const NOTCH = 'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%)'

const RING = [2, 1, 2, 1, 0, 1, 2, 1, 2]

interface FaceGlyphProps {
  color?: Layers | readonly Layers[] | null
  className?: string
}

export function FaceGlyph({ color, className }: FaceGlyphProps) {
  const colors: readonly Layers[] = !color ? [] : typeof color === 'string' ? [color] : color

  return (
    <span
      aria-hidden
      className={cn('relative inline-block size-4 shrink-0', className)}
      style={{ containerType: 'inline-size', backgroundColor: PLASTIC, clipPath: NOTCH }}
    >
      <span className="absolute grid grid-cols-3 grid-rows-3" style={{ inset: '8cqw', gap: '8cqw' }}>
        {RING.map((ring, i) => {
          const fill = colors.length ? FACE_COLOR_VAR[colors[i % colors.length]] : null

          return (
            <span
              key={i}
              className="transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none"
              style={{
                backgroundColor: fill ?? IDLE_STICKER,
                borderRadius: '14%',
                boxShadow: fill ? 'inset 0 -4cqw 0 rgba(0,0,0,0.22)' : undefined,
                transitionDelay: `${ring * 60}ms`
              }}
            />
          )
        })}
      </span>
    </span>
  )
}
