import { Controller, useForm, useWatch } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as React from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { CountryCombobox } from '@/shared/ui/country-combobox/CountryCombobox'
import { UserDocument } from '@/entities/user/model/user'
import { PROFILE_SECTION_IDS } from '@/entities/user/model/profile-completeness'
import { KeyedMutator } from 'swr'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AccountInfoForm as IAccountInfoForm,
  BIO_MAX_LENGTH,
  GOAL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  type ProfilePreview,
  accountInfoSchema,
  toProfilePreview
} from '@/features/account-form/model/types'
import { LimitedField } from '@/features/account-form/ui/LimitedField'
import { MainColorsSelect } from '@/features/account-form/ui/MainColorsSelect'
import { MethodSelect } from '@/features/account-form/ui/MethodSelect'
import { ProfileLinksField } from '@/features/account-form/ui/ProfileLinksField'
import { FieldClearButton } from '@/features/account-form/ui/FieldClearButton'
import { FieldClearSlot } from '@/features/account-form/ui/FieldClearSlot'
import { useScrollToHash } from '@/features/account-form/model/useScrollToHash'
import { FormSaveActions } from '@/features/account-form/ui/FormSaveActions'
import { MarsIcon } from '@/features/account-form/ui/MarsIcon'
import { VenusIcon } from '@/features/account-form/ui/VenusIcon'
import { VenusAndMarsIcon } from '@/features/account-form/ui/VenusAndMarsIcon'
import { normalizeProfileLink } from '@/shared/lib/profile-links'
import { MenuSection } from '@/features/settings/ui/MenuSection'
import { MenuFieldRow } from '@/features/settings/ui/MenuFieldRow'

const SECTION_IDS = PROFILE_SECTION_IDS

function toFormValues(user?: Partial<UserDocument>): IAccountInfoForm {
  return {
    name: user?.name || '',
    country: user?.country || '',
    goal: user?.goal || '',
    pronoun: user?.pronoun || '',
    bio: user?.bio || '',
    method: user?.method || '',
    mainColors: user?.mainColors ?? [],
    links: user?.links?.length ? user.links.map((url) => ({ url })) : [{ url: '' }]
  }
}

interface AccountInfoFormProps {
  user?: UserDocument
  mutate: KeyedMutator<any>
  onPreviewChange?: (preview: ProfilePreview | null) => void
}

export default function AccountInfoForm({ user, mutate, onPreviewChange }: AccountInfoFormProps) {
  const { data: session, update } = useSession()
  const t = useTranslations('Index.AccountPage')
  const tColors = useTranslations('Index.MainColors')
  const tMethod = useTranslations('Index.CubingMethod')
  const tLinks = useTranslations('Index.ProfileLinks')

  // Reset with explicit values: a bare reset() runs the native form.reset() and blanks registered inputs.
  const savedValues = React.useRef<IAccountInfoForm>(toFormValues(user))

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty, isValid },
    control
  } = useForm<IAccountInfoForm>({
    resolver: zodResolver(accountInfoSchema),
    mode: 'onChange',
    defaultValues: savedValues.current
  })

  const watched = useWatch({ control })

  React.useEffect(() => {
    onPreviewChange?.(isDirty ? toProfilePreview(watched) : null)
  }, [watched, isDirty, onPreviewChange])

  React.useEffect(() => () => onPreviewChange?.(null), [onPreviewChange])

  const handleSaveChanges = async (form: IAccountInfoForm) => {
    const payload = {
      name: form.name,
      country: form.country || null,
      goal: form.goal?.trim() || null,
      pronoun: form.pronoun || null,
      bio: form.bio?.trim() || null,
      method: form.method || null,
      mainColors: form.mainColors ?? [],
      links: (form.links ?? []).map(({ url }) => normalizeProfileLink(url)).filter((href) => href !== null)
    }

    try {
      const request = await fetch(`/api/v1/users/${session?.user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })

      if (!request.ok) {
        toast.error(t('update-failed'))
        return
      }

      const saved = (await request.json()) as UserDocument
      savedValues.current = toFormValues(saved)
      reset(savedValues.current)
      await mutate()
      await update({ user: { name: saved.name } })
      toast.success(t('update-success'))
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(t('update-failed'))
    }
  }

  const submit = handleSubmit(handleSaveChanges)

  useScrollToHash(Object.values(SECTION_IDS))

  const nameErrorMessage = errors.name?.message as React.ReactNode | undefined
  const clearLabel = t('clear')

  return (
    <form onSubmit={submit} className="space-y-8">
      <MenuSection
        id={SECTION_IDS.identity}
        title={t('identity-section')}
        footer={t('personal-info-description')}
        className="scroll-mt-20"
      >
        <LimitedField
          id="account-name"
          label={t('name')}
          control={control}
          register={register}
          name="name"
          max={NAME_MAX_LENGTH}
          error={nameErrorMessage}
        />

        <MenuFieldRow label={t('pronoun')} htmlFor="account-pronoun">
          <Controller
            control={control}
            name="pronoun"
            render={({ field }) => (
              <div className="relative">
                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                  <SelectTrigger id="account-pronoun" className="h-11 w-full sm:h-10">
                    <span className="flex flex-1 items-center gap-2 min-w-0">
                      {!field.value && <VenusAndMarsIcon className="size-4 shrink-0 text-muted-foreground" />}
                      <SelectValue placeholder={t('select-pronoun')} />
                    </span>
                    {field.value && <FieldClearSlot />}
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
                {field.value && <FieldClearButton label={clearLabel} onClear={() => field.onChange('')} />}
              </div>
            )}
          />
        </MenuFieldRow>

        <MenuFieldRow label={t('country')} htmlFor="account-country">
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <div className="relative">
                <CountryCombobox
                  id="account-country"
                  value={field.value || null}
                  onChange={(code) => field.onChange(code || '')}
                  placeholder={t('select-country')}
                  searchPlaceholder={t('search-country')}
                  emptyText={t('no-country-found')}
                  className="h-11 w-full sm:h-10"
                  reserveClearSlot={!!field.value}
                />
                {field.value && <FieldClearButton label={clearLabel} onClear={() => field.onChange('')} />}
              </div>
            )}
          />
        </MenuFieldRow>

        <LimitedField
          id="account-bio"
          label={t('bio')}
          control={control}
          register={register}
          name="bio"
          max={BIO_MAX_LENGTH}
          multiline
          placeholder={t('bio-placeholder')}
        />
      </MenuSection>

      <MenuSection id={SECTION_IDS.speedcubing} title={t('cubing-section')} className="scroll-mt-20">
        <LimitedField
          id="account-goal"
          label={t('goal')}
          control={control}
          register={register}
          name="goal"
          max={GOAL_MAX_LENGTH}
          placeholder={t('goal-placeholder')}
        />

        <MenuFieldRow label={tMethod('label')} htmlFor="account-method">
          <Controller
            control={control}
            name="method"
            render={({ field }) => (
              <MethodSelect id="account-method" value={field.value} onChange={field.onChange} clearLabel={clearLabel} />
            )}
          />
        </MenuFieldRow>

        <MenuFieldRow label={tColors('label')} htmlFor="account-main-colors">
          <Controller
            control={control}
            name="mainColors"
            render={({ field }) => (
              <MainColorsSelect
                id="account-main-colors"
                value={field.value}
                onChange={field.onChange}
                clearLabel={clearLabel}
              />
            )}
          />
        </MenuFieldRow>
      </MenuSection>

      <MenuSection
        id={SECTION_IDS.links}
        title={tLinks('label')}
        footer={tLinks('description')}
        className="scroll-mt-20"
      >
        <ProfileLinksField control={control} setValue={setValue} />
      </MenuSection>

      <div className="sticky bottom-4 z-40 drop-shadow-lg">
        <FormSaveActions
          isDirty={isDirty}
          isValid={isValid}
          isSubmitting={isSubmitting}
          onDiscard={() => reset(savedValues.current)}
          onSave={() => submit()}
        />
      </div>
    </form>
  )
}
