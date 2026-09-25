'use client'

import Image from 'next/image'
import { Quote } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/shared/lib/utils'

export default function TestimonialQuote({
  text,
  user,
  role,
  avatar,
  lead = false,
  delay = 0
}: {
  text: string
  user: string
  role: string
  avatar: number
  lead?: boolean
  delay?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.figure
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex h-full flex-col notch-tl-br [--ntlbr:18px] border border-gray-900/10 bg-white/55 backdrop-blur-sm',
        lead ? 'p-7 md:p-10' : 'p-6 md:p-7'
      )}
    >
      <Quote className={cn('text-gray-900/20', lead ? 'mb-5 h-7 w-7' : 'mb-4 h-5 w-5')} aria-hidden />
      <blockquote
        className={cn(
          'font-display font-medium tracking-[-0.01em] text-gray-900 text-pretty',
          lead ? 'text-xl leading-relaxed md:text-2xl lg:text-[1.75rem]' : 'text-base leading-relaxed'
        )}
      >
        {text}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-7">
        <Image
          className={cn('rounded-full border-2 border-gray-900/10', lead ? 'h-11 w-11' : 'h-9 w-9')}
          src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${avatar}.png`}
          alt=""
          width={44}
          height={44}
        />
        <div className="min-w-0">
          <span className="block truncate text-sm font-semibold text-gray-900">{user}</span>
          <span className="block truncate text-xs text-gray-600">{role}</span>
        </div>
      </figcaption>
    </motion.figure>
  )
}
