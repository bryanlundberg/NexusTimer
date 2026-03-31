import Link from 'next/link'
import Image from 'next/image'

export default function LandingFooter() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="NexusTimer Logo" width={32} height={32} />
              <span className="text-xl font-bold text-gray-900">NexusTimer</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              The performance profile for cubers. Track, analyze, and improve your solves with per-cube statistics.
            </p>
            <Image
              src="/utils/android-apk.webp"
              alt="Download Nexus Connect App"
              width={200}
              height={60}
              className="mt-6 -ms-4"
              unoptimized
            />
          </div>

          <div className="grid-cols-3 gap-8 hidden md:grid">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-[0.15em]">Product</h4>
              <ul className="space-y-3">
                {[
                  { href: '/app', label: 'Timer App' },
                  { href: '/stats', label: 'Statistics' },
                  { href: '/free-play', label: 'Multiplayer' },
                  { href: '/algorithms', label: 'Algorithms' },
                  { href: '/leaderboards', label: 'Leaderboards' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-[0.15em]">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:contact.nexustimer@gmail.com"
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-[0.15em]">Community</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://discord.gg/eCgTKcavec"
                    target="_blank"
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                  >
                    Discord Server
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/NexusTimer"
                    target="_blank"
                    className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-300"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-gray-400 italic">
            NexusTimer is an independent project for the cubing community.
          </span>
          <span className="text-xs text-gray-400">© {new Date().getFullYear()} NexusTimer. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
