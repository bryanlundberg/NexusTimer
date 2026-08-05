import { cn } from '@/shared/lib/utils'

const SOFT = 0.4

type IconProps = { className?: string; title?: string }

function FaceGrid({ n, opacity = 1 }: { n: number; opacity?: number }) {
  const gap = n <= 3 ? 2.4 : n <= 5 ? 1.7 : 1.2
  const size = (32 - (n - 1) * gap) / n
  const rx = Math.min(1.2, size * 0.22)

  return (
    <g opacity={opacity}>
      {Array.from({ length: n * n }, (_, i) => (
        <rect
          key={i}
          x={(i % n) * (size + gap)}
          y={Math.floor(i / n) * (size + gap)}
          width={size}
          height={size}
          rx={rx}
        />
      ))}
    </g>
  )
}

function SquareOneFace() {
  const c = 16
  const h = 15
  const shrink = 0.85

  const edge = (deg: number): [number, number] => {
    const a = (deg * Math.PI) / 180
    const dx = Math.sin(a)
    const dy = -Math.cos(a)
    const t = h / Math.max(Math.abs(dx), Math.abs(dy))
    return [c + dx * t, c + dy * t]
  }

  const toPath = (poly: [number, number][]) => {
    const cx = poly.reduce((sum, p) => sum + p[0], 0) / poly.length
    const cy = poly.reduce((sum, p) => sum + p[1], 0) / poly.length
    const points = poly
      .map(([x, y]) => `${(cx + (x - cx) * shrink).toFixed(2)} ${(cy + (y - cy) * shrink).toFixed(2)}`)
      .join('L')
    return `M${points}Z`
  }

  const centre: [number, number] = [c, c]

  return (
    <>
      {[45, 135, 225, 315].map((corner) => (
        <path key={`kite-${corner}`} d={toPath([centre, edge(corner - 30), edge(corner), edge(corner + 30)])} />
      ))}
      {[0, 90, 180, 270].map((mid) => (
        <path key={`edge-${mid}`} opacity={SOFT} d={toPath([centre, edge(mid - 15), edge(mid + 15)])} />
      ))}
    </>
  )
}

function ClockFace(props: IconProps) {
  const c = 16
  const radius = 14
  const bumpDistance = 13
  const bumpRadius = 2.6
  const step = 7.2
  const dial = 2.8
  const handAngles = [300, 20, 95, 150, 270, 40, 210, 330, 80]

  const crossings = [45, 135, 225, 315].map((deg) => {
    const a = (deg * Math.PI) / 180
    const ux = Math.cos(a)
    const uy = Math.sin(a)
    const along = (bumpDistance ** 2 + radius ** 2 - bumpRadius ** 2) / (2 * bumpDistance)
    const off = Math.sqrt(radius ** 2 - along ** 2)
    const mx = c + along * ux
    const my = c + along * uy
    return {
      enter: [mx + off * uy, my - off * ux] as const,
      exit: [mx - off * uy, my + off * ux] as const
    }
  })

  const round = (n: number) => n.toFixed(2)
  const bodyPath =
    `M${round(crossings[0].enter[0])} ${round(crossings[0].enter[1])}` +
    crossings
      .map((crossing, i) => {
        const next = crossings[(i + 1) % crossings.length].enter
        return (
          `A${bumpRadius} ${bumpRadius} 0 0 1 ${round(crossing.exit[0])} ${round(crossing.exit[1])}` +
          `A${radius} ${radius} 0 0 1 ${round(next[0])} ${round(next[1])}`
        )
      })
      .join('') +
    'Z'

  return (
    <Svg {...props}>
      <path d={bodyPath} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />

      {handAngles.map((angle, i) => {
        const cx = c + ((i % 3) - 1) * step
        const cy = c + (Math.floor(i / 3) - 1) * step
        const a = ((angle - 90) * Math.PI) / 180
        const length = dial * 0.82

        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={dial} opacity={SOFT} />
            <path
              d={`M${cx} ${cy}L${round(cx + length * Math.cos(a))} ${round(cy + length * Math.sin(a))}`}
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          </g>
        )
      })}

      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1]
      ].map(([sx, sy], i) => (
        <circle key={i} cx={c + (sx * step) / 2} cy={c + (sy * step) / 2} r="0.95" />
      ))}
    </Svg>
  )
}

function MegaminxFace(props: IconProps) {
  const c = 16
  const radius = 15
  const centreRatio = 0.45
  const cut = 0.34
  const shrink = 0.9
  type P = [number, number]

  const at = (i: number, r: number): P => {
    const a = ((-90 + 72 * i) * Math.PI) / 180
    return [c + r * Math.cos(a), c + r * Math.sin(a)]
  }
  const lerp = (p: P, q: P, t: number): P => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]

  const outer = [0, 1, 2, 3, 4].map((i) => at(i, radius))
  const inner = [0, 1, 2, 3, 4].map((i) => at(i, radius * centreRatio))
  const near = outer.map((v, i) => lerp(v, outer[(i + 1) % 5], cut))
  const far = outer.map((v, i) => lerp(v, outer[(i + 1) % 5], 1 - cut))

  const toPath = (poly: P[]) => {
    const cx = poly.reduce((sum, p) => sum + p[0], 0) / poly.length
    const cy = poly.reduce((sum, p) => sum + p[1], 0) / poly.length
    const points = poly
      .map(([x, y]) => `${(cx + (x - cx) * shrink).toFixed(2)} ${(cy + (y - cy) * shrink).toFixed(2)}`)
      .join('L')
    return `M${points}Z`
  }

  return (
    <Svg {...props}>
      {outer.map((vertex, i) => (
        <path key={`corner-${i}`} d={toPath([vertex, near[i], inner[i], far[(i + 4) % 5]])} />
      ))}
      {outer.map((_, i) => (
        <path key={`edge-${i}`} opacity={SOFT} d={toPath([near[i], far[i], inner[(i + 1) % 5], inner[i]])} />
      ))}
      <path d={toPath(inner)} />
    </Svg>
  )
}

function SkewbFace(props: IconProps) {
  const m = 1
  const shrink = 0.88
  type P = [number, number]

  const [tl, tr, br, bl]: P[] = [
    [m, m],
    [32 - m, m],
    [32 - m, 32 - m],
    [m, 32 - m]
  ]
  const [top, right, bottom, left]: P[] = [
    [16, m],
    [32 - m, 16],
    [16, 32 - m],
    [m, 16]
  ]

  const toPath = (poly: P[]) => {
    const cx = poly.reduce((sum, p) => sum + p[0], 0) / poly.length
    const cy = poly.reduce((sum, p) => sum + p[1], 0) / poly.length
    const points = poly
      .map(([x, y]) => `${(cx + (x - cx) * shrink).toFixed(2)} ${(cy + (y - cy) * shrink).toFixed(2)}`)
      .join('L')
    return `M${points}Z`
  }

  const corners: P[][] = [
    [tl, top, left],
    [top, tr, right],
    [right, br, bottom],
    [bottom, bl, left]
  ]

  return (
    <Svg {...props}>
      {corners.map((tri, i) => (
        <path key={i} d={toPath(tri)} />
      ))}
      <path d={toPath([top, right, bottom, left])} opacity={SOFT} />
    </Svg>
  )
}

function OctahedronFace(props: IconProps) {
  const c = 16
  const m = 1
  const shrink = 0.85
  type P = [number, number]

  const corners: P[] = [
    [m, m],
    [32 - m, m],
    [32 - m, 32 - m],
    [m, 32 - m]
  ]

  const mid = (p: P, q: P): P => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]

  const toPath = (tri: P[]) => {
    const cx = tri.reduce((sum, p) => sum + p[0], 0) / 3
    const cy = tri.reduce((sum, p) => sum + p[1], 0) / 3
    const points = tri
      .map(([x, y]) => `${(cx + (x - cx) * shrink).toFixed(2)} ${(cy + (y - cy) * shrink).toFixed(2)}`)
      .join('L')
    return `M${points}Z`
  }

  return (
    <Svg {...props}>
      {corners.map((corner, i) => {
        const a = corner
        const b = corners[(i + 1) % 4]
        const centre: P = [c, c]
        const ab = mid(a, b)
        const bc = mid(b, centre)
        const ca = mid(centre, a)

        return (
          <g key={i}>
            <path d={toPath([a, ab, ca])} />
            <path d={toPath([ab, b, bc])} />
            <path d={toPath([ca, bc, centre])} />
            <path d={toPath([ab, bc, ca])} opacity={SOFT} />
          </g>
        )
      })}
    </Svg>
  )
}

function Svg({ className, title, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-full w-full', className)}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  )
}

function Blindfold({ n, ...props }: IconProps & { n: number }) {
  return (
    <Svg {...props}>
      <FaceGrid n={n} opacity={SOFT} />
      <rect x="0" y="12" width="32" height="8" rx="4" />
      <rect x="14.5" y="12" width="3" height="8" fill="none" stroke="currentColor" strokeWidth="0.9" opacity={0.35} />
    </Svg>
  )
}

function Virtual({ n, ...props }: IconProps & { n: number }) {
  return (
    <Svg {...props}>
      <rect x="1.5" y="2" width="29" height="19" rx="2.4" fill="none" stroke="currentColor" strokeWidth="2" />
      <g transform="translate(11.75 6.25) scale(0.265)">
        <FaceGrid n={n} />
      </g>
      <g opacity={SOFT}>
        <rect x="5" y="24" width="22" height="6.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={7.4 + i * 3.9} y="26.4" width="2.4" height="1.8" rx="0.4" />
        ))}
      </g>
    </Svg>
  )
}

const ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  '2x2': (p) => (
    <Svg {...p}>
      <FaceGrid n={2} />
    </Svg>
  ),
  '3x3': (p) => (
    <Svg {...p}>
      <FaceGrid n={3} />
    </Svg>
  ),
  '4x4': (p) => (
    <Svg {...p}>
      <FaceGrid n={4} />
    </Svg>
  ),
  '5x5': (p) => (
    <Svg {...p}>
      <FaceGrid n={5} />
    </Svg>
  ),
  '6x6': (p) => (
    <Svg {...p}>
      <FaceGrid n={6} />
    </Svg>
  ),
  '7x7': (p) => (
    <Svg {...p}>
      <FaceGrid n={7} />
    </Svg>
  ),

  '3x3 BLD': (p) => <Blindfold n={3} {...p} />,
  '4x4 BLD': (p) => <Blindfold n={4} {...p} />,

  '2x2 Virtual': (p) => <Virtual n={2} {...p} />,
  '3x3 Virtual': (p) => <Virtual n={3} {...p} />,

  '3x3 OH': (p) => (
    <Svg {...p}>
      <g transform="translate(10 3) scale(0.5078)">
        <FaceGrid n={3} />
      </g>
      <path d="M31.5 31.88 25.75 28.62H11L2.12 19.5v-1.5l0.38-0.38h1.5l7.5 7.5 10 0.26 1.12-0.63-1.12-0.63h-6l-1.12-0.87v-0.75l1.37-0.88 8.75 0.26 6.88 4.62z" />
    </Svg>
  ),

  Skewb: (p) => <SkewbFace {...p} />,

  SQ1: (p) => (
    <Svg {...p}>
      <SquareOneFace />
    </Svg>
  ),

  Megaminx: (p) => <MegaminxFace {...p} />,

  Pyraminx: (p) => (
    <Svg {...p}>
      <path d="M16 2.5 22.6 14H9.4z" />
      <path d="M8.2 16.2 14.8 27.7H1.6z" />
      <path d="M23.8 16.2 30.4 27.7H17.2z" />
      <path d="M16 27.7 9.4 16.2h13.2z" opacity={SOFT} />
    </Svg>
  ),

  FTO: (p) => <OctahedronFace {...p} />,

  Clock: (p) => <ClockFace {...p} />
}

export function CubeCategoryIcon({ category, className, title }: IconProps & { category: string }) {
  const Icon = ICONS[category]
  if (!Icon) {
    return (
      <Svg className={className} title={title ?? category}>
        <FaceGrid n={3} />
      </Svg>
    )
  }
  return <Icon className={className} title={title} />
}

export function hasCubeCategoryIcon(category: string) {
  return category in ICONS
}

export function CubeCategoryTile({
  category,
  className,
  title
}: {
  category: string
  className?: string
  title?: string
}) {
  return (
    <span
      title={title ?? category}
      data-tone="muted"
      className={cn(
        'icon-notch inline-flex size-9 shrink-0 items-center justify-center text-muted-foreground',
        className
      )}
    >
      <span className="size-6">
        <CubeCategoryIcon category={category} />
      </span>
    </span>
  )
}
