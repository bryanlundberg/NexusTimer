import { useSession } from '@/shared/model/useSession'
import { useUser } from '@/entities/user/model/useUser'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

export type QuickStartState = 'hidden' | 'pending' | 'shown'

export function useQuickStartState(): QuickStartState {
  const hasNoCubes = useTimerStore((store) => store.cubes?.length === 0)
  const { data: session, status } = useSession()
  const { data: user, isError } = useUser(hasNoCubes ? session?.user?.id : undefined)

  if (!hasNoCubes) return 'hidden'
  if (status === 'unauthenticated') return 'shown'
  if (status === 'loading' || (user === undefined && !isError)) return 'pending'
  return user?.backup?.url ? 'hidden' : 'shown'
}
