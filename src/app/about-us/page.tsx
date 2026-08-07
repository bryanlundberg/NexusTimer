import type { Metadata } from 'next'
import LandingFooter from '@/app/_landing/LandingFooter'
import AboutContent from './AboutContent'
import { ABOUT } from './content'

export const metadata: Metadata = {
  title: ABOUT.metaTitle,
  description: ABOUT.metaDescription,
  alternates: {
    canonical: '/about-us'
  },
  openGraph: {
    title: ABOUT.metaTitle,
    description: ABOUT.metaDescription,
    url: '/about-us',
    type: 'article'
  }
}

export default function AboutUsPage() {
  return (
    <>
      <AboutContent />
      <div className="bg-neutral-950">
        <LandingFooter />
      </div>
    </>
  )
}
