import { Control, UseFormRegister, useWatch } from 'react-hook-form'
import { type LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AccountInfoForm } from '@/features/account-form/model/types'
import { cn } from '@/shared/lib/utils'

export function LimitedField({
  control,
  register,
  name,
  max,
  multiline,
  placeholder,
  icon: Icon
}: {
  control: Control<AccountInfoForm>
  register: UseFormRegister<AccountInfoForm>
  name: 'name' | 'goal' | 'bio'
  max: number
  multiline?: boolean
  placeholder?: string
  icon?: LucideIcon
}) {
  const length = (useWatch({ control, name }) || '').length
  const over = length > max

  return (
    <>
      <div className="relative">
        {multiline ? (
          <Textarea
            placeholder={placeholder}
            {...register(name)}
            aria-invalid={over}
            className={cn('peer w-full resize-none min-h-25', Icon && 'pl-9')}
            rows={4}
          />
        ) : (
          <Input {...register(name)} aria-invalid={over} className={cn('peer h-10', Icon && 'pl-9')} />
        )}
        {Icon && (
          <Icon
            className={cn(
              'pointer-events-none absolute left-3 size-4 text-muted-foreground',
              multiline ? 'top-3' : 'top-1/2 -translate-y-1/2'
            )}
          />
        )}
      </div>
      <div className="mt-1.5 flex justify-end">
        <span className={`text-xs ${over ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {length}/{max}
        </span>
      </div>
    </>
  )
}
