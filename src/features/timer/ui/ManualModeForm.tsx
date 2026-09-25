'use client'

import * as React from 'react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CornerDownLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import convertToMs from '@/shared/lib/convertToMs'
import formatTime from '@/shared/lib/formatTime'

interface ManualModeFormProps {
  onSubmit: (msTime: number) => void
  placeholder?: string
  className?: string
  initialValue?: string
}

export default function ManualModeForm({
  onSubmit,
  placeholder = '...',
  className = '',
  initialValue = ''
}: ManualModeFormProps) {
  const t = useTranslations('Index.Inputs')
  const [value, setValue] = useState(initialValue)

  const isValidInput = (input: string) => {
    return /^[0-9]*$/.test(input)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if ((isValidInput(val) && parseInt(val) <= 595959) || val === '') {
      setValue(val)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value || isNaN(parseInt(value))) return
    const msTime = convertToMs(value)
    onSubmit(msTime)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full flex-col items-center gap-4 ${className}`}>
      <div className="relative w-full max-w-md">
        <Input
          autoFocus
          className="h-24 w-full px-12 py-6 text-center font-mono text-5xl leading-none tracking-tight sm:text-6xl md:h-32 md:text-7xl lg:text-8xl"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          inputMode="numeric"
          pattern="[0-9]*"
          enterKeyHint="done"
        />
        <button
          type="submit"
          disabled={!value}
          aria-label={t('save')}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute right-2 top-1/2 z-[2] -translate-y-1/2 rounded-md p-2 text-muted-foreground/60 transition-opacity duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-0"
        >
          <CornerDownLeft className="size-5" />
        </button>
      </div>
      {value && <div className="text-xl font-mono text-muted-foreground">{formatTime(convertToMs(value))}</div>}
    </form>
  )
}
