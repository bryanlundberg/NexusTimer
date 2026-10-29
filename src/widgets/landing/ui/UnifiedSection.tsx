'use client'

import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Bluetooth, BookOpen, LineChart, ListChecks, MessagesSquare, Swords, Timer } from 'lucide-react'
import { useCycle } from '../model/useCycle'
import CornerHandles from './CornerHandles'
import ToolStream from './ToolStream'
import ConvergeLines from './ConvergeLines'
import AccountMerge from './AccountMerge'

export default function UnifiedSection() {
  const t = useTranslations('LandingPage')
  const tPages = useTranslations('Metadata.pages')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })

  const timer = tPages('timer.title')
  const algorithms = t('footer.algorithms')

  const tools = [
    { icon: Timer, name: 'csTimer', role: timer },
    { icon: BookOpen, name: 'SpeedCubeDB', role: algorithms },
    { icon: Swords, name: 'CubeDesk', role: t('footer.multiplayer') },
    { icon: ListChecks, name: t('unified.spreadsheet'), role: t('unified.learned') },
    { icon: Timer, name: 'TwistyTimer', role: timer },
    { icon: BookOpen, name: 'alg.cubing.net', role: algorithms },
    { icon: Bluetooth, name: 'Cubeast', role: 'Smart cube' },
    { icon: MessagesSquare, name: 'Discord', role: t('footer.community') }
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

      <div
        ref={ref}
        className="relative mt-14 grid border border-border md:mt-20 md:border-x-0 md:grid-cols-[minmax(0,1fr)_160px_minmax(0,1.1fr)]"
      >
        <CornerHandles />
        <ToolStream title={t('unified.before')} tools={tools} />
        <div className="hidden bg-background md:block">
          <ConvergeLines />
        </div>
        <AccountMerge title={t('unified.after')} features={features} active={active} />
      </div>
    </section>
  )
}
