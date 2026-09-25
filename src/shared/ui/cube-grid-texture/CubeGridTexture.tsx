import { cn } from '@/shared/lib/utils'

export function CubeGridTexture({ className, opacity = 0.05 }: { className?: string; opacity?: number }) {
  return (
    <svg aria-hidden className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern id="lp-isocube" width="112" height="128" patternUnits="userSpaceOnUse">
          {/* full iso cube with 3x3 face hints */}
          <g stroke="currentColor" strokeWidth="1" fill="none" opacity={opacity} transform="translate(28,26)">
            <path d="M0 14 28 0l28 14-28 14z" />
            <path d="M0 14v28l28 14V28z" />
            <path d="M56 14v28L28 56V28z" />
            {/* sticker seams */}
            <path d="M9.33 9.33 37.33 23.33M18.66 4.66 46.66 18.66M9.33 23.33l28 14M18.66 18.66l28 14" opacity="0.6" />
            <path d="M0 23.33 28 37.33M0 32.66l28 14M56 23.33l-28 14M56 32.66l-28 14" opacity="0.6" />
            <path d="M9.33 18.66v28M18.66 23.33v28M46.66 23.33v28M37.33 18.66v28" opacity="0.6" />
          </g>
          {/* a lone offset cube, smaller, for rhythm */}
          <g
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity={opacity * 0.7}
            transform="translate(84,92) scale(0.42)"
          >
            <path d="M0 14 28 0l28 14-28 14z" />
            <path d="M0 14v28l28 14V28z" />
            <path d="M56 14v28L28 56V28z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lp-isocube)" />
    </svg>
  )
}
