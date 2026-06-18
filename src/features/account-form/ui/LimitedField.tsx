import { Control, UseFormRegister, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AccountInfoForm } from '@/features/account-form/model/types'

export function LimitedField({
  control,
  register,
  name,
  max,
  multiline,
  placeholder
}: {
  control: Control<AccountInfoForm>
  register: UseFormRegister<AccountInfoForm>
  name: 'name' | 'goal' | 'bio'
  max: number
  multiline?: boolean
  placeholder?: string
}) {
  const length = (useWatch({ control, name }) || '').length
  const over = length > max

  return (
    <>
      {multiline ? (
        <Textarea
          placeholder={placeholder}
          {...register(name)}
          aria-invalid={over}
          className="w-full resize-none min-h-25"
          rows={4}
        />
      ) : (
        <Input {...register(name)} aria-invalid={over} className="h-10" />
      )}
      <div className="flex justify-end">
        <span className={`text-xs ${over ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {length}/{max}
        </span>
      </div>
    </>
  )
}
