interface Props {
  variant: 'signin' | 'signup'
}

// Hand-tuned positions so SSR is deterministic and shapes don't overlap the form
const SHAPES_SIGNIN = [
  { x: 8, y: 12, size: 14, color: '#ef4444', rotate: 12 },
  { x: 88, y: 18, size: 18, color: '#fde047', rotate: -8 },
  { x: 6, y: 78, size: 22, color: '#1d4ed8', rotate: 22 },
  { x: 90, y: 82, size: 16, color: '#22c55e', rotate: -16 },
  { x: 14, y: 45, size: 10, color: '#fb923c', rotate: 0 },
  { x: 82, y: 50, size: 12, color: '#ffffff', rotate: 30 }
]

const SHAPES_SIGNUP = [
  { x: 12, y: 20, size: 28, color: '#1d4ed8', rotate: -18 },
  { x: 82, y: 12, size: 20, color: '#ef4444', rotate: 24 },
  { x: 90, y: 70, size: 24, color: '#fde047', rotate: -12 },
  { x: 4, y: 82, size: 18, color: '#22c55e', rotate: 16 },
  { x: 22, y: 8, size: 12, color: '#fb923c', rotate: 8 },
  { x: 70, y: 88, size: 14, color: '#ffffff', rotate: -20 }
]

export default function AuthBackground({ variant }: Props) {
  const shapes = variant === 'signin' ? SHAPES_SIGNIN : SHAPES_SIGNUP

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Radial gradient base */}
      <div
        className="absolute inset-0 opacity-60 dark:opacity-30"
        style={{
          backgroundImage:
            variant === 'signin'
              ? 'radial-gradient(ellipse at top, color-mix(in oklch, var(--color-primary) 12%, transparent), transparent 60%)'
              : 'radial-gradient(ellipse at bottom right, color-mix(in oklch, var(--color-primary) 14%, transparent), transparent 65%)'
        }}
      />

      {/* Dotted grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.08] dark:opacity-[0.12]" aria-hidden>
        <defs>
          <pattern id={`dots-${variant}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${variant})`} />
      </svg>

      {/* Floating WCA squares */}
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animation: `authFloat ${4 + (i % 3)}s ease-in-out ${i * 0.4}s infinite alternate`
          }}
        >
          <div
            className="rounded-md border-2 border-black/80 dark:border-white/20 shadow-lg"
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              transform: `rotate(${s.rotate}deg)`
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes authFloat {
          from { transform: translateY(0); }
          to { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}
