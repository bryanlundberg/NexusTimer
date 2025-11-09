import { motion } from 'framer-motion'
import React from 'react'

export default function FadeIn({
  children,
  className = '',
  style = {}
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
