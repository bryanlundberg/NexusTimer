import { DEFAULT_PRIVACY, type FeedbackResponse } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { Mail } from '../src/infra/mail'
import type { FeedbackService } from '../src/modules/feedback/feedback.service'
import { createFeedbackService } from '../src/modules/feedback/feedback.service'
import type { LogEntry } from '../src/modules/logs/logs.service'
import { buildTestApp, testSessions } from './helpers'

const USER = '64b7f0c2a1b2c3d4e5f60718'

const stored: FeedbackResponse = {
  _id: '64b7f0c2a1b2c3d4e5f60799',
  userId: USER,
  rating: 4,
  comment: 'Great <timer>',
  createdAt: '2026-10-04T10:00:00.000Z',
  updatedAt: '2026-10-04T10:00:00.000Z'
}

function setup({ adminEmail = 'admin@test.dev', mailFails = false, userExists = true } = {}) {
  const sent: Mail[] = []
  const logs: LogEntry[] = []
  const created: unknown[] = []
  const tasks: Promise<unknown>[] = []

  const service = createFeedbackService({
    repository: {
      async create(feedback) {
        created.push(feedback)
        return { ...stored, rating: feedback.rating, comment: feedback.comment }
      }
    },
    users: {
      mailContact: async () => (userExists ? { name: 'Ana', email: 'ana@test.dev', privacy: DEFAULT_PRIVACY } : null)
    },
    mail: async (mail) => {
      if (mailFails) throw new Error('Brevo rejected the email with 401')
      sent.push(mail)
    },
    adminEmail: adminEmail || undefined,
    log: async (entry) => {
      logs.push(entry)
    },
    background: (_scope, task) => {
      tasks.push(task())
    }
  })

  return { service, sent, logs, created, settle: () => Promise.all(tasks.splice(0)) }
}

describe('feedback service', () => {
  it('stores the review and emails the admin with escaped content', async () => {
    const { service, sent, created, settle } = setup()

    const result = await service.submit(USER, { rating: 4, comment: 'Great <timer>' })
    await settle()

    expect(result).toEqual(stored)
    expect(created).toEqual([{ userId: USER, rating: 4, comment: 'Great <timer>' }])
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({ to: 'admin@test.dev', subject: 'New review on NexusTimer' })
    expect(sent[0]!.html).toContain('Great &lt;timer&gt;')
    expect(sent[0]!.html).toContain('ana@test.dev')
    expect(sent[0]!.html).toContain('4/5')
  })

  it('stores an empty comment when none was given', async () => {
    const { service, created, sent, settle } = setup()

    await service.submit(USER, { rating: 5 })
    await settle()

    expect(created).toEqual([{ userId: USER, rating: 5, comment: '' }])
    expect(sent[0]!.html).toContain('<strong>Comment:</strong> -')
  })

  it('skips the email without an admin address or a user', async () => {
    const noAdmin = setup({ adminEmail: '' })
    await noAdmin.service.submit(USER, { rating: 3 })
    await noAdmin.settle()

    const noUser = setup({ userExists: false })
    await noUser.service.submit(USER, { rating: 3 })
    await noUser.settle()

    expect(noAdmin.sent).toEqual([])
    expect(noUser.sent).toEqual([])
  })

  it('records a failed email in the logs instead of failing the review', async () => {
    const { service, logs, settle } = setup({ mailFails: true })

    await expect(service.submit(USER, { rating: 2 })).resolves.toMatchObject({ rating: 2 })
    await settle()

    expect(logs).toEqual([
      {
        type: 'api_error',
        message: 'Brevo rejected the email with 401',
        metadata: { source: 'feedback-email', email: 'ana@test.dev', stack: expect.any(String) }
      }
    ])
  })
})

describe('feedback route', () => {
  const post = (body: unknown) => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })

  function appWith(submit: FeedbackService['submit'], userId: string | null = USER) {
    return buildTestApp({ sessions: testSessions(userId), feedback: { submit } })
  }

  it('answers 401 without a session', async () => {
    const res = await appWith(vi.fn(), null).request('/api/v1/feedback', post({ rating: 5 }))
    expect(res.status).toBe(401)
  })

  it('validates the rating', async () => {
    const submit = vi.fn<FeedbackService['submit']>()
    const app = appWith(submit)

    for (const body of [
      {},
      { rating: 0 },
      { rating: 6 },
      { rating: 4.5 },
      { rating: '5' },
      { rating: 5, comment: 3 }
    ]) {
      const res = await app.request('/api/v1/feedback', post(body))
      expect(res.status).toBe(400)
    }
    expect(submit).not.toHaveBeenCalled()
  })

  it('answers 201 with the stored review', async () => {
    const submit = vi.fn<FeedbackService['submit']>(async () => stored)

    const res = await appWith(submit).request('/api/v1/feedback', post({ rating: 4, comment: 'Great <timer>' }))

    expect(res.status).toBe(201)
    expect(await res.json()).toEqual(stored)
    expect(submit).toHaveBeenCalledWith(USER, { rating: 4, comment: 'Great <timer>' })
  })

  it('answers 500 when the review cannot be stored', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await appWith(() => Promise.reject(new Error('mongo down'))).request(
      '/api/v1/feedback',
      post({ rating: 4 })
    )

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
  })
})
