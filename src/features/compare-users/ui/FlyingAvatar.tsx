'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface FlyingAvatarProps {
  src: string
  startPos: { x: number; y: number }
  onComplete: () => void
}

export function FlyingAvatar({ src, startPos, onComplete }: FlyingAvatarProps) {
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const targetElement = document.getElementById('compare-float-button')
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      setTargetPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      })
    } else {
      setTargetPos({ x: window.innerWidth - 40, y: window.innerHeight - 40 })
    }
  }, [])

  if (!targetPos || !mounted) return null

  const avatarSize = 80
  const offset = avatarSize / 2

  const content = (
    <motion.div
      initial={{
        x: startPos.x,
        y: startPos.y,
        scale: 1,
        opacity: 1
      }}
      animate={{
        x: targetPos.x - offset,
        y: targetPos.y - offset,
        scale: 0.2,
        opacity: 0.8
      }}
      transition={{
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 50)
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      <div className="size-20 rounded-full overflow-hidden border-2 border-primary shadow-2xl bg-background">
        <img src={src} className="w-full h-full object-cover" alt="flying avatar" />
      </div>
    </motion.div>
  )

  return createPortal(content, document.body)
}
