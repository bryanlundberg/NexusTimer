import { describe, expect, it, vi } from 'vitest'
import { createMailers } from '../src/infra/mail'

const mail = { to: 'a@b.co', subject: 'Hi', html: '<p>Hi</p>' }

function stubFetch(response = new Response('{}', { status: 200 })) {
  const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('mailers', () => {
  it('sends through Resend with the bearer key', async () => {
    const fetchMock = stubFetch()

    await createMailers({ resend: 're_key' }).resend(mail)

    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://api.resend.com/emails')
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer re_key')
    expect(JSON.parse(String(init.body))).toEqual({
      from: 'NexusTimer <noreply@nexustimer.com>',
      to: 'a@b.co',
      subject: 'Hi',
      html: '<p>Hi</p>'
    })
  })

  it('sends through Brevo with its api key header', async () => {
    const fetchMock = stubFetch(new Response('{}', { status: 201 }))

    await createMailers({ brevo: 'xkeysib' }).brevo(mail)

    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://api.brevo.com/v3/smtp/email')
    expect(new Headers(init.headers).get('api-key')).toBe('xkeysib')
    expect(JSON.parse(String(init.body))).toEqual({
      sender: { name: 'Nexus Timer', email: 'noreply@nexustimer.com' },
      to: [{ email: 'a@b.co' }],
      subject: 'Hi',
      htmlContent: '<p>Hi</p>'
    })
  })

  it('fails when the provider rejects the email', async () => {
    stubFetch(new Response('{"message":"invalid from"}', { status: 422 }))

    await expect(createMailers({ resend: 're_key' }).resend(mail)).rejects.toThrow(/Resend rejected the email with 422/)
  })

  it('fails clearly when a provider has no key', async () => {
    const fetchMock = stubFetch()

    await expect(createMailers({}).brevo(mail)).rejects.toThrow('BREVO_API_KEY is not configured')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
