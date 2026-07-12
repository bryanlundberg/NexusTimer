'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Nexi, NexiGridBackdrop } from '@/shared/ui/nexi'
import type { NexiState } from '@/shared/ui/nexi'

export default function EmptyGrid({
  title,
  description,
  nexiState = 'oops'
}: {
  title?: string
  description?: string
  nexiState?: NexiState
}) {
  const t = useTranslations('Index.SolvesPage')
  const reduceMotion = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.07,
        delayChildren: reduceMotion ? 0 : 0.08
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center grow py-12 px-2 text-center"
      data-testid="empty-solves-grid"
    >
      <motion.div variants={item} className="relative grid place-items-center size-36 shrink-0" aria-hidden="true">
        <NexiGridBackdrop />
        <div className="absolute inset-7 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute inset-11 rounded-full bg-primary/15 blur-xl" />
        <Nexi state={nexiState} size={120} aria-label={title ? title : t('empty-solves')} />
      </motion.div>

      <motion.h2 variants={item} className="mt-1 text-lg font-semibold tracking-tight text-balance text-foreground">
        {title ? title : t('empty-solves')}
      </motion.h2>
      <motion.p variants={item} className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
        {description ? description : t('empty-solves-description')}
      </motion.p>
    </motion.div>
  )
}
