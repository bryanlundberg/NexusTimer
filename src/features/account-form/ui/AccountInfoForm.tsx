import { Input } from '@/components/ui/input'
import { Controller, useForm } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { toast } from 'sonner'
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { TimeZone } from '@/features/time-zone/ui/TimeZone'
import { UserDocument } from '@/entities/user/model/user'
import { KeyedMutator } from 'swr'
import { useTranslations } from 'next-intl'

export default function AccountInfoForm({ user, mutate }: { user?: UserDocument; mutate: KeyedMutator<any> }) {
  const { data: session } = useSession()
  const t = useTranslations('Index.AccountPage')

  const timezones = useMemo(() => (Intl as any).supportedValuesOf('timeZone'), [])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      timezone: user?.timezone || '',
      goal: user?.goal || '',
      pronoun: user?.pronoun || '',
      bio: user?.bio || ''
    }
  })

  const handleSaveChanges = async (form: any) => {
    const updatedForm = {
      ...form,
      timezone: form.timezone || undefined,
      goal: form.goal || undefined,
      pronoun: form.pronoun || undefined,
      bio: form.bio || undefined
    }

    try {
      const request = await fetch(`/api/v1/users/${session?.user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedForm)
      })

      if (!request.ok) {
        toast(t('update-failed'))
        return
      }

      await mutate()
      toast.success(t('update-success'))
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(t('update-failed'))
      return
    }
  }

  const nameErrorMessage = errors.name?.message as React.ReactNode | undefined

  return (
    <>
      <div className="w-full mt-2">
        <label className="text-sm text-muted-foreground">{t('name')}</label>
        <Input
          {...register('name', {
            required: t('name-required'),
            minLength: {
              value: 5,
              message: t('name-min-length')
            }
          })}
        />
        {nameErrorMessage && <p className="text-red-500 text-sm mt-1">{nameErrorMessage}</p>}
      </div>

      <div className="w-full mt-2">
        <label className="text-sm text-muted-foreground">{t('timezone')}</label>
        <Controller
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('select-timezone')} />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz: string) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          name={'timezone'}
        />
        {user?.timezone && <TimeZone timeZone={user.timezone} />}
      </div>

      <div className="w-full mt-2">
        <label className="text-sm text-muted-foreground">{t('pronoun')}</label>
        <Controller
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('select-pronoun')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'He'}>{t('pronouns.he')}</SelectItem>
                <SelectItem value={'She'}>{t('pronouns.she')}</SelectItem>
                <SelectItem value={'Other'}>{t('pronouns.other')}</SelectItem>
              </SelectContent>
            </Select>
          )}
          name={'pronoun'}
        />
      </div>

      <div className="w-full mt-2">
        <label className="text-sm text-muted-foreground">{t('goal')}</label>
        <Input {...register('goal')} />
      </div>

      <div className="w-full mt-2">
        <label className="text-sm text-muted-foreground">{t('bio')}</label>
        <Textarea placeholder={t('bio-placeholder')} {...register('bio')} className="w-full" rows={3} />
      </div>

      <div className="flex gap-2 mt-4 w-full">
        <Button
          className="flex-1"
          variant={'secondary'}
          disabled={isSubmitting}
          onClick={handleSubmit(handleSaveChanges)}
        >
          {t('update-info')}
        </Button>
      </div>
    </>
  )
}
