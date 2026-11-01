'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import type { KeyedMutator } from 'swr'
import {
  type ChangeUsernameResponse,
  normalizeUsername,
  USERNAME_MAX_LENGTH,
  usernameIssue
} from '@nexustimer/contracts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { UserDocument } from '@/entities/user/model/user'
import { useUsernameAvailability } from '@/features/change-username/model/useUsernameAvailability'
import { MenuFieldRow } from '@/features/settings/ui/MenuFieldRow'
import { cn } from '@/shared/lib/utils'
import { useSession } from '@/shared/model/useSession'

interface Props {
  user: UserDocument
  mutate: KeyedMutator<UserDocument>
}

export function UsernameRow({ user, mutate }: Props) {
  const t = useTranslations('Index.UsernameSettings')
  const { update } = useSession()
  const current = user.username ?? ''
  const locked = !!user.usernameChangedAt
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(current)
  const [saving, setSaving] = useState(false)

  const username = normalizeUsername(value)
  const changed = editing && username !== current
  const formatIssue = changed ? usernameIssue(username) : null
  const { result, checking, check } = useUsernameAvailability()

  const checked = changed && result?.username === username ? result : null
  const availability = checked?.availability
  const failed = !!checked && !availability
  const issue = formatIssue ?? (availability?.available === false ? availability.issue : null)
  const canCheck = changed && !formatIssue && !checking && !saving && !checked
  const canSave = changed && !saving && !issue && (availability?.available || failed)
  const status = !changed
    ? null
    : issue
      ? t(`issues.${issue}`)
      : checking
        ? t('checking')
        : availability?.available
          ? t('available')
          : null

  const submit = () => {
    if (canSave) save()
    else if (canCheck) check(username)
  }

  const cancel = () => {
    setEditing(false)
    setValue(current)
  }

  const save = async () => {
    if (!canSave) return

    setSaving(true)
    try {
      const res = await fetch('/api/v1/users/username', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username })
      })
      if (res.status === 409) {
        const { message } = (await res.json()) as { message?: string }
        toast.error(message === 'locked' ? t('locked') : t('issues.taken'))
        return
      }
      if (!res.ok) {
        toast.error(t('failed'))
        return
      }

      const saved = (await res.json()) as ChangeUsernameResponse
      setValue(saved.username)
      setEditing(false)
      await mutate()
      await update()
      toast.success(t('saved'))
    } catch {
      toast.error(t('failed'))
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <MenuFieldRow
        label={t('label')}
        hint={
          locked ? (
            <span className="text-xs text-muted-foreground">{t('locked')}</span>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs font-medium text-primary hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {t('change')}
            </button>
          )
        }
      >
        <p className="truncate text-sm text-muted-foreground">@{current}</p>
      </MenuFieldRow>
    )
  }

  return (
    <MenuFieldRow label={t('label')} htmlFor="account-username">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">@</span>
        <Input
          id="account-username"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submit()
            }
            if (event.key === 'Escape') cancel()
          }}
          disabled={saving}
          autoFocus
          maxLength={USERNAME_MAX_LENGTH + 5}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={!!issue}
          aria-describedby="account-username-status"
          className="h-11 w-full pl-7 sm:h-10"
        />
      </div>
      <p
        id="account-username-status"
        aria-live="polite"
        className={cn('text-[13px] sm:text-xs', issue ? 'font-medium text-destructive' : 'text-muted-foreground')}
      >
        {status ?? t('once')}
      </p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={cancel} disabled={saving}>
          {t('cancel')}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={submit} disabled={!canSave && !canCheck}>
          {canSave ? t('save') : t('check')}
        </Button>
      </div>
    </MenuFieldRow>
  )
}
