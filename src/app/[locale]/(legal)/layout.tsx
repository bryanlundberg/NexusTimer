import { Link } from '@/shared/config/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import LandingFooter from '@/widgets/landing/ui/LandingFooter'
import FooterSlab from '@/widgets/landing/ui/FooterSlab'
import { BrandMark } from '@/widgets/sidebar/ui/brand-mark'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="lp-root min-h-dvh bg-[var(--lp-bg)] text-gray-900">
        <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="font-brand text-base leading-tight font-bold tracking-tight">
              <span className="text-gray-900">NEXUSTIMER</span>
              <span className="text-gray-500">.COM</span>
            </span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors duration-300 hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </header>

        <main className="px-6 pb-24">{children}</main>
      </div>

      <div className="lp-root">
        <FooterSlab>
          <LandingFooter />
        </FooterSlab>
      </div>
    </>
  )
}
