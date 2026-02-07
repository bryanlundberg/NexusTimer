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
    <form onSubmit={handleSubmit} className={`flex flex-col items-center gap-4 ${className}`}>
      <Input
        autoFocus
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl h-24 md:h-32 text-center w-full max-w-md font-mono py-4"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      {value && <div className="text-xl font-mono text-muted-foreground">{formatTime(convertToMs(value))}</div>}
    </form>
  )
}
