import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ roomId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomId } = await params
  const t = await getTranslations('Multiplayer.OpenGraph')

  return {
    title: `Nexus Timer - ${t('room', { roomId })}`,
    description: t('description', { roomId }),
    openGraph: {
      title: `Nexus Timer - ${t('room', { roomId })}`,
      description: t('description', { roomId }),
      type: 'website'
    }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
