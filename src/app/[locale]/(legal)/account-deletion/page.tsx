import type { Metadata } from 'next'
import { H2, LegalBody, Li, Para } from '@/shared/ui/typography/Typography'
import LegalHero from '@/app/[locale]/(legal)/_components/LegalHero'

export const metadata: Metadata = {
  title: 'Account Deletion - Nexus Timer',
  description: 'Request the permanent deletion of your NexusTimer account and all associated data.',
  alternates: {
    canonical: '/account-deletion'
  }
}

const SUPPORT_EMAIL = 'contact.nexustimer@gmail.com'
const DEFAULT_MESSAGE = 'I request the permanent deletion of my NexusTimer account and all associated data.'

export default function AccountDeletionPage() {
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Account Deletion Request')}&body=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <>
      <LegalHero label="Your data" title="Account Deletion Request" />

      <LegalBody>
        <Para>
          You can request the permanent deletion of your NexusTimer account and the data linked to it at any time.
          Requests are processed manually and may take up to 30 days to complete.
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

        <pre className="border p-3 text-sm whitespace-pre-wrap break-words bg-muted/30 mb-3">{DEFAULT_MESSAGE}</pre>

        <H2>What will be deleted</H2>

        <ul className="list-disc pl-6">
          <Li>
            Your user account and profile (name, email, profile picture, bio, profile details, WCA link and privacy
            settings).
          </Li>
          <Li>
            Your sign-in methods, password, active sessions, and pending verification and password reset requests.
          </Li>
          <Li>All solves submitted to leaderboards, your shared solves and your statistics.</Li>
          <Li>Your trainer progress, learned algorithms and achievements.</Li>
          <Li>All cloud backups and your profile picture, from our file storage provider.</Li>
          <Li>Your friends, pending friend requests and blocks, in both directions.</Li>
          <Li>
            All your conversations and their messages. Because conversations are one to one, they also disappear for the
            other person.
          </Li>
          <Li>Your online status and last seen time.</Li>
          <Li>Feedback entries you have submitted.</Li>
        </ul>

        <H2>Local data on your device</H2>

        <Para>
          NexusTimer also stores your data locally in your browser&apos;s IndexedDB so the app can work offline. We
          cannot access or delete this local copy for you. To remove it, clear the site data for NexusTimer from your
          browser settings, or uninstall the PWA if you have installed it.
        </Para>

        <H2>Important notes</H2>

        <ul className="list-disc pl-6">
          <Li>
            Requests are reviewed manually and may take up to 30 days to be processed. Once approved, the data listed
            above is permanently deleted from our servers. Copies in our providers&apos; backups and caches expire on
            their own schedule.
          </Li>
          <Li>Deletion is permanent and cannot be undone.</Li>
          <Li>Algorithm suggestions already published on GitHub never included your account, so they stay public.</Li>
          <Li>If you sign in again with the same provider after deletion, a new empty account will be created.</Li>
          <Li>
            For questions about how your data is handled, see our{' '}
            <a className="underline" href="/privacy-policy">
              Privacy Policy
            </a>
            .
          </Li>
        </ul>
      </LegalBody>
    </>
  )
}
