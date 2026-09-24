'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useReducedMotion } from 'motion/react'
import { LandingHero } from './LandingHero'
import { useLenis } from './useLenis'
import LandingOutro from './LandingOutro'
import LandingBelowFold from './LandingBelowFold'
import { Nexi } from '@/shared/ui/nexi'
import * as React from 'react'
import { cn } from '@/shared/lib/utils'

const NAV = [
  { href: '/free-play', key: 'multiplayer', wide: false },
  { href: '/people', key: 'people', wide: false },
  { href: '/algorithms', key: 'algorithms', wide: true },
  { href: '/leaderboards', key: 'leaderboards', wide: true }
] as const

export default function LandingShell({ footer }: { footer: ReactNode }) {
  const t = useTranslations('LandingPage')
  const tAuth = useTranslations('Index.Auth')
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLenis(containerRef, contentRef)

  const { scrollYProgress } = useScroll({ container: containerRef })

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 24)
  }, [])

  return (
    <div className="lp-root relative w-dvw h-dvh bg-[var(--lp-bg)] overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 h-full text-gray-900 overflow-y-auto overflow-x-hidden"
      >
        <div ref={contentRef} className="flex flex-col min-h-full">
          {/* Scroll progress — a thin brand-blue line that tracks reading position */}
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left bg-primary"
            aria-hidden
          />

          <header className="sticky top-0 z-50 w-full px-3 sm:px-4">
            <motion.div
              initial={false}
              animate={scrolled ? 'pill' : 'bar'}
              variants={{
                bar: {
                  maxWidth: '80rem',
                  marginTop: '0rem',
                  borderRadius: '0px',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  backgroundColor: 'rgba(250,248,247,0)',
                  boxShadow: '0 0 0 0 rgba(0,0,0,0)',
                  backdropFilter: 'blur(0px)'
                },
                pill: {
                  maxWidth: '60rem',
                  marginTop: '0.75rem',
                  borderRadius: '9999px',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '0.55rem',
                  backgroundColor: 'rgba(255,255,255,0.90)',
                  boxShadow: '0 14px 40px -16px rgba(0,0,0,0.12)',
                  backdropFilter: 'blur(8px)'
                }
              }}
              transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <Nexi state="pb" size={38} />
                <span className="font-display text-base font-bold tracking-wide text-gray-900">NexusTimer</span>
              </div>
              <nav className="hidden md:flex items-center gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-gray-900',
                      item.wide && 'hidden lg:inline-flex'
                    )}
                  >
                    {t(`header.${item.key}`)}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-1.5 sm:gap-3">
                <Link
                  href="/sign-in"
                  className="hidden sm:inline-flex md:hidden lg:inline-flex whitespace-nowrap items-center rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-gray-900"
                >
                  {tAuth('sign-in')}
                </Link>
                <Link
                  href="/app"
                  className="group inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-gray-900 text-white px-4 sm:px-5 py-2 text-sm font-semibold hover:bg-gray-700 transition-all duration-300"
                >
                  {t('header.start-timing')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          </header>

          <main className="flex-1">
            <LandingHero scrollContainerRef={containerRef} />

            <LandingBelowFold />
          </main>

          <LandingOutro>{footer}</LandingOutro>
        </div>
      </div>
    </div>
  )
}
