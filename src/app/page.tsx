'use client';
import Link from 'next/link';
import Dither from '@/components/ui/shadcn-io/dither';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, BarChart3, StarIcon, Timer, Users } from 'lucide-react';
import Image from 'next/image';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import { TextGenerateEffect } from '@/components/ui/shadcn-io/text-generate-effect';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Page() {
  const [activeSlide, setActiveSlide] = useState(0);
  const featureImages = ['/landing/1.png', '/landing/2.png', '/landing/3.png', '/landing/4.png'];
  return (
    <div className="relative w-dvw h-dvh bg-black overflow-hidden">
      {/* Animated background */}
      <Dither
        waveSpeed={0.06}
        waveFrequency={2.2}
        waveAmplitude={0.35}
        waveColor={[0.72, 0.35, 0.95]}
        colorNum={6}
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
              <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/#how" className="hover:text-white transition-colors">How it works?</Link>
              <a
                href="https://github.com/bryanlundberg/NexusTimer"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >GitHub</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >Enter</Link>
              <Button
                onClick={() =>
                  signIn('google', { redirectTo: '/app' })
                }
                className="inline-flex items-center rounded-md border border-fuchsia-400/30 bg-fuchsia-400/10 px-3.5 py-2 text-sm font-semibold text-white hover:bg-fuchsia-400/20 transition-colors"
              >Sign Up</Button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">
          {/* Hero */}
          <section className="relative">
            <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 md:pt-16 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>
                  NexusTimer is free and always will be!
                </div>

                <TextGenerateEffect
                  words={'Stay organized, and elevate your training experience.'}
                  className={'mt-5 text-4xl md:text-5xl font-bold leading-tight tracking-tight'}
                />

                <TextGenerateEffect
                  className={'mt-4 text-base md:text-lg text-white/70 max-w-prose'}
                  words={'NexusTimer is your timing hub, simple, powerful, and designed for SpeedCubers by SpeedCubers.'}
                />
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center rounded-md bg-white text-black font-semibold px-4 py-2.5 text-sm hover:bg-white/90 transition-colors"
                  >
                    Start now
                  </Link>
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    Demo
                  </Link>
                </div>
                <div className="mt-6 flex items-center gap-4 text-xs text-white/60">
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
                  <span>+2k users trust NexusTimer</span>
                </div>
              </div>
              <div className="md:pl-6">
                <div className="relative rounded-xl border border-white/15 bg-black/30 p-4 shadow-xl">
                  {/* Placeholder dashboard/phone card (solid, no gradient) */}
                  <ImageZoom>
                    <div className="aspect-[16/10] w-full rounded-lg border border-white/10 bg-neutral-900/60">
                      <Image
                        width={600}
                        height={600}
                        src="/ui/1.png"
                        alt="preview"
                        className="w-full h-full object-cover rounded-lg"
                      />

                    </div>
                  </ImageZoom>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <ImageZoom>
                      <div className="h-32 rounded-md border border-white/10 bg-neutral-900/60">
                        <Image
                          width={500}
                          height={500}
                          src="/ui/2.png"
                          alt="image 2"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    </ImageZoom>
                    <ImageZoom>
                      <div className="h-32 rounded-md border border-white/10 bg-neutral-900/60">
                        <Image
                          width={500}
                          height={500}
                          src="/ui/3.png"
                          alt="image 3"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    </ImageZoom>
                  </div>
                </div>
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
                    {['GAN', 'MoYu', 'QiYi', 'DaYan', 'YJ', 'ShengShou', 'YuXin', 'DianSheng', 'And More..'].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-md border border-purple-300 bg-purple-500/50 px-2.5 py-1 text-xs text-white/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
              <h2 className="text-center text-2xl md:text-3xl font-semibold mb-8">
                What <span className="text-purple-400">NexusTimer</span> can do for you
              </h2>

              <div className="p-4 md:p-6 py-10 md:py-12">
                {/* Two-column layout where the entire section scrolls (not only the text column) */}
                <div className="grid md:grid-cols-2 gap-6 items-stretch">
                  <div className="relative">
                    <div className="sticky top-20 h-[540px] md:h-[600px] rounded-xl w-full border border-white/10 bg-neutral-900/60">
                      <Image
                        src={featureImages[activeSlide]}
                        alt={'feature preview'}
                        width={700}
                        height={700}
                        className="w-full h-full object-cover  p-4 grayscale-10 rounded-3xl"
                      />
                    </div>
                  </div>

                  {/* Vertical scroll-snap carousel for text only */}
                  <div className="relative rounded-lg border border-white/10 bg-black/50">
                    {/* Slide 1 */}
                    <div className="snap-center snap-always h-[540px] md:h-[600px] flex flex-col items-center justify-center p-5">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.6 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        onViewportEnter={() => setActiveSlide(0)}
                        className="max-w-prose text-center md:text-left"
                      >
                        <div className="mb-3 flex items-center justify-center md:justify-start">
                          <Timer className="h-6 w-6 text-fuchsia-300/90"/>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white">A timer that adapts to you</h3>
                        <p className="mt-2 text-sm md:text-base text-white/70">
                          It’s more than counting seconds:
                          with <span className="text-purple-400 font-medium">NexusTimer</span> you decide how to start,
                          inspect, and view your times. Touch to start, spacebar, custom inspection, colors—you’re in
                          control.
                        </p>
                      </motion.div>
                    </div>

                    {/* Slide 2 */}
                    <div className="snap-center snap-always h-[540px] md:h-[600px] flex flex-col items-center justify-center p-5">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.6 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.05 }}
                        onViewportEnter={() => setActiveSlide(1)}
                        className="max-w-prose text-center md:text-left"
                      >
                        <div className="mb-3 flex items-center justify-center md:justify-start">
                          <Users className="h-6 w-6 text-fuchsia-300/90"/>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white">Clash Mode for team practice</h3>
                        <p className="mt-2 text-sm md:text-base text-white/70">
                          Create rooms, sync rounds, and coordinate matches in real time. Perfect for clubs and friends
                          who want to compete, stay motivated, and improve together.
                        </p>
                      </motion.div>
                    </div>

                    {/* Slide 3 */}
                    <div className="snap-center snap-always h-[540px] md:h-[600px] flex flex-col items-center justify-center p-5">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.6 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.05 }}
                        onViewportEnter={() => setActiveSlide(2)}
                        className="max-w-prose text-center md:text-left"
                      >
                        <div className="mb-3 flex items-center justify-center md:justify-start">
                          <BarChart3 className="h-6 w-6 text-fuchsia-300/90"/>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white">Stats that drive your progress</h3>
                        <p className="mt-2 text-sm md:text-base text-white/70">
                          Analyze results per cube and spot opportunities without altering your session averages. Turn
                          your data into decisions that lower your times.
                        </p>
                      </motion.div>
                    </div>

                    {/* Slide 4 */}
                    <div className="snap-center snap-always h-[540px] md:h-[600px] flex flex-col items-center justify-center p-5">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.6 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.05 }}
                        onViewportEnter={() => setActiveSlide(3)}
                        className="max-w-prose text-center md:text-left"
                      >
                        <div className="mb-3 flex items-center justify-center md:justify-start">
                          <ArrowUpDown className="h-6 w-6 text-fuchsia-300/90"/>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white">Import and export without
                          friction</h3>
                        <p className="mt-2 text-sm md:text-base text-white/70">
                          Bring your times from csTimer, Twisty Timer, CubeTimer, and more. Your history is yours—take
                          it wherever you go.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-center text-xs text-white/50">Scroll up or down to explore</p>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
              <h3 className="text-xl md:text-2xl font-semibold mb-5">How to start?</h3>
              <div className="rounded-xl border border-white/15 bg-black/30 p-8 md:p-10">
                <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                  <StepItem
                    number={1}
                    title="Enter NexusTimer App"
                    desc="Create a free account and join."
                  />
                  <StepItem
                    number={2}
                    title="Add Your Cubes"
                    desc="Access your cubes section and add your cubes."
                  />
                  <StepItem
                    number={3}
                    title="Start Timing"
                    desc="Use the timer to start solving and tracking your times."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-semibold">What users say</h2>
                <div className="hidden md:flex items-center gap-1 text-amber-300/90">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-amber-300/80 text-amber-300/90"/>
                  ))}
                </div>
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
              <h3 className="text-xl md:text-2xl font-semibold">Frequently asked questions</h3>
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
                  <p className="mt-2 text-sm text-white/70">Absolutely. We support import/export with popular timers
                    like csTimer, Twisty Timer, CubeDesk.</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    Does it work across devices?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">Yes, NexusTimer supports mobile and desktop. Sync your data
                    via the cloud for access on any device.</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    How do Clash rooms work?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">Create a room, then invite your friends, and synchronize
                    rounds in
                    real time. Great for meetups or online sessions.</p>
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
                    Currently, NexusTimer runs with all the costs. We are exploring sustainable
                    funding options to ensure its longevity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sponsors */}
          <section id="sponsors" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
              <div className="rounded-xl border border-white/15 bg-black/20 p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl md:text-2xl font-semibold">OSS Sponsors</h3>
                  </div>

                  <div className={"text-sm"}>Interested in becoming a sponsor and showcasing your logo here?
                    <a href="mailto:contact.nexustimer@gmail.com" className="text-purple-400 hover:underline ml-1">Contact us</a>.
                  </div>
                  <div className="flex flex-wrap items-center gap-6 md:gap-8 opacity-90">
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative">
            <div className="mx-auto max-w-7xl px-6 pb-16">
              <div className="rounded-xl border border-white/15 bg-purple-700/50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold">Discover</h3>
                  {/*<p className="text-white/70 text-sm mt-1">Contribute or sponsor open-source. It powers your world..</p>*/}
                  <p className="text-white/70 text-sm mt-1">Less routine, more cubing joy.
                    All refined cubing tools – right in your device, for free.</p>
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
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-white/60 flex flex-col md:flex-row items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} NexusTimer.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">ToS</Link>
              <Link
                href="/https://discord.gg/grenDQFw"
                target={'_blank'}
                className="hover:text-white transition-colors"
              >Discord</Link>
              <a href="mailto:contact.nexustimer@gmail.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </ScrollArea>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="group rounded-xl border border-white/15 bg-black/30 p-5 hover:border-white/25 transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="text-fuchsia-300/90">{icon}</div>
      <h3 className="mt-3 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/70">{desc}</p>
    </div>
  );
}

function StepItem({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-9 w-9 shrink-0 rounded-md border border-white/15 bg-white/5 flex items-center justify-center text-sm font-semibold text-white/80">{number}</div>
      <div>
        <div className="text-base md:text-lg font-semibold">{title}</div>
        <div className="text-sm text-white/70">{desc}</div>
      </div>
    </div>
  );
}
