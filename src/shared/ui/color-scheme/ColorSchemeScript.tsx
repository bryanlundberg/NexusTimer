'use client'

import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { applySavedColorScheme, savedColorSchemeConfig } from '@/shared/lib/savedColorScheme'

const script = `try{(${applySavedColorScheme.toString()})(localStorage,document.documentElement,function(){return matchMedia('(prefers-color-scheme: dark)').matches},${JSON.stringify(savedColorSchemeConfig)})}catch(e){}`

export function ColorSchemeScript() {
  const inserted = useRef(false)

  useServerInsertedHTML(() => {
    if (inserted.current) return null
    inserted.current = true
    return <script dangerouslySetInnerHTML={{ __html: script }} />
  })

  return null
}
