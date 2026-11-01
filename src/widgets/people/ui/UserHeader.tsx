import { useTranslations } from 'next-intl'
import { profilePath } from '@nexustimer/contracts'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'

interface Props {
  user: {
    _id: string
    name: string
    username?: string
  }
}

export function UserHeader({ user }: Props) {
  const t = useTranslations('Index.NavMain')
  return (
    <CoreHeader
      breadcrumbs={[
        { label: t('people'), href: '/people' },
        { label: user.name, href: profilePath(user._id, user.username) }
      ]}
    />
  )
}
