'use client'

import * as React from 'react'
import { useState } from 'react'
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
      <div className="w-full max-w-md">
        <Input
          autoFocus
          className="h-24 w-full py-6 text-center font-mono text-5xl leading-none tracking-tight sm:text-6xl md:h-32 md:text-7xl lg:text-8xl"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      {value && <div className="text-xl font-mono text-muted-foreground">{formatTime(convertToMs(value))}</div>}
    </form>
  )
}
