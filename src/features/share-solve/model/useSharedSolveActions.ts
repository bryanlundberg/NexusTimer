import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import type { CubeCategory } from '@/shared/const/cube-categories'
import type { Solve } from '@/entities/solve/model/types'
import { MY_SHARED_IDS_KEY } from '@/entities/shared-solve/model/useMySharedIds'
import { userSharedSolvesKeyPrefix } from '@/entities/shared-solve/model/useUserSharedSolves'
import { sharedSolveKey } from '@/entities/shared-solve/model/useSharedSolve'
import {
  ShareSolveError,
  shareSolve,
  sharedSolveUrl,
  toShareInput,
  unshareSolve
} from '@/features/share-solve/api/sharedSolvesApi'

const writeClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function useSharedSolveActions() {
  const t = useTranslations('Index.SharedSolves')
  const { mutate } = useSWRConfig()
  const { data: session } = useSession()
  const [pending, setPending] = useState(false)

  const revalidate = async (slug?: string) => {
    const userId = session?.user?.id
    await Promise.all([
      mutate(MY_SHARED_IDS_KEY),
      userId && mutate((key) => typeof key === 'string' && key.includes(userSharedSolvesKeyPrefix(userId))),
      slug && mutate(sharedSolveKey(slug))
    ])
  }

  const run = async <T>(action: () => Promise<T>): Promise<T | null> => {
    if (pending) return null
    setPending(true)
    try {
      return await action()
    } catch (error) {
      const status = error instanceof ShareSolveError ? error.status : 0
      toast.error(status === 429 ? t('errors.rate-limited') : t('errors.generic'))
      return null
    } finally {
      setPending(false)
    }
  }

  const copyLink = async (slug: string) => {
    const url = sharedSolveUrl(slug)
    if (await writeClipboard(url)) toast.success(t('link-copied'), { description: url })
    else toast.error(t('errors.generic'))
  }

  const share = (solve: Solve, puzzle: CubeCategory) =>
    run(async () => {
      const slug = await shareSolve(toShareInput(solve, puzzle))
      await revalidate(slug)
      const url = sharedSolveUrl(slug)
      const copied = await writeClipboard(url)
      toast.success(t(copied ? 'link-created-copied' : 'link-created'), {
        description: url,
        action: copied ? undefined : { label: t('copy-link'), onClick: () => writeClipboard(url) }
      })
      return slug
    })

  const unshare = (slug: string) =>
    run(async () => {
      await unshareSolve(slug)
      await revalidate()
      toast.success(t('unshared'))
      return true
    })

  return { share, unshare, copyLink, pending }
}
