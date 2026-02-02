import { useTranslations } from 'next-intl'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'

interface Props {
  user: {
    _id: string
    name: string
  }
}

export function UserHeader({ user }: Props) {
  const t = useTranslations('Index.NavMain')
  return (
    <CoreHeader
      breadcrumbPath={'/people'}
      breadcrumb={t('people')}
      secondaryBreadcrumbPath={`/people/${user._id}`}
      secondaryBreadcrumb={user.name}
    />
  )
}
