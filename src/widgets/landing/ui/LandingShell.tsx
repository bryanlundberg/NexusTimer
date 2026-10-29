'use client'

import { ReactNode, useRef, useState } from 'react'
import { LazyMotion } from 'motion/react'
import { useLenis } from '../model/useLenis'
import LandingHeader from './LandingHeader'
import PinnedBar from './PinnedBar'
import HeroPanel from './HeroPanel'
import PlatformSection from './PlatformSection'
import UnifiedSection from './UnifiedSection'
import TestimonialRotator from './TestimonialRotator'
import FeatureGrid from './FeatureGrid'
import OpenSourceSection from './OpenSourceSection'
import FaqSection from './FaqSection'
import ClosingPanel from './ClosingPanel'
import RailFrame from './RailFrame'
import SectionBand from './SectionBand'
import { frame } from '../lib/rails'

const loadMotionFeatures = () => import('../model/motionFeatures').then((mod) => mod.default)

export default function LandingShell({ footer }: { footer: ReactNode }) {
  const [pastHero, setPastHero] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLenis(containerRef, contentRef)

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div className="lp-root lp-night relative h-dvh w-dvw overflow-hidden text-foreground">
        <div
          ref={containerRef}
          onScroll={(e) => setPastHero(e.currentTarget.scrollTop > e.currentTarget.clientHeight - 64)}
          className="relative h-full overflow-y-auto overflow-x-hidden"
        >
          <div ref={contentRef} className="flex min-h-full flex-col">
            <div className={frame}>
              <PinnedBar showAction={pastHero} />
              <LandingHeader />

              <main>
                <HeroPanel />
                <RailFrame>
                  <PlatformSection />
                  <SectionBand variant="hatch" />
                  <UnifiedSection />
                  <SectionBand />
                  <TestimonialRotator />
                  <SectionBand variant="hatch" />
                  <FeatureGrid />
                  <SectionBand />
                  <OpenSourceSection />
                  <SectionBand variant="hatch" />
                  <FaqSection />
                  <SectionBand />
                </RailFrame>
                <ClosingPanel />
              </main>

              {footer}
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}
