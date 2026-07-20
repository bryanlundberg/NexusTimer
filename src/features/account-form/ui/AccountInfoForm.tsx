import { Controller, useForm } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { CountryCombobox } from '@/shared/ui/country-combobox/CountryCombobox'
import { UserDocument } from '@/entities/user/model/user'
import { KeyedMutator } from 'swr'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AccountInfoForm as IAccountInfoForm,
  BIO_MAX_LENGTH,
  GOAL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  accountInfoSchema
} from '@/features/account-form/model/types'
import { LimitedField } from '@/features/account-form/ui/LimitedField'
import { AlignLeft, Loader2, Save, Target, User } from 'lucide-react'

/** Gender glyphs — lucide paths, inline because Mars/Venus ship in newer lucide versions. */
const genderIconProps: React.SVGProps<SVGSVGElement> = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const MarsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...genderIconProps} {...props}>
    <path d="M16 3h5v5" />
    <path d="m21 3-6.75 6.75" />
    <circle cx="10" cy="14" r="6" />
  </svg>
)

const VenusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...genderIconProps} {...props}>
    <circle cx="12" cy="9" r="6" />
    <path d="M12 15v7" />
    <path d="M9 19h6" />
  </svg>
)

const VenusAndMarsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...genderIconProps} {...props}>
    <path d="M10 20h4" />
    <path d="M12 16v6" />
    <path d="M17 2h4v4" />
    <path d="m21 2-5.46 5.46" />
    <circle cx="12" cy="11" r="5" />
  </svg>
)

export default function AccountInfoForm({ user, mutate }: { user?: UserDocument; mutate: KeyedMutator<any> }) {
  const { data: session, update } = useSession()
  const t = useTranslations('Index.AccountPage')

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
        <div>
          <label className="mb-2 block text-sm font-medium">{t('name')}</label>
          <LimitedField control={control} register={register} name="name" max={NAME_MAX_LENGTH} icon={User} />
          {nameErrorMessage && <p className="mt-1 text-destructive text-xs font-medium">{nameErrorMessage}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t('pronoun')}</label>
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-10">
                    <span className="flex items-center gap-2">
                      {!field.value && <VenusAndMarsIcon className="size-4 shrink-0 text-muted-foreground" />}
                      <SelectValue placeholder={t('select-pronoun')} />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'He'}>
                      <span className="flex items-center gap-2">
                        <MarsIcon className="size-4 text-muted-foreground" />
                        {t('pronouns.he')}
                      </span>
                    </SelectItem>
                    <SelectItem value={'She'}>
                      <span className="flex items-center gap-2">
                        <VenusIcon className="size-4 text-muted-foreground" />
                        {t('pronouns.she')}
                      </span>
                    </SelectItem>
                    <SelectItem value={'Other'}>
                      <span className="flex items-center gap-2">
                        <VenusAndMarsIcon className="size-4 text-muted-foreground" />
                        {t('pronouns.other')}
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )
            }}
            name={'pronoun'}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t('country')}</label>
          <Controller
            control={control}
            render={({ field }) => (
              <CountryCombobox
                value={field.value || null}
                onChange={(code) => field.onChange(code || '')}
                placeholder={t('select-country')}
                searchPlaceholder={t('search-country')}
                emptyText={t('no-country-found')}
                className="w-full h-10"
              />
            )}
            name={'country'}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">{t('goal')}</label>
          <LimitedField control={control} register={register} name="goal" max={GOAL_MAX_LENGTH} icon={Target} />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="mb-2 block text-sm font-medium">{t('bio')}</label>
        <LimitedField
          control={control}
          register={register}
          name="bio"
          max={BIO_MAX_LENGTH}
          multiline
          placeholder={t('bio-placeholder')}
          icon={AlignLeft}
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
