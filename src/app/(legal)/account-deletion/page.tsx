import type { Metadata } from 'next'
import { locales } from '@/shared/config/i18n/locales'
import { H2, Li, Para } from '@/shared/ui/typography/Typography'

export const metadata: Metadata = {
  title: 'Account Deletion - Nexus Timer',
  description: 'Request the permanent deletion of your NexusTimer account and all associated data.',
  alternates: {
    canonical: '/account-deletion',
    languages: Object.fromEntries(locales.map((l) => [l, '/account-deletion']))
  }
}

const SUPPORT_EMAIL = 'contact.nexustimer@gmail.com'
const DEFAULT_MESSAGE = 'I request the permanent deletion of my NexusTimer account and all associated data.'

export default function AccountDeletionPage() {
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Account Deletion Request')}&body=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <div className={'max-w-lg mx-auto py-10'}>
      <h1 className="text-3xl font-black mb-4">Account Deletion Request</h1>

      <Para>
        You can request the permanent deletion of your NexusTimer account and all associated data at any time. Requests
        are processed manually and may take up to 30 days to complete.
      </Para>

      <H2>How to request deletion</H2>

      <Para>
        Send an email to{' '}
        <a className="underline" href={mailto}>
          {SUPPORT_EMAIL}
        </a>{' '}
        from the email address registered on your NexusTimer account. Requests sent from any other address will not be
        processed, as we cannot verify ownership of the account.
      </Para>

      <Para>You may write your own short message in English, or copy and paste the default text below:</Para>

      <pre className="border rounded-md p-3 text-sm whitespace-pre-wrap break-words bg-muted/30 mb-3">
        {DEFAULT_MESSAGE}
      </pre>

      <H2>What will be deleted</H2>

      <ul className="list-disc pl-6">
        <Li>Your user account (name, email, profile picture, bio, preferences).</Li>
        <Li>All solves and statistics synced to our servers.</Li>
        <Li>All cloud backups stored on our servers and on our file storage provider.</Li>
        <Li>Any authentication credentials, email verifications, and password reset tokens linked to your account.</Li>
        <Li>Feedback entries you have submitted.</Li>
      </ul>

      <H2>Local data on your device</H2>

      <Para>
        NexusTimer also stores data locally on your device using your browser&apos;s IndexedDB so the app can work
        offline. This data never leaves your device, so we cannot delete it for you. To remove it, clear the site data
        for NexusTimer from your browser settings, or uninstall the PWA if you have installed it.
      </Para>

      <H2>Important notes</H2>

      <ul className="list-disc pl-6">
        <Li>
          Requests are reviewed manually and may take up to 30 days to be processed. Once approved, all associated data
          is permanently and immediately deleted from our servers.
        </Li>
        <Li>Deletion is permanent and cannot be undone.</Li>
        <Li>If you sign in again with the same provider after deletion, a new empty account will be created.</Li>
        <Li>
          For questions about how your data is handled, see our{' '}
          <a className="underline" href="/privacy-policy">
            Privacy Policy
          </a>
          .
        </Li>
      </ul>
    </div>
  )
}
