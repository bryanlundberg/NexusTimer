'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Menu } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useReducedMotion } from 'motion/react'
import { LandingHero } from './LandingHero'
import { useLenis } from './useLenis'
import LandingOutro from './LandingOutro'
import LandingBelowFold from './LandingBelowFold'
import { Nexi } from '@/shared/ui/nexi'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import * as React from 'react'

const REPO_URL = 'https://github.com/bryanlundberg/NexusTimer'

export default function LandingShell({ footer }: { footer: ReactNode }) {
  const t = useTranslations('LandingPage')
  const tAuth = useTranslations('Index.Auth')
  const tInputs = useTranslations('Index.Inputs')
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLenis(containerRef, contentRef)

  const { scrollYProgress } = useScroll({ container: containerRef })

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 24)
  }, [])

  const navLinks = [
    { href: '/people', label: t('header.people'), external: false },
    { href: '/algorithms', label: t('header.algorithms'), external: false },
    { href: '/leaderboards', label: t('header.leaderboards'), external: false },
    { href: REPO_URL, label: t('header.github'), external: true }
  ]

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
                  maxWidth: '52rem',
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
              <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-gray-900 transition-colors duration-300 relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="hover:text-gray-900 transition-colors duration-300 relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                    </Link>
                  )
                )}
              </nav>
              <div className="flex items-center gap-1.5 sm:gap-3">
                <Link
                  href="/sign-in"
                  className="hidden sm:inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-gray-900"
                >
                  {tAuth('sign-in')}
                </Link>
                <Link
                  href="/app"
                  className="group inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 sm:px-5 py-2 text-sm font-semibold hover:bg-gray-700 transition-all duration-300"
                >
                  {t('header.start-timing')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      aria-label={tInputs('menu')}
                      className="md:hidden inline-flex size-9 items-center justify-center rounded-full text-gray-700 transition-colors duration-300 hover:bg-gray-900/5 hover:text-gray-900"
                    >
                      <Menu className="size-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    aria-describedby={undefined}
                    className="w-[17rem] bg-[var(--lp-bg)] text-gray-900"
                  >
                    <SheetTitle className="px-5 pt-5 font-display text-base font-bold tracking-wide text-gray-900">
                      NexusTimer
                    </SheetTitle>
                    <nav className="flex flex-col px-2 pt-2">
                      {navLinks.map((link) =>
                        link.external ? (
                          <SheetClose asChild key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-900/5 hover:text-gray-900"
                            >
                              {link.label}
                            </a>
                          </SheetClose>
                        ) : (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className="rounded-lg px-3 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-900/5 hover:text-gray-900"
                            >
                              {link.label}
                            </Link>
                          </SheetClose>
                        )
                      )}
                    </nav>
                    <div className="mt-auto flex flex-col gap-2 border-t border-gray-900/10 p-4">
                      <SheetClose asChild>
                        <Link
                          href="/sign-in"
                          className="notch-tl-br inline-flex items-center justify-center border border-gray-900/15 px-5 py-3 text-sm font-medium text-gray-800 transition-colors [--ntlbr:10px] hover:bg-gray-900/5"
                        >
                          {tAuth('sign-in')}
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/app"
                          className="notch-bl-tr inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-white transition-all [--nblt:10px] hover:brightness-110"
                        >
                          {t('header.start-timing')}
                          <ArrowRight className="size-4" />
                        </Link>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
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
