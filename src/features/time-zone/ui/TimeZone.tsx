'use client'
import React from 'react'
import { Clock } from 'lucide-react';

type ClockProps = {
  timeZone?: string
  locale?: string
}

export function TimeZone({ timeZone = 'UTC', locale = 'en-EN' }: ClockProps) {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  let text = ''
  try {
    text = now.toLocaleTimeString(locale, {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch (e) {
    text = now.toLocaleTimeString(locale, { timeZone: 'UTC' })
  }

  return <div className={"flex gap-1 text-xs items-center opacity-50 mt-1"}><Clock size={10}/> Current time: {text}</div>
}
