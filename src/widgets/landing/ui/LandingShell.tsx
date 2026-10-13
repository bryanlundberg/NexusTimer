'use client'

import { ReactNode } from 'react'
import { Link } from '@/shared/config/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { LazyMotion, useScroll, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { LandingHero } from './LandingHero'
import { useLenis } from '../model/useLenis'
import LandingOutro from './LandingOutro'
import LandingBelowFold from './LandingBelowFold'
import { BrandMark } from '@/widgets/sidebar/ui/brand-mark'
import * as React from 'react'
import { cn } from '@/shared/lib/utils'

const NAV = [
  { href: '/app', page: 'timer', wide: false },
  { href: '/leaderboards', page: 'leaderboards', wide: false },
  { href: '/people', page: 'community', wide: true },
  { href: '/algorithms/trainer', page: 'trainer', wide: true }
] as const

const loadMotionFeatures = () => import('../model/motionFeatures').then((mod) => mod.default)

export default function LandingShell({ footer }: { footer: ReactNode }) {
  const t = useTranslations('LandingPage')
  const tPages = useTranslations('Metadata.pages')
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
    <LazyMotion features={loadMotionFeatures} strict>
      <div className="lp-root relative w-dvw h-dvh bg-[var(--lp-bg)] overflow-hidden">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative z-10 h-full text-gray-900 overflow-y-auto overflow-x-hidden"
        >
          <div ref={contentRef} className="flex flex-col min-h-full">
            {/* Scroll progress — a thin brand-blue line that tracks reading position */}
            <m.div
              style={{ scaleX: scrollYProgress }}
              className="fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left bg-primary"
              aria-hidden
            />

            <header className="sticky top-0 z-50 w-full px-3 sm:px-4">
              <m.div
                initial={false}
                animate={scrolled ? 'floating' : 'bar'}
                variants={{
                  bar: {
                    maxWidth: '80rem',
                    marginTop: '0rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    backgroundColor: 'rgba(255,255,255,0)',
                    borderColor: 'rgba(17,24,39,0)',
                    boxShadow: '0 0 0 0 rgba(0,0,0,0)',
                    backdropFilter: 'blur(0px)'
                  },
                  floating: {
                    maxWidth: '64rem',
                    marginTop: '0.75rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.5rem',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderColor: 'rgba(17,24,39,0.1)',
                    boxShadow: '0 14px 40px -16px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(8px)'
                  }
                }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="notch-bl-tr mx-auto flex items-center justify-between gap-3 border"
              >
                <div className="flex items-center gap-2">
                  <BrandMark />
                  <span className="font-brand text-base leading-tight font-bold tracking-tight">
                    <span className="text-gray-900">NEXUSTIMER</span>
                    <span className="text-gray-500">.COM</span>
                  </span>
                </div>
                <nav className="hidden md:flex items-center gap-1">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'inline-flex h-9 items-center whitespace-nowrap px-3 text-sm font-medium text-gray-600 transition-colors duration-300 hover:bg-gray-900/5 hover:text-gray-900',
                        item.wide && 'hidden lg:inline-flex'
                      )}
                    >
                      {tPages(`${item.page}.title`)}
                    </Link>
                  ))}
                </nav>
                <Link
                  href="/app"
                  className="group btn-notch inline-flex h-9 items-center gap-2 whitespace-nowrap bg-primary px-4 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 active:scale-[0.97] pointer-coarse:h-10 sm:px-5"
                >
                  {t('header.start-timing')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </m.div>
            </header>

            <main className="flex-1">
              <LandingHero />

              <LandingBelowFold />
            </main>

            <LandingOutro>{footer}</LandingOutro>
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}
