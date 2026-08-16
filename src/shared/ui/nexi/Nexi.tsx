import React from 'react'
import { cn } from '@/shared/lib/utils'
import styles from './nexi.module.css'

export type NexiState = 'idle' | 'empty' | 'solving' | 'loading' | 'pb' | 'hello' | 'wink' | 'think' | 'sleep' | 'oops'

interface NexiProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: NexiState
  size?: number
}

const BODY = 'M32 12 H76 A6 6 0 0 1 82 18 V60 A16 16 0 0 1 66 76 H26 A8 8 0 0 1 18 68 V26 A14 14 0 0 1 32 12 Z'
const PLATE = 'M18 12 H82 V76 H18 Z'
const EYE_Y = 38
const EYE_L = 38
const EYE_R = 62
const SHOULDER_Y = 44.5

type EyeKind = 'open' | 'tall' | 'squint' | 'happy' | 'line'
type MouthKind = 'smile' | 'grin' | 'flat' | 'o' | 'frown' | 'smirk'

interface FaceSpec {
  left: EyeKind
  right: EyeKind
  mouth: MouthKind
  brows: [number, number, number]
  arms: [number, number | 'wave']
  cheeks?: boolean
}

const faces: Record<NexiState, FaceSpec> = {
  idle: { left: 'open', right: 'open', mouth: 'smile', brows: [0, 0, 0], arms: [6, -6] },
  empty: { left: 'tall', right: 'tall', mouth: 'smirk', brows: [-8, 8, -2], arms: [38, -38] },
  solving: { left: 'squint', right: 'squint', mouth: 'flat', brows: [14, -14, 2], arms: [-12, 12] },
  loading: { left: 'line', right: 'line', mouth: 'o', brows: [0, 0, 0], arms: [14, -14] },
  pb: { left: 'happy', right: 'happy', mouth: 'grin', brows: [-12, 12, -3], arms: [62, -62], cheeks: true },
  hello: { left: 'open', right: 'open', mouth: 'grin', brows: [-8, 8, -1], arms: [10, 'wave'], cheeks: true },
  wink: { left: 'open', right: 'happy', mouth: 'grin', brows: [-6, 10, -1], arms: [8, -52], cheeks: true },
  think: { left: 'tall', right: 'tall', mouth: 'smirk', brows: [-14, 4, -2], arms: [8, -68] },
  sleep: { left: 'line', right: 'line', mouth: 'o', brows: [0, 0, 1], arms: [-22, 22], cheeks: true },
  oops: { left: 'tall', right: 'tall', mouth: 'frown', brows: [-14, 14, 1], arms: [-28, 28] }
}

const stateClass: Record<NexiState, string> = {
  idle: styles.stIdle,
  empty: styles.stEmpty,
  solving: styles.stSolving,
  loading: styles.stLoading,
  pb: styles.stPb,
  hello: styles.stHello,
  wink: styles.stWink,
  think: styles.stThink,
  sleep: styles.stSleep,
  oops: styles.stOops
}

const cubeColors = ['var(--c-red)', 'var(--c-blue)', 'var(--c-green)', 'var(--c-yellow)', 'var(--c-orange)']
const sparkSpots = [
  [8, 20],
  [92, 22],
  [14, 74],
  [88, 70],
  [50, 2],
  [96, 46],
  [4, 46]
]

function Eye({ cx, kind }: { cx: number; kind: EyeKind }) {
  if (kind === 'happy') {
    return <path className={styles.eyeLine} d={`M${cx - 8} ${EYE_Y + 4} Q${cx} ${EYE_Y - 8} ${cx + 8} ${EYE_Y + 4}`} />
  }
  if (kind === 'line') {
    return <path className={styles.eyeLine} d={`M${cx - 8} ${EYE_Y} H${cx + 8}`} />
  }
  const h = kind === 'squint' ? 6 : kind === 'tall' ? 17 : 14
  return (
    <g>
      <rect className={styles.eye} x={cx - 5.5} y={EYE_Y - h / 2} width={11} height={h} rx={3} />
      {kind !== 'squint' && (
        <rect className={styles.glint} x={cx - 4} y={EYE_Y - h / 2 + 1.5} width={3.5} height={3.5} rx={1} />
      )}
    </g>
  )
}

function Mouth({ kind }: { kind: MouthKind }) {
  switch (kind) {
    case 'grin':
      return (
        <g>
          <path className={styles.mouthFill} d="M40 49 Q50 64 60 49 Z" />
          <path className={styles.tongue} d="M45 57 Q50 63 55 57 Z" />
        </g>
      )
    case 'o':
      return <circle className={styles.mouthLine} cx={50} cy={53} r={4.5} />
    case 'flat':
      return <path className={styles.mouthLine} d="M43 54 H57" />
    case 'frown':
      return <path className={styles.mouthLine} d="M42 57 Q50 48 58 57" />
    case 'smirk':
      return <path className={styles.mouthLine} d="M45 53 Q50 58 55 52" />
    default:
      return <path className={styles.mouthLine} d="M42 50 Q50 59 58 50" />
  }
}

export default function Nexi({ state = 'idle', size = 160, className, style, ...rest }: NexiProps) {
  const spec = faces[state]
  const [browL, browR, browDy] = spec.brows
  const [armL, armR] = spec.arms

  return (
    <div
      {...rest}
      role="img"
      aria-label="Nexi"
      className={cn(styles.nexi, stateClass[state], className)}
      style={{ '--s': `${size}px`, ...style } as React.CSSProperties}
    >
      <svg viewBox="0 0 100 100" className={styles.svg} aria-hidden="true">
        <path className={styles.plate} d={PLATE} />

        <g className={styles.figure}>
          <g className={styles.limbs}>
            <rect x={4} y={40} width={17} height={9} rx={4.5} transform={`rotate(${armL} 20 ${SHOULDER_Y})`} />
            {armR === 'wave' ? (
              <rect className={styles.wave} x={79} y={40} width={17} height={9} rx={4.5} />
            ) : (
              <rect x={79} y={40} width={17} height={9} rx={4.5} transform={`rotate(${armR} 80 ${SHOULDER_Y})`} />
            )}
            <rect x={26} y={70} width={16} height={12} rx={4} />
            <rect x={52} y={70} width={16} height={12} rx={4} />
          </g>

          <path className={styles.body} d={BODY} />

          {spec.cheeks && (
            <g className={styles.cheeks}>
              <rect x={25} y={45} width={11} height={5} rx={2.5} />
              <rect x={64} y={45} width={11} height={5} rx={2.5} />
            </g>
          )}

          <g className={styles.brows} style={{ transform: `translateY(${browDy}px)` }}>
            <rect x={30} y={24} width={15} height={4} rx={2} transform={`rotate(${browL} 37.5 26)`} />
            <rect x={55} y={24} width={15} height={4} rx={2} transform={`rotate(${browR} 62.5 26)`} />
          </g>

          <g className={styles.eyes}>
            <Eye cx={EYE_L} kind={spec.left} />
            <Eye cx={EYE_R} kind={spec.right} />
          </g>

          <Mouth kind={spec.mouth} />

          {state === 'solving' && <path className={styles.sweat} d="M72 20 L78 31 A6 6 0 0 1 66 31 Z" />}
        </g>

        <g className={styles.fx}>
          {state === 'loading' &&
            [0, 1, 2].map((i) => (
              <rect
                key={`o${i}`}
                className={styles.orbit}
                x={45}
                y={39}
                width={10}
                height={10}
                rx={2}
                style={{ fill: cubeColors[i], animationDelay: `${-i * 0.47}s` }}
              />
            ))}

          {state === 'think' &&
            [0, 1, 2].map((i) => (
              <rect
                key={`t${i}`}
                className={styles.thinkDot}
                x={62 + i * 11}
                y={2}
                width={6}
                height={6}
                rx={1.5}
                style={{ animationDelay: `${i * 0.22}s` }}
              />
            ))}

          {state === 'sleep' &&
            [0, 1, 2].map((i) => (
              <g key={`z${i}`} transform={`translate(${82 + i * 5} ${16 - i * 6})`}>
                <text
                  className={styles.zzz}
                  fontSize={11 + i * 4}
                  style={{ animationDelay: `${i * 0.6}s` }}
                  textAnchor="middle"
                >
                  z
                </text>
              </g>
            ))}

          {state === 'empty' && (
            <text className={styles.qmark} x={88} y={16} fontSize={22} textAnchor="middle">
              ?
            </text>
          )}

          {state === 'pb' && (
            <>
              {sparkSpots.map(([x, y], i) => (
                <g key={`s${i}`} transform={`translate(${x} ${y})`}>
                  <path
                    className={styles.spark}
                    d="M0 -7 L2 -2 7 0 2 2 0 7 -2 2 -7 0 -2 -2 Z"
                    style={{ fill: cubeColors[i % cubeColors.length], animationDelay: `${i * 0.16}s` }}
                  />
                </g>
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <g key={`c${i}`} transform={`translate(${12 + i * 10} 6)`}>
                  <rect
                    className={styles.confetti}
                    x={-3}
                    y={-4}
                    width={6}
                    height={8}
                    rx={1.5}
                    style={{ fill: cubeColors[i % cubeColors.length], animationDelay: `${i * 0.13}s` }}
                  />
                </g>
              ))}
            </>
          )}
        </g>
      </svg>
    </div>
  )
}
