'use client'

import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Bluetooth, BookOpen, LineChart, ListChecks, MessagesSquare, Swords, Timer } from 'lucide-react'
import { useCycle } from '../model/useCycle'
import CornerHandles from './CornerHandles'
import ToolStream from './ToolStream'
import FlowLines from './FlowLines'
import AccountMerge from './AccountMerge'
import DeviceFan from './DeviceFan'

const SOURCES = [0.1, 0.3, 0.5, 0.7, 0.9]

export default function UnifiedSection() {
  const t = useTranslations('LandingPage')
  const tPages = useTranslations('Metadata.pages')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })

  const timer = tPages('timer.title')
  const algorithms = t('footer.algorithms')

  const tools = [
    { logo: '/landing/cstimer.webp', name: 'csTimer', role: timer },
    { logo: '/landing/speedcubedb.webp', name: 'SpeedCubeDB', role: algorithms },
    { logo: '/landing/ganstation.webp', name: 'GAN Station', role: 'Smart cube' },
    { logo: '/landing/cubedesk.webp', name: 'CubeDesk', role: t('footer.multiplayer') },
    { logo: '/landing/spreadsheet.webp', name: t('unified.spreadsheet'), role: t('unified.learned') },
    { logo: '/landing/cubetime.webp', name: 'CubeTime', role: timer },
    { logo: '/landing/twistytimer.webp', name: 'TwistyTimer', role: timer },
    { logo: '/landing/letscube.webp', name: "Let's Cube", role: t('footer.multiplayer') },
    { logo: '/landing/cubeeast.webp', name: 'Cubeast', role: 'Smart cube' },
    { logo: '/landing/goapp.webp', name: 'GoCube', role: 'Smart cube' },
    { logo: '/landing/discord.webp', name: 'Discord', role: t('footer.community') }
  ]

  const features = [
    { icon: Timer, label: timer },
    { icon: Bluetooth, label: 'Smart cube' },
    { icon: BookOpen, label: algorithms },
    { icon: ListChecks, label: t('unified.learned') },
    { icon: Swords, label: t('footer.multiplayer') },
    { icon: MessagesSquare, label: t('footer.community') },
    { icon: LineChart, label: t('footer.statistics') }
  ]

  const active = useCycle(features.length, 900, inView)

  return (
    <section className="px-4 pt-20 md:px-0 md:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-balance text-4xl font-medium tracking-[-0.035em] md:text-6xl">
          {t('unified.title')}
        </h2>
        <p className="mt-5 text-pretty text-base text-muted-foreground md:text-lg">{t('unified.subtitle')}</p>
      </div>

      <div ref={ref} className="relative mt-14 border border-border md:mt-20 md:border-x-0">
        <CornerHandles />
        <ToolStream title={t('unified.before')} tools={tools} />
        <div className="bg-background px-6 md:px-8">
          <FlowLines points={SOURCES} direction="in" height={96} />
        </div>
        <AccountMerge title={t('unified.after')} features={features} active={active} />
        <DeviceFan running={inView} />
      </div>
    </section>
  )
}
