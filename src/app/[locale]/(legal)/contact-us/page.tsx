import type { Metadata } from 'next'
import { Link } from '@/shared/config/i18n/navigation'
import { Bug, Lightbulb, Mail, MessagesSquare } from 'lucide-react'
import LegalHero from '@/app/[locale]/(legal)/_components/LegalHero'

const SUPPORT_EMAIL = 'contact.nexustimer@gmail.com'
const REPO_URL = 'https://github.com/bryanlundberg/NexusTimer'
const DISCORD_URL = 'https://discord.gg/eCgTKcavec'

export const metadata: Metadata = {
  title: 'Contact Us - Nexus Timer',
  description: 'Get in touch with the Nexus Timer team by email, on Discord, or through GitHub.',
  alternates: { canonical: '/contact-us' }
}

const ELSEWHERE = [
  {
    icon: Bug,
    title: 'Found a bug',
    text: 'Open an issue on GitHub so it can be tracked and you get notified when it is fixed.',
    href: `${REPO_URL}/issues/new?template=bug_report.yml`,
    action: 'Report a bug'
  },
  {
    icon: Lightbulb,
    title: 'Missing a feature',
    text: 'Feature requests go on GitHub too, where other cubers can add to them.',
    href: `${REPO_URL}/issues/new?template=feature_request.yml`,
    action: 'Request a feature'
  },
  {
    icon: MessagesSquare,
    title: 'Just want to talk',
    text: 'The Discord is the fastest way to reach us and the rest of the community.',
    href: DISCORD_URL,
    action: 'Join the Discord'
  }
]

export default function ContactUsPage() {
  return (
    <>
      <LegalHero
        label="Contact"
        title="Get in touch"
        intro="Nexus Timer is run by a very small team, so email is read by an actual person. Expect a reply within a few days."
      />

      <div className="mx-auto max-w-3xl">
        <div className="surface surface-panel p-8 text-center">
          <Mail className="mx-auto h-6 w-6 text-primary mb-4" aria-hidden />
          <p className="text-sm text-muted-foreground mb-3">Write to us at</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-display text-lg md:text-2xl font-bold tracking-[-0.01em] text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground/60 break-all"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed text-pretty">
            Account questions, data or privacy requests, press, or anything you would rather not post in public. If you
            are writing about your account, send it from the address you signed up with so we can verify it.
          </p>
        </div>

        <h2 className="font-display mt-12 mb-4 text-xl md:text-2xl font-bold tracking-[-0.01em] text-foreground">
          Other ways to reach us
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {ELSEWHERE.map((item) => (
            <div key={item.title} className="surface surface-panel flex h-full flex-col p-5">
              <item.icon className="h-5 w-5 text-primary mb-3" aria-hidden />
              <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty mb-4">{item.text}</p>
              <Link
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="mt-auto text-sm font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground/60"
              >
                {item.action}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground leading-relaxed text-pretty">
          To delete your account and its data, follow the steps on the{' '}
          <Link href="/account-deletion" className="underline underline-offset-4">
            account deletion
          </Link>{' '}
          page.
        </p>
      </div>
    </>
  )
}
