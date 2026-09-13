import { Control, UseFormSetValue, useFieldArray } from 'react-hook-form'
import { Reorder } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AccountInfoForm } from '@/features/account-form/model/types'
import { ProfileLinkRow } from '@/features/account-form/ui/ProfileLinkRow'
import { MAX_PROFILE_LINKS } from '@/shared/lib/profile-links'
import { findMove } from '@/shared/lib/find-move'

export function ProfileLinksField({
  control,
  setValue
}: {
  control: Control<AccountInfoForm>
  setValue: UseFormSetValue<AccountInfoForm>
}) {
  const t = useTranslations('Index.ProfileLinks')
  const { fields, append, insert, remove, move } = useFieldArray({ control, name: 'links' })
  const ids = fields.map((item) => item.id)

  const handleReorder = (nextIds: string[]) => {
    const change = findMove(ids, nextIds)
    if (change) move(...change)
  }

  const handlePasteLinks = (index: number, links: string[], replaceCurrent: boolean) => {
    const [first, ...others] = links
    const rest = replaceCurrent ? others : links
    if (replaceCurrent) {
      setValue(`links.${index}.url`, first, { shouldDirty: true, shouldValidate: true, shouldTouch: true })
    }

    const inserted = rest.slice(0, MAX_PROFILE_LINKS - fields.length).map((url) => ({ url }))
    if (inserted.length) insert(index + 1, inserted, { shouldFocus: false })

    const total = fields.length + inserted.length
    const endsAtLastRow = index + inserted.length === total - 1
    if (endsAtLastRow && total < MAX_PROFILE_LINKS) append({ url: '' }, { shouldFocus: false })
  }

  return (
    <div className="space-y-3">
      <Reorder.Group axis="y" values={ids} onReorder={handleReorder} className="space-y-3">
        {fields.map((item, index) => (
          <ProfileLinkRow
            key={item.id}
            id={item.id}
            control={control}
            index={index}
            count={fields.length}
            onRemove={() => remove(index)}
            onMove={move}
            onPasteLinks={handlePasteLinks}
          />
        ))}
      </Reorder.Group>

      {fields.length < MAX_PROFILE_LINKS && (
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => append({ url: '' })}>
          <Plus className="size-4" />
          {t('add')}
        </Button>
      )}
    </div>
  )
}
