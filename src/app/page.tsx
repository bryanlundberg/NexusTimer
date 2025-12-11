'use client'
import Link from 'next/link'
import Dither from '@/components/ui/shadcn-io/dither'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  AudioWaveform,
  BarChart3,
  Check,
  DatabaseZap,
  Globe,
  StarIcon,
  Timer,
  TriangleAlert,
  Users,
  XIcon
} from 'lucide-react'
import Image from 'next/image'
import { TextGenerateEffect } from '@/components/ui/shadcn-io/text-generate-effect'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/shared/lib/utils';

export default function Page() {
  return (
    <div className="relative w-dvw h-dvh bg-black overflow-hidden">
      {/* Animated background */}
      <Dither
        waveSpeed={0.05}
        waveFrequency={5}
        waveAmplitude={0.5}
        waveColor={[0.2, 0.111, 0.3]}
        colorNum={4}
        pixelSize={3}
        enableMouseInteraction={true}
        mouseRadius={1.2}
        className="absolute inset-0"
      />

      {/* Content overlay */}
      <ScrollArea className="relative z-10 flex flex-col h-full text-white overflow-y-auto snap-y snap-mandatory">
        {/* Header / Nav */}
        <header className="w-full">
          <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
                <div className="h-3 w-3 bg-fuchsia-400 rounded-sm"/>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white/90">NexusTimer</span>
            </div>
            <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
              <Link href="/#features" className="hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/#how" className="hover:text-white transition-colors">
                How it works?
              </Link>
              <a
                href="https://github.com/bryanlundberg/NexusTimer"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Enter
              </Link>
              <Button
                onClick={() => signIn('google', { redirectTo: '/app' })}
                className="inline-flex items-center rounded-md border border-fuchsia-400/30 bg-fuchsia-400/10 px-3.5 py-2 text-sm font-semibold text-white hover:bg-fuchsia-400/20 transition-colors"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">
          {/* Hero */}
          <section className="relative">
            <div className="mx-auto max-w-4xl px-6 pt-12 pb-20 md:pt-20 md:pb-28 text-center relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/70 mx-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>
                Nexus Timer is free and always will be!
              </div>

              <TextGenerateEffect
                words={'Track, improve, and compete in your cubing journey.'}
                className={'mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight'}
              />

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center rounded-md bg-white text-black font-semibold px-4 py-2.5 text-sm hover:bg-white/90 transition-colors pl-2"
                >
                  <Image src={'/landing/cube.gif'} alt={''} width={32} height={32} unoptimized/>
                  Start now
                </Link>
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                >
                  Demo
                </Link>
              </div>
              <div className="mx-auto w-fit mt-6 flex items-center gap-4 text-xs text-white/60">
                <div className="flex -space-x-1.5">
                  <Image
                    className="inline-block h-6 w-6 rounded-full border border-white/20"
                    src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
                    alt="avatar 1"
                    width={24}
                    height={24}
                  />
                  <Image
                    className="inline-block h-6 w-6 rounded-full border border-white/20"
                    src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_2.png"
                    alt="avatar 2"
                    width={24}
                    height={24}
                  />
                  <Image
                    className="inline-block h-6 w-6 rounded-full border border-white/20"
                    src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_7.png"
                    alt="avatar 3"
                    width={24}
                    height={24}
                  />
                </div>
                <span>Join a growing community of cubers</span>
              </div>
            </div>
          </section>

          {/* Integrations & Compatibility */}
          <section id="integrations" className="relative">
            <div className="mx-auto w-fit px-6 py-6 md:py-10">
              <div className="rounded-xl border border-white/15 bg-black/30 p-5 md:p-6">
                <div className="flex flex-col md:items-center md:justify-between gap-4">
                  <h3 className="text-lg md:text-xl font-semibold">Works with your favorite brands</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {['GAN', 'MoYu', 'QiYi', 'DaYan', 'YJ', 'ShengShou', 'YuXin', 'DianSheng', 'And More..'].map(
                      (item) => (
                        <span
                          key={item}
                          className="inline-flex items-center rounded-md border border-fuchsia-300 bg-fuchsia-500/50 px-2.5 py-1 text-xs text-white/80"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
              <h2 className="text-center text-2xl md:text-3xl font-semibold mb-8">
                What <span className="text-fuchsia-400">Nexus Timer</span> can do for you
              </h2>

              <div className="p-4 md:p-6 py-10 md:py-12">
                {/* Left image column + 2x2 cards on the right (non-sticky) */}
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                  {/* Left image column */}
                  <div className="relative">
                    <Image
                      src="/landing/2.png"
                      alt="NexusTimer preview"
                      width={800}
                      height={1000}
                      className="w-full h-full max-h-[400px] md:max-h-max object-cover border-6 border-fuchsia-500 overflow-hidden rounded-lg -rotate-1"
                    />
                  </div>

                  {/* Right 2x2 cards */}
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                    {/* Feature 1 */}
                    <div className="rounded-lg border border-white/10 bg-black/50 p-5">
                      <div className="mb-3 flex items-center">
                        <Timer className="h-6 w-6 text-fuchsia-300/90"/>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">A timer that adapts to you</h3>
                      <p className="mt-2 text-sm md:text-base text-white/70">
                        Customize your timing experience with adjustable settings, themes, and layouts to suit your
                        preferences.
                      </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="rounded-lg border border-white/10 bg-black/50 p-5">
                      <div className="mb-3 flex items-center">
                        <Users className="h-6 w-6 text-fuchsia-300/90"/>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Online Mode</h3>
                      <p className="mt-2 text-sm md:text-base text-white/70">
                        Create rooms, and coordinate matches in real time. Perfect for cubing meetups or online
                        sessions.
                      </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="rounded-lg border border-white/10 bg-black/50 p-5">
                      <div className="mb-3 flex items-center">
                        <BarChart3 className="h-6 w-6 text-fuchsia-300/90"/>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Unique stats system</h3>
                      <p className="mt-2 text-sm md:text-base text-white/70">
                        Analyze results per cube and spot opportunities without altering your session averages.
                      </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="rounded-lg border border-white/10 bg-black/50 p-5">
                      <div className="mb-3 flex items-center">
                        <Globe className="h-6 w-6 text-fuchsia-300/90"/>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Connect with other cubers</h3>
                      <p className="mt-2 text-sm md:text-base text-white/70">
                        Explore the vibrant worldwide community of cubers. Share your times, and individual performance
                        metrics.
                      </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="rounded-lg border border-white/10 bg-black/50 p-5">
                      <div className="mb-3 flex items-center">
                        <AudioWaveform className="h-6 w-6 text-fuchsia-300/90"/>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Learn Algorithms</h3>
                      <p className="mt-2 text-sm md:text-base text-white/70">
                        Access a built-in algorithm trainer to help you memorize and practice new algorithms
                        effectively.
                      </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="rounded-lg border border-white/10 bg-black/50 p-5">
                      <div className="mb-3 flex items-center">
                        <DatabaseZap className="h-6 w-6 text-fuchsia-300/90"/>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Cross Platform Sync</h3>
                      <p className="mt-2 text-sm md:text-base text-white/70">
                        Access your data from any device. NexusTimer syncs your times via the cloud.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
              <TypographyH1>How to start?</TypographyH1>
              <div className="rounded-xl border border-white/15 bg-black/30 p-8 md:p-10">
                <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                  <StepItem number={1} title="Enter NexusTimer App" desc="Create a free account and join."/>
                  <StepItem number={2} title="Add Your Cubes" desc="Access your cubes section and add your cubes."/>
                  <StepItem
                    number={3}
                    title="Start Timing"
                    desc="Use the timer to start solving and tracking your times."
                  />
                </div>
              </div>
            </div>
          </section>

          <FeatureTable/>

          {/* Testimonials */}
          <section id="testimonials" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
              <div className="mb-6 flex items-center justify-between">
                <TypographyH1>What users say</TypographyH1>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="rounded-xl border border-white/15 bg-black/30 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2 text-amber-300/90">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-amber-300/70"/>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-white/80">
                    “Switched from other timers and never looked back. The Clash Mode is a game-changer for our club.”
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                    <Image
                      className="h-6 w-6 rounded-full border border-white/20"
                      src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_9.png"
                      alt="user a"
                      width={24}
                      height={24}
                    />
                    <span>@cubeOrigin</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2 text-amber-300/90">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-amber-300/70"/>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-white/80">
                    “Love the clean UI and that it’s free. Cloud backup keeps my times safe across devices.”
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                    <Image
                      className="h-6 w-6 rounded-full border border-white/20"
                      src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_5.png"
                      alt="user b"
                      width={24}
                      height={24}
                    />
                    <span>@layersLast</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2 text-amber-300/90">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-amber-300/70"/>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-white/80">
                    “Import and export just works. Stats per cube helped me target my weak spots.”
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                    <Image
                      className="h-6 w-6 rounded-full border border-white/20"
                      src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_4.png"
                      alt="user c"
                      width={24}
                      height={24}
                    />
                    <span>@OH_enthusiast</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
              <TypographyH1>Frequently asked questions</TypographyH1>
              <div className="mt-6 grid md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    Is NexusTimer really free?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">Yes. NexusTimer is free and we plan to keep it that way.</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    Can I import from other timers?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">
                    Absolutely. We support import/export with popular timers like csTimer, Twisty Timer, CubeDesk.
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    Does it work across devices?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">
                    Yes, NexusTimer supports mobile and desktop. Sync your data via the cloud for access on any device.
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    How do Clash rooms work?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">
                    Create a room, then invite your friends, and synchronize rounds in real time. Great for meetups or
                    online sessions.
                  </p>
                </div>

                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    Why do I need create cube collections?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">
                    We have a unique stats system that tracks performance per cube. This helps you identify strengths
                    and weaknesses with each cube. Without session averages being affected.
                  </p>
                </div>

                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    How NexusTimer maintains?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">
                    Currently, NexusTimer runs with all the costs. We are exploring sustainable funding options to
                    ensure its longevity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sponsors */}
          {/*<section id="sponsors" className="relative">*/}
          {/*  <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">*/}
          {/*    <div className="rounded-xl border border-white/15 bg-black/20 p-6 md:p-8">*/}
          {/*      <div className="flex flex-col gap-6">*/}
          {/*        <div className="flex items-center justify-between">*/}
          {/*          <h3 className="text-xl md:text-2xl font-semibold">OSS Sponsors</h3>*/}
          {/*        </div>*/}

          {/*        <div className={'text-sm'}>Interested in becoming a sponsor and showcasing your logo here?*/}
          {/*          <a href="mailto:contact.nexustimer@gmail.com" className="text-purple-400 hover:underline ml-1">Contact*/}
          {/*            us</a>.*/}
          {/*        </div>*/}
          {/*        <div className="flex flex-wrap items-center gap-6 md:gap-8 opacity-90">*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</section>*/}

          {/* CTA */}
          <section className="relative">
            <div className="mx-auto max-w-7xl px-6 pb-16">
              <div className="rounded-xl border border-white/15 bg-fuchsia-600/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold">Discover</h3>
                  {/*<p className="text-white/70 text-sm mt-1">Contribute or sponsor open-source. It powers your world..</p>*/}
                  <p className="text-white/70 text-sm mt-1">
                    Less routine, more cubing joy. All refined cubing tools – right in your device, for free.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/*<a*/}
                  {/*  href="https://github.com/sponsors"*/}
                  {/*  target="_blank"*/}
                  {/*  rel="noreferrer"*/}
                  {/*  className="inline-flex items-center justify-center rounded-md bg-white text-black font-semibold px-4 py-2.5 text-sm hover:bg-white/90 transition-colors"*/}
                  {/*>*/}
                  {/*  Sponsor Us*/}
                  {/*</a>*/}
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center rounded-md bg-white text-black font-semibold px-4 py-2.5 text-sm hover:bg-white/90 transition-colors"
                  >
                    Go the App
                  </Link>
                  {/*<a*/}
                  {/*  href="https://github.com/bryanlundberg/NexusTimer"*/}
                  {/*  target="_blank"*/}
                  {/*  rel="noreferrer"*/}
                  {/*  className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"*/}
                  {/*>*/}
                  {/*  Contribute*/}
                  {/*</a>*/}
                </div>
                <div className={cn("pointer-events-none select-none absolute top-0 left-0 text-foreground/10", 'opacity-15')}>
                  <Image src={"/bg.png"} alt={`3x3 cube image`} width={200} height={200} unoptimized className={"w-full object-cover"} />
                </div>
              </div>
            </div>

          </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-white/60 flex flex-col md:flex-row items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} NexusTimer.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                ToS
              </Link>
              <Link
                href="/https://discord.gg/eCgTKcavec"
                target={'_blank'}
                className="hover:text-white transition-colors"
              >
                Discord
              </Link>
              <a href="mailto:contact.nexustimer@gmail.com" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </ScrollArea>
    </div>
  )
}

function StepItem({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-9 w-9 shrink-0 rounded-md border border-white/15 bg-white/5 flex items-center justify-center text-sm font-semibold text-white/80">
        {number}
      </div>
      <div>
        <div className="text-base md:text-lg font-semibold">{title}</div>
        <div className="text-sm text-white/70">{desc}</div>
      </div>
    </div>
  )
}

function FeatureTable() {

  const TABLES_DATA = [
    {
      title: 'Builtin Core Features',
      description: 'Essential timer capabilities',
      features: [
        {
          name: 'Random State Scrambles',
          description: 'Instead random moves, get scrambles that put your cube in a random state.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: 'Cross-platform support',
          description: 'Access application on multiple devices and operating systems.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: 'Import other timers',
          description: 'Easily import and export your data from/to other popular timers.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        },
        {
          name: 'Offline Mode',
          description: 'Use the timer without an internet connection.',
          nxTimer: 'partial',
          csTimer: 'check',
          cubeDesk: 'cross',
          twistyTimer: 'check'
        },
        {
          name: 'Statistics per cube',
          description: 'Analyze your performance for each individual cube.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: 'Cloud Sync',
          description: 'Sync your data across multiple devices via the cloud.',
          nxTimer: 'check',
          csTimer: 'partial',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: 'Online Mode',
          description: 'Create rooms and coordinate matches in real time with other users.',
          nxTimer: 'check',
          csTimer: 'partial',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        },
      ]
    },
    {
      title: 'Statistics & Analysis',
      description: 'In-depth performance insights',
      features: [
        {
          name: 'Global Statistics',
          description: 'Overall stats including averages, best/worst times, and more.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: 'Session Statistics',
          description: 'Detailed session stats including averages, best/worst times, and more.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: 'Cube-specific Stats',
          description: 'Detailed statistics for each individual cube. Including averages, best/worst times, and more.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: 'Performance Graphs',
          description: 'Visualize your solving times and trends over time.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'partial',
          twistyTimer: 'partial'
        },
      ]
    },
    {
      title: 'Social & Community',
      description: 'User engagement and social features',
      features: [
        {
          name: 'Profile System',
          description: 'Create and customize your user profile.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: 'Compare Profiles',
          description: 'View and compare profiles of other users.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: 'Display Personal Bests',
          description: 'Showcase your best times on your profile including averages.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        },
        {
          name: 'Display Cubes Owned',
          description: 'Show the cubes you own on your profile.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        },
        {
          name: 'Display Trajectory Progress',
          description: 'Show your full solves history and progress over time.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        }
      ]
    }
  ];

  return (
    <section id="features-comparison" className="relative">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <TypographyH1>What's different about NXTimer?</TypographyH1>
        <h2 className="text-center text-sm md:text-base text-white/70 mb-8">
          NXTimer offers unique features that set it apart from other popular timers.
        </h2>

        {TABLES_DATA.map((table, index) => (
          <table key={index} className="w-full table-auto border-collapse bg-black/50 max-w-4xl mx-auto">
            <thead className={'bg-[#fbcfe8]/10 text-sm'}>
            <tr className={'text-center'}>
              <th className="py-3 text-left text-white/90 align-bottom ps-3 w-full">
                <div className="flex flex-col">
                  <p>{table.title}</p>
                  <p className={'text-xs font-normal text-neutral-300'}>{table.description}</p>
                </div>
              </th>
              <th className=" py-3 text-white/90 flex flex-col items-center gap-2 px-3">
                <Image src={'/logo.png'} alt={''} width={64} height={64} className={'invert size-6'} unoptimized/>
                NXTimer
              </th>
              <th className="py-3 text-white/90 align-bottom px-3">csTimer</th>
              <th className="py-3 text-white/90 align-bottom text-nowrap px-3 hidden md:table-cell">Cube Desk</th>
              <th className="py-3 text-white/90 align-bottom text-nowrap px-3 hidden md:table-cell">Twisty Timer</th>
            </tr>
            </thead>
            <tbody>
            {table.features.map((feature, fIndex) => (
              <tr key={fIndex}>
                <td className="py-6 text-sm text-white/80 ps-3">
                  <div className="font-semibold">{feature.name}</div>
                  <div className="text-xs text-white/60">{feature.description}</div>
                </td>
                <td>{feature.nxTimer === 'check' ? <RatedIcon type="check"/> : feature.nxTimer === 'cross' ?
                  <RatedIcon type="cross"/> : <RatedIcon type="partial"/>}</td>
                <td>{feature.csTimer === 'check' ? <RatedIcon type="check"/> : feature.csTimer === 'cross' ?
                  <RatedIcon type="cross"/> : <RatedIcon type="partial"/>}</td>
                <td className={"hidden md:table-cell"}>{feature.cubeDesk === 'check' ? <RatedIcon type="check"/> : feature.cubeDesk === 'cross' ?
                  <RatedIcon type="cross"/> : <RatedIcon type="partial"/>}</td>
                <td className={"hidden md:table-cell"}>{feature.twistyTimer === 'check' ? <RatedIcon type="check"/> : feature.twistyTimer === 'cross' ?
                  <RatedIcon type="cross"/> : <RatedIcon type="partial"/>}</td>
              </tr>
            ))}
            </tbody>
          </table>
        ))}
      </div>
    </section>
  )
}

function RatedIcon({ type }: { type: 'check' | 'cross' | 'partial' }) {
  const backgroundClass = type === 'partial' ? 'bg-yellow-400/10' : type === 'check' ? 'bg-green-400/10' : 'bg-red-400/10'

  return (
    <div className={`size-10 rounded-full flex items-center justify-center mx-auto ${backgroundClass}`}>
      {type === 'check' && (
        <Check className={'text-green-400 size-6'}/>)}
      {type === 'cross' && (
        <XIcon className={'text-red-400 size-6'}/>)}
      {type === 'partial' && (
        <TriangleAlert className={'size-6 text-yellow-400'}/>)}
    </div>
  )
}

function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="scroll-m-20 text-3xl mb-5 font-extrabold tracking-tight lg:text-4xl text-[#fbcfe8] [text-shadow:0_3px_0_#9d174d] mx-auto text-center"
    >
      {children}
    </h1>
  )
}

