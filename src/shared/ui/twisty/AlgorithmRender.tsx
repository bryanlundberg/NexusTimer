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
  const playerRef = useRef<TwistyPlayer | null>(null)
  const puzzleRef = useRef<unknown>(undefined)
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
    if (!container) return

    if (!visible) {
      if (playerRef.current) {
        disposeTwistyPlayer(playerRef.current)
        playerRef.current = null
        puzzleRef.current = undefined
      }
      return
    }

    const puzzle = (config as { puzzle?: unknown } | undefined)?.puzzle
    const sizeStyle = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height
    }

    if (!playerRef.current || puzzleRef.current !== puzzle) {
      if (playerRef.current) disposeTwistyPlayer(playerRef.current)
      const player = new TwistyPlayer(config)
      container.appendChild(player)
      player.style.width = sizeStyle.width
      player.style.height = sizeStyle.height
      player.style.maxWidth = '100%'
      player.style.borderRadius = '8px'
      playerRef.current = player
      puzzleRef.current = puzzle
    } else {
      if (config) Object.assign(playerRef.current, config)
      playerRef.current.style.width = sizeStyle.width
      playerRef.current.style.height = sizeStyle.height
    }
  }, [visible, width, height, config])

  useEffect(() => {
    return () => {
      if (playerRef.current) disposeTwistyPlayer(playerRef.current)
      playerRef.current = null
    }
  }, [])

  return <div {...rest} ref={containerRef} className={className} />
}
