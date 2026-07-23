'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { ScrambleTexture } from './CubeDecor'

type Sticker = {
  n: number
  color: string
  ink: string
  title: string
  desc: string
  rotate: number
}

export default function StickerSteps() {
  const t = useTranslations('LandingPage')
  const reduce = useReducedMotion()

  const stickers: Sticker[] = [
    {
      n: 1,
      color: 'var(--cube-red)',
      ink: '#ffffff',
      title: t('how-it-works.step1-title'),
      desc: t('how-it-works.step1-desc'),
      rotate: -3
    },
    {
      n: 2,
      color: 'var(--cube-green)',
      ink: '#10231a',
      title: t('how-it-works.step2-title'),
      desc: t('how-it-works.step2-desc'),
      rotate: 2.5
    },
    {
      n: 3,
      color: 'var(--cube-orange)',
      ink: '#241204',
      title: t('how-it-works.step3-title'),
      desc: t('how-it-works.step3-desc'),
      rotate: -2
    },
    {
      n: 4,
      color: 'var(--cube-yellow)',
      ink: '#231d02',
      title: t('how-it-works.step4-title'),
      desc: t('how-it-works.step4-desc'),
      rotate: 3
    }
  ]

  return (
    <section className="lp-cv relative overflow-hidden py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 text-gray-900"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)'
        }}
      >
        <ScrambleTexture opacity={0.055} />
      </div>
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-balance text-3xl font-bold tracking-tight text-gray-900 md:text-5xl"
        >
          {t('how-it-works.title')}
        </motion.h2>
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-10 font-mono text-sm lowercase tracking-[0.25em] text-gray-600"
        >
          {t('how-it-works.peel-place-solve')}
        </motion.p>

        {/* The sticker sheet — a die-cut vinyl backing holding four stickers */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative notch-tl-br [--ntlbr:22px] p-4 sm:p-7"
          style={{
            backgroundColor: 'oklch(0.92 0.006 26)',
            border: '1px dashed rgba(0,0,0,0.10)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.60), inset 0 0 60px rgba(0,0,0,0.04)'
          }}
        >
          {/* registration crosses on the backing — printer's marks */}
          {['left-2.5 top-2.5', 'right-2.5 top-2.5', 'left-2.5 bottom-2.5', 'right-2.5 bottom-2.5'].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`pointer-events-none absolute ${pos} text-gray-900/20`}
              style={{ fontSize: 12, lineHeight: 1 }}
            >
              +
            </span>
          ))}

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {stickers.map((s, i) => (
              <motion.div
                key={s.n}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, rotate: s.rotate * 2, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, rotate: s.rotate, scale: 1 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduce ? undefined : { rotate: 0, scale: 1.03, y: -4 }}
                className="group relative"
                style={{ transformOrigin: 'center' }}
              >
                {/* die-cut sticker face */}
                <div
                  className="relative overflow-hidden notch-br [--nbr:18px] p-5 sm:p-6"
                  style={{
                    backgroundColor: s.color,
                    boxShadow: `0 14px 30px -16px ${s.color}, inset 0 0 0 2px rgba(255,255,255,0.18)`
                  }}
                >
                  {/* glossy vinyl sheen */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(157deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 26%, rgba(255,255,255,0) 46%, rgba(0,0,0,0.07) 100%)'
                    }}
                  />
                  {/* inner die-cut keyline */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-1.5 rounded-[14px]"
                    style={{ border: `1.5px dashed ${s.ink}`, opacity: 0.18 }}
                  />

                  <div className="relative" style={{ color: s.ink }}>
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-base font-black tabular-nums"
                        style={{ backgroundColor: 'rgba(0,0,0,0.14)', color: s.ink }}
                      >
                        {s.n}
                      </span>
                      <span
                        className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                        style={{ opacity: 0.55 }}
                      >
                        {`0${s.n} / 04`}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">{s.title}</h3>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed text-pretty" style={{ opacity: 0.82 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>

                {/* peeling corner — the sticker lifting off the backing */}
                <span
                  aria-hidden
                  className="absolute right-0 top-0"
                  style={{
                    width: 38,
                    height: 38,
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(206,210,220,0.28) 60%, rgba(150,155,165,0.18) 100%)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                    borderTopRightRadius: 18,
                    filter: 'drop-shadow(-3px 3px 3px rgba(0,0,0,0.4))'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
