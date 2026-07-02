'use client'

import React, { useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { disposeTwistyPlayer } from '@/shared/lib/twisty/disposeTwistyPlayer'

interface TwistyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  width?: number | string
  height?: number | string
  style?: React.CSSProperties
  config?: Partial<TwistyPlayer>
}

export default function AlgorithmRender({ className, width = 140, height = 140, config, ...rest }: TwistyProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false), {
      rootMargin: '300px'
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !visible) return

    const player = new TwistyPlayer(config)
    container.appendChild(player)

    player.style.width = typeof width === 'number' ? `${width}px` : width
    player.style.height = typeof height === 'number' ? `${height}px` : height
    player.style.maxWidth = '100%'
    player.style.borderRadius = '8px'

    return () => {
      disposeTwistyPlayer(player)
    }
  }, [visible, width, height, config])

  return <div {...rest} ref={containerRef} className={className} />
}
