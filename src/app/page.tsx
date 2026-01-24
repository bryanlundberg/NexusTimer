'use client'
import Link from 'next/link'
import Dither from '@/components/ui/shadcn-io/dither'
import { ArrowRight, AudioWaveform, BarChart3, DatabaseZap, Globe, StarIcon, Timer, Users } from 'lucide-react'
import Image from 'next/image'
import { TextGenerateEffect } from '@/components/ui/shadcn-io/text-generate-effect'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/shared/lib/utils'
import RatedIcon from '@/shared/ui/rate-icon/RateIcon'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'

export default function Page() {
  return (
    <div className="relative w-dvw h-dvh bg-black overflow-hidden">
      {/* Animated background */}
      <Dither
        waveSpeed={0.02}
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
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5"
        >
          <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-3 cursor-pointer">
              <div className="h-8 w-8 rounded-md bg-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                <Image
                  className={'invert-100 p-0.5'}
                  src={'/logo.png'}
                  alt={'NexusTimer Logo'}
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-sm font-semibold tracking-wide text-white/90 bg-gradient-to-r from-white to-white/70 bg-clip-text">
                NexusTimer
              </span>
            </motion.div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
              <Link href="/#features" className="hover:text-white transition-colors relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fuchsia-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="/#how" className="hover:text-white transition-colors relative group">
                How it works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fuchsia-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="/#testimonials" className="hover:text-white transition-colors relative group">
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fuchsia-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link href="/#faq" className="hover:text-white transition-colors relative group">
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fuchsia-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <a
                href="https://github.com/bryanlundberg/NexusTimer"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors relative group"
              >
                GitHub
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fuchsia-400 group-hover:w-full transition-all duration-300" />
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all hover:scale-105"
              >
                <Timer className="h-4 w-4" />
                Start Timing
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Main */}
        <main className="flex-1">
          <section className="relative">
            <div className="mx-auto max-w-4xl px-6 pt-12 pb-20 md:pt-20 md:pb-28 text-center relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 mx-auto backdrop-blur-sm shadow-lg shadow-emerald-500/20"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Nexus Timer is free and always will be!
              </motion.div>

              <TextGenerateEffect
                words={'Your timer shows times.'}
                className={
                  'mt-8 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text'
                }
                duration={0}
              />

              <TextGenerateEffect
                words={'Nexus shows how you’re really improving.'}
                className={'text-4xl md:text-6xl font-extrabold tracking-tight leading-tight'}
                staggerDelay={0.2}
              />

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Separator className="my-8 md:my-10 border-white/10" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-4 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
              >
                After just a short session, NexusTimer builds your cubing performance profile — automatically, per cube,
                per category.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-4"
              >
                <Link
                  href="/app"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-white to-white/95 text-black font-semibold px-6 py-3 text-sm hover:from-white/95 hover:to-white/90 transition-all hover:scale-105 shadow-xl shadow-white/20"
                >
                  <Image
                    src={'/landing/cube.gif'}
                    alt={"Animated Rubik's cube icon"}
                    width={28}
                    height={28}
                    unoptimized
                    className="transition-transform group-hover:rotate-12"
                  />
                  Discover your performance
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/options?redirect=import"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm text-white hover:bg-white/20 hover:border-white/30 transition-all hover:scale-105"
                >
                  Import your solves from any timer
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mx-auto w-fit mt-8 flex items-center gap-4 text-xs text-white/60"
              >
                <div className="flex -space-x-1.5">
                  {[1, 2, 7].map((num, idx) => (
                    <motion.div
                      key={num}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1 + idx * 0.1 }}
                    >
                      <Image
                        className="inline-block h-7 w-7 rounded-full border-2 border-white/30 shadow-lg"
                        src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${num}.png`}
                        alt="Community member avatar"
                        width={28}
                        height={28}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-white/70">Join a growing community of cubers</span>
              </motion.div>
            </div>
          </section>

          {/* Activation Moment / Wow Section */}
          <section className="relative py-12 md:py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  Everything you need to{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                    level up
                  </span>
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                  From deep analytics to real-time competition. Discover the features that make NexusTimer the ultimate
                  choice for serious cubers.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[
                  {
                    title: 'Split by Cube',
                    description: 'Analyze your performance for each individual cube.',
                    imageSrc: '/landing/Screenshot_40.png'
                  },
                  {
                    title: 'Cool Stats',
                    description: 'Understand every solve with detailed performance metrics.',
                    imageSrc: '/landing/Screenshot_41.png'
                  },
                  {
                    title: 'Online modes',
                    description: 'Compete in real-time with cubers around the world.',
                    imageSrc: '/landing/Screenshot_38.png'
                  },
                  {
                    title: 'Personal Profile',
                    description: 'Track your progress and showcase your times.',
                    imageSrc: '/landing/Screenshot_43.png'
                  }
                ].map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ActivationMomentCard title={card.title} description={card.description} imageSrc={card.imageSrc} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Integrations & Compatibility */}
          <section id="integrations" className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-fit px-6 py-6 md:py-10"
            >
              <div className="rounded-xl border border-white/15 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm p-6 md:p-8 shadow-xl">
                <div className="flex flex-col md:items-center md:justify-between gap-6">
                  <h3 className="text-lg md:text-xl font-semibold text-center">Works with your favorite brands</h3>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {['GAN', 'MoYu', 'QiYi', 'DaYan', 'YJ', 'ShengShou', 'YuXin', 'DianSheng', 'And More..'].map(
                      (item, index) => (
                        <motion.span
                          key={item}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          className="inline-flex items-center rounded-lg border border-fuchsia-300/50 bg-gradient-to-r from-fuchsia-500/40 to-purple-500/40 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm shadow-lg shadow-fuchsia-500/20"
                        >
                          {item}
                        </motion.span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Features */}
          <section id="features" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center text-2xl md:text-3xl font-semibold mb-12"
              >
                What{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                  Nexus Timer
                </span>{' '}
                can do for you
              </motion.h2>

              <div className="p-4 md:p-6 py-10 md:py-12">
                {/* Left image column + 2x2 cards on the right (non-sticky) */}
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                  {/* Left image column */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300" />
                      <Image
                        src="/landing/2.png"
                        alt="NexusTimer application interface showing timer and statistics dashboard"
                        width={800}
                        height={1000}
                        className="relative w-full h-full max-h-[400px] md:max-h-max object-cover border-2 border-fuchsia-500/50 overflow-hidden rounded-lg -rotate-1 group-hover:rotate-0 transition-transform duration-300 shadow-2xl"
                      />
                    </div>
                  </motion.div>

                  {/* Right 2x2 cards */}
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                    {[
                      {
                        icon: Timer,
                        title: 'A timer that adapts to you',
                        description:
                          'Customize your timing experience with adjustable settings, themes, and layouts to suit your preferences.'
                      },
                      {
                        icon: Users,
                        title: 'Online Mode',
                        description:
                          'Create rooms, and coordinate matches in real time. Perfect for cubing meetups or online sessions.'
                      },
                      {
                        icon: BarChart3,
                        title: 'Unique stats system',
                        description:
                          'Analyze results per cube and spot opportunities without altering your session averages.'
                      },
                      {
                        icon: Globe,
                        title: 'Connect with other cubers',
                        description:
                          'Explore the vibrant worldwide community of cubers. Share your times, and individual performance metrics.'
                      },
                      {
                        icon: AudioWaveform,
                        title: 'Learn Algorithms',
                        description:
                          'Access a built-in algorithm trainer to help you memorize and practice new algorithms effectively.'
                      },
                      {
                        icon: DatabaseZap,
                        title: 'Cross Platform Sync',
                        description: 'Access your data from any device. NexusTimer syncs your times via the cloud.'
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-white/20 hover:bg-black/50 transition-all duration-300"
                      >
                        <div className="mb-4 flex items-center">
                          <div className="p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 group-hover:bg-fuchsia-500/20 transition-colors">
                            <feature.icon className="h-5 w-5 text-fuchsia-300 group-hover:text-fuchsia-400 transition-colors" />
                          </div>
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-3 group-hover:text-fuchsia-300 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm md:text-base text-white/60 leading-relaxed">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
              <TypographyH1>How it works?</TypographyH1>
              <div className="rounded-xl border border-white/15 bg-black/30 p-5">
                <div className="grid md:grid-cols-4 gap-8 md:gap-10">
                  <StepItem number={1} title="Start or import" desc={'Use Nexus or import solves from any timer.'} />
                  <StepItem
                    number={2}
                    title="Train as usual"
                    desc="Just solve. Everything is categorized automatically."
                  />
                  <StepItem number={3} title="Analyze" desc="See performance trends after a short session." />
                  <StepItem number={4} title="Improve" desc="Compare profiles and track long-term progress." />
                </div>
              </div>
            </div>
          </section>

          <FeatureTable />

          {/* Official Events Focus */}
          <section id="official-events" className="relative">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <TypographyH1>Built for official events</TypographyH1>
                <p className="text-white/60 text-lg max-w-2xl mx-auto mt-4">
                  Focused on WCA official categories. Train for competitions with the same events you'll compete in.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Speedcubers',
                    description:
                      'Train for 3x3, 2x2, 4x4, 5x5 and all official speed events. Track your progress with competition-ready statistics.',
                    highlight: 'WCA Speed Events'
                  },
                  {
                    title: 'One-Handed Specialists',
                    description:
                      'Master OH with dedicated tracking. Analyze your one-handed solves separately from your regular times.',
                    highlight: '3x3 OH Focus'
                  },
                  {
                    title: 'Big Cube Enthusiasts',
                    description:
                      'Track performance across 4x4, 5x5, 6x6, and 7x7. Compare your times and identify improvement areas.',
                    highlight: '4x4 - 7x7'
                  },
                  {
                    title: 'Non-NxN Solvers',
                    description:
                      'Practice Pyraminx, Skewb, Square-1, Megaminx, and Clock. All official WCA events supported.',
                    highlight: 'Pyraminx, Skewb, SQ1...'
                  }
                ].map((profile, index) => (
                  <motion.div
                    key={profile.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 p-6 hover:border-fuchsia-400/30 hover:from-black/50 hover:to-black/30 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="inline-block px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 text-xs font-medium text-fuchsia-300 mb-4">
                        {profile.highlight}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{profile.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">{profile.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

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
                      <StarIcon key={i} className="h-4 w-4 fill-amber-300/70" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-white/80">
                    “Switched from other timers and never looked back. The Clash Mode is a game-changer for our club.”
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                    <Image
                      className="h-6 w-6 rounded-full border border-white/20"
                      src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_9.png"
                      alt="User testimonial avatar"
                      width={24}
                      height={24}
                    />
                    <span>@cubeOrigin</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2 text-amber-300/90">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-amber-300/70" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-white/80">
                    “Love the clean UI and that it’s free. Cloud backup keeps my times safe across devices.”
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                    <Image
                      className="h-6 w-6 rounded-full border border-white/20"
                      src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_5.png"
                      alt="User testimonial avatar"
                      width={24}
                      height={24}
                    />
                    <span>@layersLast</span>
                  </div>
                </div>
                <div className="rounded-xl border border-white/15 bg-black/30 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2 text-amber-300/90">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-amber-300/70" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-white/80">
                    “Import and export just works. Stats per cube helped me target my weak spots.”
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                    <Image
                      className="h-6 w-6 rounded-full border border-white/20"
                      src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_4.png"
                      alt="User testimonial avatar"
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-7xl px-6 pb-16"
            >
              <div className="rounded-xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-600/20 to-purple-600/20 backdrop-blur-sm p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl shadow-fuchsia-500/20">
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Discover
                  </h3>
                  <p className="text-white/80 text-base mt-2 leading-relaxed">
                    Less routine, more cubing joy. All refined cubing tools – right in your device, for free.
                  </p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <Link
                    href="/app"
                    className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black font-semibold px-6 py-3 text-sm hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
                  >
                    Go to the App
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <Image
                    src={'/bg.png'}
                    alt={"Rubik's cube background pattern"}
                    width={400}
                    height={400}
                    unoptimized
                    className={'w-full h-full object-cover'}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-fuchsia-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
              </div>
            </motion.div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand Column */}
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <Image src={'/logo.png'} alt={'NexusTimer Logo'} width={32} height={32} className="invert" />
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    NexusTimer
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  The ultimate performance profile for cubers. Track, analyze, and improve your solves with advanced
                  statistics.
                </p>

                <Image
                  src={'/utils/android-apk.webp'}
                  alt={'Download Nexus Connect App'}
                  width={200}
                  height={60}
                  className="mt-6 -ms-4"
                  unoptimized
                />
              </div>

              {/* Product Column */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Product</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/app" className="text-sm text-white/60 hover:text-white transition-colors">
                      Timer App
                    </Link>
                  </li>
                  <li>
                    <Link href="/stats" className="text-sm text-white/60 hover:text-white transition-colors">
                      Statistics
                    </Link>
                  </li>
                  <li>
                    <Link href="/free-play" className="text-sm text-white/60 hover:text-white transition-colors">
                      Multiplayer
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Company</h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="mailto:contact.nexustimer@gmail.com"
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="text-sm text-white/60 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="text-sm text-white/60 hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Community Column - Replacing Socials with useful links */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Community</h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="https://discord.gg/eCgTKcavec"
                      target={'_blank'}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Discord Server
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/NexusTimer"
                      target={'_blank'}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      GitHub
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="text-xs text-white/40 italic">
                NexusTimer is an independent project for the cubing community.
              </span>
              <span className="text-xs text-white/40">
                © {new Date().getFullYear()} NexusTimer. All rights reserved.
              </span>
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

function ActivationMomentCard({
  title,
  description,
  imageSrc,
  className
}: {
  title: string
  description: string
  imageSrc: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'group relative aspect-[16/10] md:aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-fuchsia-500/30 hover:shadow-xl hover:shadow-fuchsia-500/10',
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={`${title} - ${description}`}
        width={800}
        height={800}
        className="object-cover object-top w-full h-full transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
        <h3 className="font-bold text-xl text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {title}
        </h3>
        <p className="text-sm text-white/90 leading-relaxed transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {description}
        </p>
      </div>
    </div>
  )
}

function FeatureTable() {
  const TABLES_DATA = [
    {
      title: 'Built-in Core Features',
      description: 'Essential timer capabilities',
      features: [
        {
          name: 'Random State Scrambles',
          description: 'Instead of random moves, get scrambles that put your cube in a random state.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'check'
        },
        {
          name: 'Cross-platform support',
          description: 'Access the application on multiple devices and operating systems.',
          nxTimer: 'check',
          csTimer: 'check',
          cubeDesk: 'check',
          twistyTimer: 'cross'
        },
        {
          name: 'Import other timers',
          description: 'Easily import and export your data to and from other popular timers.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'partial',
          twistyTimer: 'cross'
        },
        {
          name: 'Offline Mode',
          description: 'Use the timer without an internet connection.',
          nxTimer: 'check',
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
        }
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
          description: 'Detailed statistics for each individual cube, including averages, best/worst times, and more.',
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
        }
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
          description: 'Show your full solve history and progress over time.',
          nxTimer: 'check',
          csTimer: 'cross',
          cubeDesk: 'cross',
          twistyTimer: 'cross'
        }
      ]
    }
  ]

  return (
    <section id="features-comparison" className="relative">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <TypographyH1>For cubers who want more than a timer?</TypographyH1>
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
                  <Image
                    src={'/logo.png'}
                    alt={'Nexus Timer logo'}
                    width={64}
                    height={64}
                    className={'invert size-6'}
                    unoptimized
                  />
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
                  <td>
                    {feature.nxTimer === 'check' ? (
                      <RatedIcon type="check" />
                    ) : feature.nxTimer === 'cross' ? (
                      <RatedIcon type="cross" />
                    ) : (
                      <RatedIcon type="partial" />
                    )}
                  </td>
                  <td>
                    {feature.csTimer === 'check' ? (
                      <RatedIcon type="check" />
                    ) : feature.csTimer === 'cross' ? (
                      <RatedIcon type="cross" />
                    ) : (
                      <RatedIcon type="partial" />
                    )}
                  </td>
                  <td className={'hidden md:table-cell'}>
                    {feature.cubeDesk === 'check' ? (
                      <RatedIcon type="check" />
                    ) : feature.cubeDesk === 'cross' ? (
                      <RatedIcon type="cross" />
                    ) : (
                      <RatedIcon type="partial" />
                    )}
                  </td>
                  <td className={'hidden md:table-cell'}>
                    {feature.twistyTimer === 'check' ? (
                      <RatedIcon type="check" />
                    ) : feature.twistyTimer === 'cross' ? (
                      <RatedIcon type="cross" />
                    ) : (
                      <RatedIcon type="partial" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </section>
  )
}

function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-3xl mb-5 font-extrabold tracking-tight lg:text-4xl text-[#fbcfe8] [text-shadow:0_3px_0_#9d174d] mx-auto text-center">
      {children}
    </h1>
  )
}
