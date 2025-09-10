'use client';
import Link from 'next/link';
import Dither from '@/components/ui/shadcn-io/dither';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import { TextGenerateEffect } from '@/components/ui/shadcn-io/text-generate-effect';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
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
      <ScrollArea className="relative z-10 flex flex-col h-full text-white overflow-y-auto">
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

                <TextGenerateEffect words={"Stay organized, and elevate your training experience."} className={"mt-5 text-4xl md:text-5xl font-bold leading-tight tracking-tight"}/>

                <TextGenerateEffect className={"mt-4 text-base md:text-lg text-white/70 max-w-prose"} words={"NexusTimer is your timing hub, simple, powerful, and designed for SpeedCubers by SpeedCubers."} />
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
            <div className="mx-auto max-w-7xl px-6 py-6 md:py-10">
              <div className="rounded-xl border border-white/15 bg-black/30 p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h3 className="text-lg md:text-xl font-semibold">Works with your favorite brands</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {['GAN', 'MoYu', 'QiYi', 'DaYan', 'YJ', 'ShengShou', 'YuXin', 'DianSheng'].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80"
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
              <div className="grid md:grid-cols-3 gap-5">
                <FeatureCard
                  title="Customizable Timer"
                  desc="Touch to start, manual input times, space bar, connect QiYi Timer, custom inspection, custom colors and more."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.5"/>
                      <path
                        d="M12 7v5l3 2"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />
                <FeatureCard
                  title="Clash Mode"
                  desc="Share rooms, synchronize rounds, and coordinate matchs in real time."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M20 20a8 8 0 1 0-16 0"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />
                <FeatureCard
                  title="Stats & Analysis"
                  desc="View stats based on your cube, without altering session averages."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 12h8"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 8h12"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10 16h4"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />

                <FeatureCard
                  title="Import & Export"
                  desc="Import from and export to popular timers as: CS Timer, Twisty Timer, CubeTimer, and more."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 7h16M4 12h16M4 17h16"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />

                <FeatureCard
                  title="Cloud Backup"
                  desc="Securely save and sync your data across devices with ease."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 17.5a4.5 4.5 0 0 0-1.07-8.84 6 6 0 0 0-11.86.5A4.5 4.5 0 0 0 4 17.5H20Z"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 14v5"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10 17h4"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />


                <FeatureCard
                  title="Multi-device"
                  desc="Access your account and data from any device, anywhere."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 20h10"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 18v2"
                        stroke="currentColor"
                        strokeOpacity="0.9"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  }
                />
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
                  <p className="mt-2 text-sm text-white/70">Yes. NexusTimer is free and we plan to keep it that way. You
                    can optionally contribute on GitHub to help development.</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    Can I import from other timers?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">Absolutely. We support import/export with popular timers
                    like csTimer, Twisty Timer, CubeDesk and more.</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    Does it work across devices?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">Yes. Your data syncs via the cloud so you can access it on
                    multiple devices. But you must first upload it to the server before switch to other device!</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                  <div className="list-none text-sm font-semibold text-white/90 flex items-center justify-between">
                    How do Clash rooms work?
                    <span className="ml-4 text-white/50">▾</span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">Create a room, invite friends, and synchronize rounds in
                    real time. Great for meetups or online sessions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative">
            <div className="mx-auto max-w-7xl px-6 pb-16">
              <div className="rounded-xl border border-white/15 bg-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold">Support NexusTimer</h3>
                  {/*<p className="text-white/70 text-sm mt-1">Contribute or sponsor open-source. It powers your world..</p>*/}
                  <p className="text-white/70 text-sm mt-1">Contribute open-source. It powers your world..</p>
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
                  <a
                    href="https://github.com/bryanlundberg/NexusTimer"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-white text-black font-semibold px-4 py-2.5 text-sm hover:bg-white/90 transition-colors"
                  >
                    Contribute
                  </a>
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
