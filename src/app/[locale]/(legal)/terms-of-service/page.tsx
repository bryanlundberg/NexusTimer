import type { Metadata } from 'next'
import { H2, LegalBody, Li, Para } from '@/shared/ui/typography/Typography'
import LegalHero from '@/app/[locale]/(legal)/_components/LegalHero'

export const metadata: Metadata = {
  title: 'Terms of Service - Nexus Timer',
  description: 'Read the Nexus Timer terms of service and understand the rules and guidelines for using our platform.',
  alternates: {
    canonical: '/terms-of-service'
  }
}

export default function TosPage() {
  return (
    <>
      <LegalHero label="Legal" title="Terms of Service" intro="Last updated: October 15, 2026" />

      <LegalBody>
        <Para>
          These Terms of Service (the “Terms”) govern your use of the NexusTimer website at nexustimer.com, the
          installable web app and the related online services (together, the “Service”). NexusTimer is run by a small
          independent team, referred to in these Terms as “NexusTimer”, “we” or “us”.
        </Para>

        <Para>
          By using the Service you agree to these Terms and to our{' '}
          <a className="underline" href="/privacy-policy">
            Privacy Policy
          </a>
          . If you do not agree, do not use the Service.
        </Para>

        <H2>1. Open-source software</H2>
        <Para>
          The NexusTimer source code is free software, published on GitHub under the GNU General Public License, version
          3 (GPL-3.0). Your rights to run, study, modify and redistribute that code are governed by the GPL-3.0, and
          nothing in these Terms limits them. These Terms only cover the hosted Service that we operate.
        </Para>
        <Para>
          The NexusTimer name and logo identify our official Service. If you run or distribute a modified version, do
          not present it as the official NexusTimer.
        </Para>

        <H2>2. Eligibility</H2>
        <Para>
          You must be at least 13 years old to create an account or use the online features of the Service. If you are
          under the age of majority where you live, you confirm that your parent or legal guardian has reviewed and
          agreed to these Terms.
        </Para>

        <H2>3. Your account</H2>
        <Para>
          An account is optional; the timer works without one. You can create an account with an email address and
          password, or sign in with Google or Discord. When you have an account:
        </Para>
        <ul className="list-disc pl-6">
          <Li>Keep your sign-in details secure and do not share your account with anyone.</Li>
          <Li>
            Use your own identity. Do not create accounts with false information, on behalf of someone else, or to
            impersonate another person.
          </Li>
          <Li>Do not sell, rent or transfer your account.</Li>
          <Li>
            Tell us at contact.nexustimer@gmail.com if you believe someone else has accessed your account, and change
            your password.
          </Li>
        </ul>
        <Para>
          We may change or remove names, profile pictures or other profile content that impersonate others, are
          offensive, or infringe someone else’s rights.
        </Para>

        <H2>4. Acceptable use</H2>
        <Para>When using the Service, you agree not to:</Para>
        <ul className="list-disc pl-6">
          <Li>
            Submit times you did not achieve, or forge, script or otherwise manipulate leaderboard entries, statistics
            or achievements.
          </Li>
          <Li>
            Use bots, scrapers or other automated tools in a way that overloads the Service, or try to get around rate
            limits or security measures.
          </Li>
          <Li>Access or try to access other people’s accounts or data without their permission.</Li>
          <Li>Harass, threaten, bully or abuse other users, or encourage others to do so.</Li>
          <Li>Send spam, chain messages or unsolicited advertising.</Li>
          <Li>
            Post content that is illegal, sexually explicit, hateful or violent, that infringes someone else’s
            intellectual property or privacy, or that links to such content.
          </Li>
          <Li>Share other people’s personal information without their consent.</Li>
          <Li>
            Attack, disrupt or overload the Service or the servers and networks connected to it, including by
            distributing malware or carrying out denial of service attacks.
          </Li>
        </ul>
        <Para>Using supported hardware such as smart cubes and Stackmat timers is, of course, allowed.</Para>

        <H2>5. Leaderboards and fair play</H2>
        <Para>
          Leaderboard times are submitted by users and are not verified by us. We may review, hide or remove entries
          that appear invalid and restrict accounts that submit them. Rankings on NexusTimer are unofficial and are not
          affiliated with or endorsed by the World Cube Association (WCA).
        </Para>

        <H2>6. Your content</H2>
        <Para>
          “Your content” means anything you create or upload through the Service, such as your profile, profile picture,
          solves, shared solves, backups and messages. You keep ownership of your content.
        </Para>
        <Para>
          You give us a worldwide, non-exclusive, royalty-free license to store, copy, display and transmit your content
          only as needed to operate and improve the Service, for example to show your profile and leaderboard entries to
          other users or to deliver your messages. This license ends when you delete the content or your account, except
          for copies that other users have already received, such as messages you sent them.
        </Para>
        <Para>
          You are responsible for your content and confirm that you have the right to share it and that it follows these
          Terms.
        </Para>
        <Para>
          Algorithm suggestions are published as public issues on our GitHub repository. By sending one, you agree that
          it may be published and included in the project under its open-source license. If you send us feedback or
          ideas, we may use them without any obligation to you.
        </Para>

        <H2>7. Messages and moderation</H2>
        <Para>
          Direct messages are private between the people in the conversation, and we do not monitor them. We may review
          content that is reported to us, or when it is necessary to enforce these Terms, protect our users or comply
          with the law, and we may remove content that breaks these Terms. You can block other users at any time, and
          report abuse by emailing contact.nexustimer@gmail.com.
        </Para>
        <Para>
          You are responsible for your interactions with other users. We are not required to get involved in disputes
          between users, although we may choose to.
        </Para>

        <H2>8. Your data and backups</H2>
        <Para>
          The timer stores your solves in your browser. They can be lost if you clear your browser’s site data, switch
          browsers or devices, or uninstall the app. Cloud backups only keep your 10 most recent backups. We work to
          keep your data safe, but we cannot guarantee that it will never be lost, so we recommend exporting your data
          regularly from Settings.
        </Para>

        <H2>9. Third-party services and hardware</H2>
        <Para>
          The Service lets you use or link to services and devices run by others, including sign-in with Google or
          Discord, WCA account linking, links on user profiles, Discord and GitHub, and smart cubes and timers made by
          third parties. Their own terms and policies apply, and we are not responsible for them. NexusTimer is not
          affiliated with the WCA or with any cube or timer manufacturer, and we do not guarantee that any particular
          device will work with the Service.
        </Para>

        <H2>10. A free and evolving service</H2>
        <Para>
          The Service is free and does not offer purchases. It changes over time: we may add, change or remove features,
          or stop offering the Service, at any time. If we decide to shut the Service down, we will try to give notice
          so you can export your data.
        </Para>

        <H2>11. Suspension and termination</H2>
        <Para>
          You can stop using the Service at any time and request the deletion of your account as described on our{' '}
          <a className="underline" href="/account-deletion">
            Account Deletion
          </a>{' '}
          page.
        </Para>
        <Para>
          We may limit, suspend or close your account, or remove your content, if you break these Terms, if your use of
          the Service creates a risk or legal exposure for us or for other users, or if we are required to by law.
        </Para>

        <H2>12. Disclaimer of warranties</H2>
        <Para>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. WE DO NOT
          WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT YOUR DATA WILL NOT BE LOST, OR THAT TIMES,
          SCRAMBLES AND STATISTICS WILL BE ACCURATE.
        </Para>
        <Para>
          Some jurisdictions do not allow the exclusion of certain warranties, so some of these exclusions may not apply
          to you.
        </Para>

        <H2>13. Limitation of liability</H2>
        <Para>
          TO THE FULLEST EXTENT PERMITTED BY LAW, NEXUSTIMER AND ITS MAINTAINERS AND CONTRIBUTORS WILL NOT BE LIABLE FOR
          ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF DATA, ARISING OUT OF
          OR RELATING TO THESE TERMS OR THE SERVICE. BECAUSE THE SERVICE IS FREE, YOUR SOLE REMEDY FOR ANY DISPUTE WITH
          US IS TO STOP USING THE SERVICE AND DELETE YOUR ACCOUNT.
        </Para>
        <Para>
          Nothing in these Terms excludes or limits liability that cannot be excluded or limited by law, such as
          liability for gross negligence, willful misconduct, fraud, or death or personal injury, or affects your rights
          as a consumer under applicable law.
        </Para>

        <H2>14. Indemnity</H2>
        <Para>
          You agree to defend and indemnify NexusTimer against any third-party claims, damages and reasonable legal
          costs arising from your content or from your breach of these Terms, to the extent they are caused by your
          intentional or negligent conduct.
        </Para>

        <H2>15. Changes to these Terms</H2>
        <Para>
          We may update these Terms as the Service changes. We will change the date at the top of this page, and for
          significant changes we will try to let you know in advance, for example in the app or by email. If you keep
          using the Service after the changes take effect, you accept the updated Terms.
        </Para>

        <H2>16. General</H2>
        <ul className="list-disc pl-6">
          <Li>
            <strong>Entire agreement.</strong> These Terms and the Privacy Policy are the entire agreement between you
            and us about the Service.
          </Li>
          <Li>
            <strong>Severability.</strong> If any part of these Terms is found unenforceable, the rest remains in
            effect.
          </Li>
          <Li>
            <strong>No waiver.</strong> If we do not enforce a part of these Terms, that does not mean we give up the
            right to enforce it later.
          </Li>
          <Li>
            <strong>Transfer.</strong> We may transfer these Terms to a new operator of the Service. You may not
            transfer your rights or obligations under them without our consent.
          </Li>
          <Li>
            <strong>Events beyond our control.</strong> We are not responsible for delays or failures caused by events
            outside our reasonable control, such as outages of our hosting providers, natural disasters or government
            action.
          </Li>
        </ul>

        <H2>Contact</H2>
        <Para>If you have any question about these Terms, email us at contact.nexustimer@gmail.com.</Para>
      </LegalBody>
    </>
  )
}
