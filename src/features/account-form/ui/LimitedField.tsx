import { Control, UseFormRegister, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AccountInfoForm } from '@/features/account-form/model/types'
import { MenuFieldRow } from '@/features/settings/ui/MenuFieldRow'
import { cn } from '@/shared/lib/utils'

export function LimitedField({
  id,
  label,
  control,
  register,
  name,
  max,
  multiline,
  placeholder,
  error
}: {
  id: string
  label: string
  control: Control<AccountInfoForm>
  register: UseFormRegister<AccountInfoForm>
  name: 'name' | 'goal' | 'bio'
  max: number
  multiline?: boolean
  placeholder?: string
  error?: React.ReactNode
}) {
  // React Compiler would memoize register(), leaving the input blank after reset().
  'use no memo'
  const length = (useWatch({ control, name }) || '').length
  const over = length > max

  return (
    <MenuFieldRow
      label={label}
      htmlFor={id}
      error={error}
      hint={
        <span
          className={cn(
            'text-xs tabular-nums',
            over ? 'font-medium text-destructive' : length > max * 0.8 ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {length}/{max}
        </span>
      }
    >
      {multiline ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          {...register(name)}
          aria-invalid={over || !!error}
          className="min-h-25 w-full resize-none"
          rows={4}
        />
      ) : (
        <Input
          id={id}
          placeholder={placeholder}
          {...register(name)}
          aria-invalid={over || !!error}
          autoComplete={name === 'name' ? 'name' : 'off'}
          enterKeyHint="next"
          className="h-11 sm:h-10"
        />
      )}
    </MenuFieldRow>
  )
}
