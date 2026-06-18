import { Controller, useForm } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { toast } from 'sonner'
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { countries } from 'country-flag-icons'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { getCountryName } from '@/shared/lib/getCountryName'
import { UserDocument } from '@/entities/user/model/user'
import { KeyedMutator } from 'swr'
import { useLocale, useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AccountInfoForm as IAccountInfoForm,
  BIO_MAX_LENGTH,
  GOAL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  accountInfoSchema
} from '@/features/account-form/model/types'
import { LimitedField } from '@/features/account-form/ui/LimitedField'
import { Loader2, Save } from 'lucide-react'

export default function AccountInfoForm({ user, mutate }: { user?: UserDocument; mutate: KeyedMutator<any> }) {
  const { data: session, update } = useSession()
  const t = useTranslations('Index.AccountPage')
  const locale = useLocale()

  const countryItems = useMemo(
    () =>
      countries
        .map((code) => ({ code, name: getCountryName(code, locale) }))
        .sort((a, b) => a.name.localeCompare(b.name, locale))
        .map(({ code, name }) => (
          <SelectItem key={code} value={code}>
            <span className="flex items-center gap-2">
              <CountryFlag code={code} />
              {name}
            </span>
          </SelectItem>
        )),
    [locale]
  )
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    control
  } = useForm({
    resolver: zodResolver(accountInfoSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      country: user?.country || '',
      goal: user?.goal || '',
      pronoun: user?.pronoun || '',
      bio: user?.bio || ''
    }
  })

  const handleSaveChanges = async (form: IAccountInfoForm) => {
    const updatedForm = {
      ...form,
      country: form.country || undefined,
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
      await update({ user: { name: form.name } })
      toast.success(t('update-success'))
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(t('update-failed'))
      return
    }
  }

  const nameErrorMessage = errors.name?.message as React.ReactNode | undefined

  return (
    <form onSubmit={handleSubmit(handleSaveChanges)} className="space-y-6">
      {/* Identity fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('name')}</label>
          <LimitedField control={control} register={register} name="name" max={NAME_MAX_LENGTH} />
          {nameErrorMessage && <p className="text-destructive text-xs font-medium">{nameErrorMessage}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('pronoun')}</label>
          <Controller
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-10">
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

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('country')}</label>
          <Controller
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder={t('select-country')} />
                </SelectTrigger>
                <SelectContent>{countryItems}</SelectContent>
              </Select>
            )}
            name={'country'}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t('goal')}</label>
          <LimitedField control={control} register={register} name="goal" max={GOAL_MAX_LENGTH} />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('bio')}</label>
        <LimitedField
          control={control}
          register={register}
          name="bio"
          max={BIO_MAX_LENGTH}
          multiline
          placeholder={t('bio-placeholder')}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting || !isDirty || !isValid} className="gap-2 min-w-40">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {t('update-info')}
        </Button>
      </div>
    </form>
  )
}
