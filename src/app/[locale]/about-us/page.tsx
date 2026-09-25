import type { Metadata } from 'next'
import LandingFooter from '@/widgets/landing/ui/LandingFooter'
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
    type: 'article',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: ABOUT.metaTitle }]
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
