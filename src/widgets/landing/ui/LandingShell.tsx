'use client'

import { ReactNode, useRef, useState } from 'react'
import { LazyMotion } from 'motion/react'
import { useLenis } from '../model/useLenis'
import LandingHeader from './LandingHeader'
import HeroPanel from './HeroPanel'
import PlatformSection from './PlatformSection'
import UnifiedSection from './UnifiedSection'
import TestimonialRotator from './TestimonialRotator'
import FeatureGrid from './FeatureGrid'
import ClosingPanel from './ClosingPanel'

const loadMotionFeatures = () => import('../model/motionFeatures').then((mod) => mod.default)

export default function LandingShell({ footer }: { footer: ReactNode }) {
  const [compact, setCompact] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLenis(containerRef, contentRef)

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div className="lp-root lp-night relative h-dvh w-dvw overflow-hidden text-foreground">
        <div
          ref={containerRef}
          onScroll={(e) => setCompact(e.currentTarget.scrollTop > e.currentTarget.clientHeight * 0.6)}
          className="relative h-full overflow-y-auto overflow-x-hidden"
        >
          <div ref={contentRef} className="flex min-h-full flex-col">
            <LandingHeader compact={compact} />

            <main className="flex-1">
              <HeroPanel />
              <PlatformSection />
              <UnifiedSection />
              <TestimonialRotator />
              <FeatureGrid />
              <ClosingPanel />
            </main>

            <div className="mt-24 border-t border-border">{footer}</div>
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}
