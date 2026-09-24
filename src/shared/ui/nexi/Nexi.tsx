import React from 'react'
import { cn } from '@/shared/lib/utils'
import styles from './nexi.module.css'

export type NexiState = 'idle' | 'empty' | 'solving' | 'loading' | 'pb' | 'hello' | 'wink' | 'think' | 'sleep' | 'oops'

interface NexiProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: NexiState
  size?: number
}

const stateClass: Record<NexiState, string> = {
  idle: styles.nexiIdle,
  empty: styles.nexiEmpty,
  solving: styles.nexiSolving,
  loading: styles.nexiLoading,
  pb: styles.nexiPb,
  hello: styles.nexiHello,
  wink: styles.nexiWink,
  think: styles.nexiThink,
  sleep: styles.nexiSleep,
  oops: styles.nexiOops
}

const cubeColors = [
  'var(--c-red)',
  'var(--c-blue)',
  'var(--c-green)',
  'var(--c-yellow)',
  'var(--c-orange)',
  'var(--c-white)'
]
const sparkPositions = [
  [8, 12],
  [86, 16],
  [16, 72],
  [80, 74],
  [50, 2],
  [94, 46],
  [2, 40]
]

const thinkDots = [
  [0.18, 0],
  [0.27, 0.22],
  [0.36, 0.44]
]

const sleepZs = [
  [0.1, 0.13, 0.14, 0],
  [0.15, 0.08, 0.12, 0.6],
  [0.2, 0.03, 0.1, 1.2]
]

export default function Nexi({ state = 'idle', size = 160, className, style, ...rest }: NexiProps) {
  return (
    <div
      {...rest}
      role="img"
      aria-label="Nexi"
      className={cn(styles.nexi, stateClass[state], className)}
      style={{ '--s': `${size}px`, ...style } as React.CSSProperties}
    >
      <div className={styles.shadow} />
      <div className={styles.body}>
        <div className={styles.face}>
          <div className={styles.brows}>
            <span />
            <span />
          </div>
          <div className={styles.eyes}>
            <div className={styles.eye} />
            <div className={styles.eye} />
          </div>
          <div className={styles.mouth} />
          <div className={styles.cheeks}>
            <span />
            <span />
          </div>
        </div>
        <div className={styles.sticker}>
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.sweat} />
      </div>

      <div className={styles.fx}>
        {state === 'loading' &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className={styles.orbit}
              style={{ '--c': cubeColors[i], animationDelay: `${-i * 0.47}s` } as React.CSSProperties}
            />
          ))}
        {state === 'think' &&
          thinkDots.map(([right, delay], i) => (
            <div
              key={`t${i}`}
              className={styles.thinkDot}
              style={{ right: `${right}em`, animationDelay: `${delay}s` } as React.CSSProperties}
            />
          ))}
        {state === 'sleep' &&
          sleepZs.map(([fontSize, top, right, delay], i) => (
            <div
              key={`z${i}`}
              className={styles.zzz}
              style={
                {
                  fontSize: `${fontSize}em`,
                  top: `${top}em`,
                  right: `${right}em`,
                  animationDelay: `${delay}s`
                } as React.CSSProperties
              }
            >
              z
            </div>
          ))}
        {state === 'pb' && (
          <>
            {sparkPositions.map(([left, top], i) => (
              <div
                key={`s${i}`}
                className={styles.spark}
                style={
                  {
                    left: `${left}%`,
                    top: `${top}%`,
                    '--c': cubeColors[i % cubeColors.length],
                    animationDelay: `${i * 0.16}s`
                  } as React.CSSProperties
                }
              />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`c${i}`}
                className={styles.confetti}
                style={
                  {
                    left: `${12 + i * 10}%`,
                    '--c': cubeColors[i % cubeColors.length],
                    animationDelay: `${i * 0.13}s`
                  } as React.CSSProperties
                }
              />
            ))}
          </>
        )}
      </div>

      {state === 'empty' && <div className={styles.qmark}>?</div>}
    </div>
  )
}
