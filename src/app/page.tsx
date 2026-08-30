import type { Metadata } from 'next'
import LandingShell from './_landing/LandingShell'
import LandingFooter from './_landing/LandingFooter'

export const metadata: Metadata = {
  alternates: {
    canonical: '/'
  }
}

export default function Page() {
  return <LandingShell footer={<LandingFooter />} />
}
