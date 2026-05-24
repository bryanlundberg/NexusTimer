const WCA = ['#ffffff', '#fde047', '#ef4444', '#fb923c', '#1d4ed8', '#22c55e']

// Pseudo-scrambled but deterministic so SSR matches
const SCRAMBLE = [2, 0, 4, 3, 1, 5, 0, 2, 3]

export default function CubeGrid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <filter id="grid-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="6" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.25" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#grid-shadow)" transform="rotate(-8 100 100)">
        <rect x="10" y="10" width="180" height="180" rx="14" fill="#0a0a0a" />
        {SCRAMBLE.map((colorIndex, i) => {
          const row = Math.floor(i / 3)
          const col = i % 3
          const x = 20 + col * 55
          const y = 20 + row * 55
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={50}
              height={50}
              rx={8}
              fill={WCA[colorIndex]}
              stroke="#0a0a0a"
              strokeWidth="2"
              style={{
                animation: `cubeGridIn 0.6s ease-out ${i * 0.05}s both`
              }}
            />
          )
        })}
      </g>

      <style>{`
        @keyframes cubeGridIn {
          from { opacity: 0; transform: scale(0.7); transform-origin: center; }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </svg>
  )
}
