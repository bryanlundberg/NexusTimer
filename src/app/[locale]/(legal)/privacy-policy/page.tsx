import type { Metadata } from 'next'
import { H2, LegalBody, Li, Para } from '@/shared/ui/typography/Typography'
import LegalHero from '@/app/[locale]/(legal)/_components/LegalHero'

export const metadata: Metadata = {
  title: 'Privacy Policy - Nexus Timer',
  description: 'Read the Nexus Timer privacy policy to understand how we collect, store, and use your information.',
  alternates: {
    canonical: '/privacy-policy'
  }
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalHero label="Legal" title="Privacy Policy" intro="Last updated: October 15, 2026" />

      <LegalBody>
        <Para>
          NexusTimer is a free, open-source speedcubing timer available at nexustimer.com and as an installable web app
          (the “Service”). This Privacy Policy explains what information the Service collects, why we collect it, who we
          share it with, and the choices you have. NexusTimer is run by a small independent team; in this policy “we”
          and “us” refer to that team.
        </Para>

        <Para>
          You can use the timer without an account. In that case your solves stay in your browser and we only receive
          the technical information described under “Information collected automatically” and “Analytics and cookies”.
        </Para>

        <H2>Information stored on your device</H2>

        <Para>
          The timer works offline. Your cubes, sessions, solves, scrambles, smart cube move data and settings are stored
          in your browser (IndexedDB and local storage). They only reach our servers when you sign in and use a feature
          that uploads them, such as cloud backups, leaderboards or shared solves. Clearing your browser’s site data or
          uninstalling the app deletes this local copy. You can export it at any time from Settings.
        </Para>

        <H2>Information you give us</H2>

        <ul className="list-disc pl-6">
          <Li>
            <strong>Account.</strong> If you register with email, we collect your email address, name and password. The
            password is stored only as a salted hash. If you sign in with Google or Discord, we receive your name, email
            address, profile picture and account identifier from that provider, along with the sign-in tokens it issues.
          </Li>
          <Li>
            <strong>Profile.</strong> Anything you add to your profile: profile picture, bio, pronouns, country, goal,
            cubing method, main colors and links. If you link your World Cube Association (WCA) account, we receive and
            store only your WCA ID and the date it was verified.
          </Li>
          <Li>
            <strong>Solves and progress.</strong> Cloud backups of your local data, statistics we calculate from your
            latest backup (using your time zone), solves you submit to leaderboards (puzzle, time, penalties, scramble
            and date), solves you share (including the replay when available), trainer progress, learned algorithms and
            achievements.
          </Li>
          <Li>
            <strong>Social features.</strong> Friend requests, friendships, blocked users, direct messages and their
            reactions, read status, and your privacy settings.
          </Li>
          <Li>
            <strong>Feedback.</strong> The rating and comment you send. We also email them to ourselves together with
            your name and email address so we can reply.
          </Li>
          <Li>
            <strong>Algorithm suggestions.</strong> The case, algorithm and optional comment you submit. Suggestions are
            published as public issues on our GitHub repository without your name or account, so do not include personal
            information in them.
          </Li>
          <Li>
            <strong>Support.</strong> Anything you send to contact.nexustimer@gmail.com.
          </Li>
        </ul>

        <H2>Information collected automatically</H2>

        <ul className="list-disc pl-6">
          <Li>
            <strong>IP address.</strong> We use your IP address to limit how often sign-up emails, verification code
            checks and algorithm suggestions can be requested; these counters expire within an hour. When you sign in,
            we store a hash of your IP address with your session instead of the address itself.
          </Li>
          <Li>
            <strong>Sessions.</strong> Each sign-in session stores your browser’s user agent and expiry date.
          </Li>
          <Li>
            <strong>Online status.</strong> While you are signed in, our realtime server tracks whether you are online
            and when you were last seen so your friends can see it. The last seen time is kept for up to 30 days.
          </Li>
          <Li>
            <strong>Free play rooms.</strong> Your name, profile picture and the times you post are shared with the
            other players in the room. Room data is deleted one hour after the room’s last activity.
          </Li>
          <Li>
            <strong>Nexus Connect.</strong> When you pair a phone as a remote timer, the pairing session (the phone’s
            operating system and browser name, and the solves it sends) is relayed through Google Firebase.
          </Li>
          <Li>
            <strong>Error logs.</strong> When something fails, we record technical details that can include your email
            address. Only the most recent 1,000 entries are kept.
          </Li>
        </ul>

        <H2>Analytics and cookies</H2>

        <Para>
          We use Google Analytics to understand how the Service is used. It only sets cookies (such as <code>_ga</code>)
          if you accept analytics in the cookie banner or turn it on in Settings, and you can turn it off there at any
          time. If you decline, the Google tag still loads in consent mode and may send limited, cookieless signals that
          do not identify you across visits.
        </Para>

        <Para>We also use:</Para>

        <ul className="list-disc pl-6">
          <Li>Sign-in cookies, which are strictly necessary and last up to 30 days.</Li>
          <Li>A cookie that remembers your language.</Li>
          <Li>
            Local storage, IndexedDB and the service worker cache, which keep your data, settings, theme and cookie
            choice, and the files the app needs to work offline.
          </Li>
        </ul>

        <Para>We do not show ads and do not use advertising cookies.</Para>

        <H2>Device features</H2>

        <Para>
          Some features ask for browser permissions. Bluetooth is used to connect smart cubes, and the microphone is
          used to read a Stackmat timer signal. Both are processed on your device, and audio is never recorded or
          uploaded. Keeping the screen awake and vibration feedback do not involve any personal data.
        </Para>

        <H2>What other people can see</H2>

        <ul className="list-disc pl-6">
          <Li>
            Your profile (name, profile picture, bio, pronouns, country, goal, cubing method, main colors, links, WCA
            ID, achievements and shared solves) is public and appears in search and on leaderboards.
          </Li>
          <Li>
            Your statistics and learned algorithms are visible to everyone by default. You can limit them to friends or
            to nobody in your privacy settings.
          </Li>
          <Li>Leaderboard entries show your name, profile picture, country and the solve.</Li>
          <Li>Shared solves can be viewed by anyone with the link.</Li>
          <Li>
            Friends can see your online status and, unless either of you turns them off, read receipts and typing
            indicators.
          </Li>
          <Li>
            Direct messages are visible only to you and the person you are talking to. They are stored on our servers
            without end-to-end encryption. We do not read them, except when they are reported to us, when needed to keep
            the Service secure, or when required by law.
          </Li>
        </ul>

        <H2>How we use information</H2>

        <ul className="list-disc pl-6">
          <Li>To provide the Service: syncing, backups, statistics, leaderboards, profiles and social features.</Li>
          <Li>
            To send the emails the Service needs: verification codes, password resets, a welcome email and friend
            request notices. You can turn off friend request emails in your privacy settings.
          </Li>
          <Li>To keep the Service secure, prevent abuse and fix errors.</Li>
          <Li>To understand how the Service is used and improve it, only with your consent for analytics.</Li>
          <Li>To answer your support requests and feedback.</Li>
        </ul>

        <Para>We do not sell your personal information and do not use it for advertising.</Para>

        <H2>Legal bases</H2>

        <Para>
          If you are in the European Economic Area, the United Kingdom or a similar jurisdiction, we process your
          information to provide the Service you asked for (performance of a contract), for our legitimate interests in
          keeping the Service secure and working, with your consent for analytics (which you can withdraw at any time),
          and when required by law.
        </Para>

        <H2>Service providers</H2>

        <Para>We share information with the following providers only as needed to run the Service:</Para>

        <ul className="list-disc pl-6">
          <Li>Cloudflare, which hosts the website and handles all requests to it.</Li>
          <Li>Koyeb, which runs our API.</Li>
          <Li>MongoDB Atlas, which stores account, profile, solve and social data.</Li>
          <Li>Oracle Cloud, which hosts our realtime server, cache and product search.</Li>
          <Li>Backblaze B2, which stores cloud backups and uploaded profile pictures.</Li>
          <Li>Google Firebase, which relays Nexus Connect sessions.</Li>
          <Li>Google Analytics, for usage analytics with your consent.</Li>
          <Li>Resend and Brevo, which send our emails.</Li>
          <Li>GitHub, which hosts algorithm suggestions as public issues.</Li>
          <Li>
            Google and Discord, if you sign in with them. Profile pictures from these providers are loaded from their
            servers.
          </Li>
          <Li>The World Cube Association, if you link your WCA account.</Li>
          <Li>
            UI Avatars (ui-avatars.com), which generates the default profile picture from your name, so your name is
            sent to it whenever that picture is displayed.
          </Li>
        </ul>

        <Para>
          These providers may process information in the United States and other countries outside your own. Where the
          law requires it, transfers rely on the safeguards those providers offer, such as standard contractual clauses.
        </Para>

        <H2>Other disclosures</H2>

        <Para>We may also share information when:</Para>

        <ul className="list-disc pl-6">
          <Li>we are required to by law or a valid legal request;</Li>
          <Li>it is necessary to protect the rights, property or safety of our users, the public or the Service;</Li>
          <Li>the Service is transferred to a new operator, who would then be bound by this policy; or</Li>
          <Li>you ask us to or give us your consent.</Li>
        </ul>

        <H2>How long we keep information</H2>

        <ul className="list-disc pl-6">
          <Li>Account, profile, solve and social data: until you delete it or your account.</Li>
          <Li>Cloud backups: your 10 most recent; older ones are deleted automatically.</Li>
          <Li>Sign-in sessions: up to 30 days.</Li>
          <Li>Declined friend requests: 90 days.</Li>
          <Li>Last seen time: up to 30 days.</Li>
          <Li>Rate limit counters: up to one hour.</Li>
          <Li>Free play rooms: one hour after the room’s last activity.</Li>
          <Li>Error logs: only the most recent 1,000 entries.</Li>
          <Li>Analytics: according to the retention period set in Google Analytics.</Li>
        </ul>

        <H2>Your rights and choices</H2>

        <ul className="list-disc pl-6">
          <Li>
            <strong>Access and correction.</strong> You can edit your profile in the app, and you can email us for a
            copy of the information we hold about you.
          </Li>
          <Li>
            <strong>Portability.</strong> You can export your solves from Settings at any time.
          </Li>
          <Li>
            <strong>Deletion.</strong> You can delete solves, backups and messages in the app, and request the deletion
            of your account as described on our{' '}
            <a className="underline" href="/account-deletion">
              Account Deletion
            </a>{' '}
            page.
          </Li>
          <Li>
            <strong>Privacy settings.</strong> You can choose who can send you friend requests, who can see your
            statistics, whether to show read receipts and typing indicators, whether to receive friend request emails,
            and block other users.
          </Li>
          <Li>
            <strong>Analytics.</strong> You can withdraw your consent in Settings at any time.
          </Li>
          <Li>
            <strong>Complaints.</strong> You can lodge a complaint with your local data protection authority.
          </Li>
        </ul>

        <Para>
          To make a request, email contact.nexustimer@gmail.com from the address registered on your account. We answer
          within 30 days, we do not charge for these requests, and we will not treat you differently for making them.
        </Para>

        <H2>Children</H2>

        <Para>
          The Service is not intended for children under 13, and they may not create an account. If we learn that a
          child under 13 has created an account, we will delete it. If you believe this has happened, please contact us.
        </Para>

        <H2>Security</H2>

        <Para>
          All traffic to the Service is encrypted with HTTPS, passwords are stored only as salted hashes, IP addresses
          are hashed before they are stored with sessions, and access to our systems is restricted. No method of
          transmission or storage is completely secure, so we cannot guarantee absolute security.
        </Para>

        <H2>Changes to this policy</H2>

        <Para>
          We may update this policy as the Service changes. We will change the date at the top of this page, and for
          significant changes we will try to let you know in advance, for example in the app or by email.
        </Para>

        <H2>Contact</H2>

        <Para>For any question about this policy or your information, email us at contact.nexustimer@gmail.com.</Para>
      </LegalBody>
    </>
  )
}
