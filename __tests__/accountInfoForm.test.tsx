import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'
import AccountInfoForm from '@/features/account-form/ui/AccountInfoForm'

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: 'u1', name: 'Mateo' } }, update: vi.fn() })
}))

beforeAll(() => {
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.IntersectionObserver = NoopObserver as never
  globalThis.ResizeObserver = NoopObserver as never
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {}
  })) as never
})

const user = { _id: 'u1', name: 'Mateo', email: 'a@b.co', image: '', goal: 'Sub-10', bio: 'hi' } as never

const renderForm = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AccountInfoForm user={user} mutate={vi.fn() as never} />
    </NextIntlClientProvider>
  )

describe('AccountInfoForm save actions', () => {
  it('stay hidden until something changes', () => {
    renderForm()
    expect(screen.queryByText('Unsaved changes')).toBeNull()
  })

  it.each(['account-name', 'account-goal', 'account-bio'])('appear as soon as %s is edited', async (id) => {
    renderForm()
    await act(async () => {
      fireEvent.change(document.getElementById(id)!, { target: { value: 'Something new' } })
    })
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  const field = (id: string) => document.getElementById(id) as HTMLInputElement
  const type = async (id: string, value: string) => {
    await act(async () => {
      fireEvent.change(field(id), { target: { value } })
    })
  }

  it('discard restores every stored text value and keeps the fields editable', async () => {
    renderForm()
    await type('account-name', 'Other name')
    await type('account-goal', 'Sub-5')
    await type('account-bio', 'changed')

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Discard' }))
    })

    expect(field('account-name').value).toBe('Mateo')
    expect(field('account-goal').value).toBe('Sub-10')
    expect(field('account-bio').value).toBe('hi')
    await waitFor(() => expect(screen.queryByText('Unsaved changes')).toBeNull())

    await type('account-bio', 'edited again')
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
  })

  it('keeps tracking edits after a successful save', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ ...(user as object), bio: 'saved bio' }), { status: 200 }))
    renderForm()
    await type('account-bio', 'saved bio')

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    })

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(field('account-bio').value).toBe('saved bio')
    expect(field('account-name').value).toBe('Mateo')
    await waitFor(() => expect(screen.queryByText('Unsaved changes')).toBeNull())

    await type('account-name', 'Renamed')
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
    fetchMock.mockRestore()
  })
})
