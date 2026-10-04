import { describe, expect, it, vi } from 'vitest'
import { runInBackground } from '../src/platform/background'

describe('runInBackground', () => {
  it('runs the task', async () => {
    const task = vi.fn(() => Promise.resolve('done'))

    await runInBackground('test', task)

    expect(task).toHaveBeenCalledOnce()
  })

  it('logs failures instead of rejecting', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(runInBackground('test', () => Promise.reject(new Error('nope')))).resolves.toBeUndefined()
    expect(String(consoleError.mock.calls[0]?.[0])).toContain('nope')
  })

  it('logs synchronous throws too', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await runInBackground('test', () => {
      throw new Error('sync')
    })

    expect(String(consoleError.mock.calls[0]?.[0])).toContain('sync')
  })
})
