import { renderHook } from '@testing-library/react'
import { useQuickStartState } from '@/features/timer/model/useQuickStartState'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

const session = vi.hoisted(() => ({ current: { data: null as unknown, status: 'loading' } }))
const user = vi.hoisted(() => ({ current: { data: undefined as unknown, isError: undefined as unknown } }))
const requestedUserId = vi.hoisted(() => ({ current: undefined as string | undefined }))

vi.mock('@/shared/model/useSession', () => ({ useSession: () => session.current }))
vi.mock('@/entities/user/model/useUser', () => ({
  useUser: (userId: string | undefined) => {
    requestedUserId.current = userId
    return user.current
  }
}))

const signedIn = { data: { user: { id: 'u1' } }, status: 'authenticated' }
const signedOut = { data: null, status: 'unauthenticated' }

const state = () => renderHook(() => useQuickStartState()).result.current

describe('useQuickStartState', () => {
  beforeEach(() => {
    useTimerStore.setState({ cubes: [] })
    session.current = { data: null, status: 'loading' }
    user.current = { data: undefined, isError: undefined }
    requestedUserId.current = undefined
  })

  it('stays hidden while the cubes have not loaded', () => {
    useTimerStore.setState({ cubes: null })
    session.current = signedOut
    expect(state()).toBe('hidden')
  })

  it('stays hidden when there are cubes and skips the user request', () => {
    useTimerStore.setState({ cubes: [{ id: 'c1' }] as never })
    session.current = signedIn
    expect(state()).toBe('hidden')
    expect(requestedUserId.current).toBeUndefined()
  })

  it('waits while the session is loading', () => {
    expect(state()).toBe('pending')
  })

  it('shows once the session is confirmed signed out', () => {
    session.current = signedOut
    expect(state()).toBe('shown')
  })

  it('waits for the user before deciding for a signed in account', () => {
    session.current = signedIn
    expect(state()).toBe('pending')
    expect(requestedUserId.current).toBe('u1')
  })

  it('stays hidden when a backup is about to be restored', () => {
    session.current = signedIn
    user.current = { data: { backup: { url: 'https://cdn/backup.gz' } }, isError: undefined }
    expect(state()).toBe('hidden')
  })

  it('shows for a signed in account without a backup', () => {
    session.current = signedIn
    user.current = { data: { backup: null }, isError: undefined }
    expect(state()).toBe('shown')
  })

  it('shows when the user request fails', () => {
    session.current = signedIn
    user.current = { data: undefined, isError: new Error('offline') }
    expect(state()).toBe('shown')
  })
})
