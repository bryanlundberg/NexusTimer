'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { LandingHero } from './LandingHero'

const LandingBelowFold = dynamic(() => import('./LandingBelowFold'), {
  ssr: false,
  loading: () => null
})

export default function LandingShell({ featureTable, footer }: { featureTable: ReactNode; footer: ReactNode }) {
  const t = useTranslations('LandingPage')
  const [hidden, setHidden] = useState(false)
  const [showBelowFold, setShowBelowFold] = useState(false)
  const lastScrollY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const idle = (window as any).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1))
    const handle = idle(() => setShowBelowFold(true), { timeout: 2000 })
    return () => {
      const cancel = (window as any).cancelIdleCallback ?? clearTimeout
      cancel(handle)
    }
  }, [])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollY = e.currentTarget.scrollTop
      if (!showBelowFold && currentScrollY > 100) setShowBelowFold(true)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentScrollY
    },
    [showBelowFold]
  )

  return (
    <div className="relative w-dvw h-dvh bg-white overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 flex flex-col h-full text-gray-900 overflow-y-auto scroll-smooth"
      >
        <header
          style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)', opacity: hidden ? 0 : 1 }}
          className="w-full sticky top-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-gray-100 transition-all duration-300"
        >
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <Image className="invert p-0.5" src="/logo.png" alt="NexusTimer Logo" width={24} height={24} />
              </div>
              <span className="text-sm font-bold tracking-wide text-gray-900">NexusTimer</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-500">
              {[
                { href: '/people', label: t('header.people') },
                { href: '/algorithms', label: t('header.algorithms') },
                { href: '/leaderboards', label: t('header.leaderboards') }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-gray-900 transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              <a
                href="https://github.com/bryanlundberg/NexusTimer"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-900 transition-colors duration-300 relative group"
              >
                {t('header.github')}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300" />
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="group inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-5 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300"
              >
                <span className="hidden sm:inline">{t('header.start-timing')}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <LandingHero />

          {showBelowFold && <LandingBelowFold scrollContainerRef={containerRef} featureTable={featureTable} />}
        </main>

        {footer}
      </div>
    </div>
  )
}
