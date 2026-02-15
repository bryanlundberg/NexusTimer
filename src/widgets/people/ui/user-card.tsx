import { UserDocument } from '@/entities/user/model/user'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ExternalLink, GitCompareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { useTranslations } from 'next-intl'

export default function UserCard({ user }: { user: UserDocument }) {
  const t = useTranslations('Index.PeoplePage.user-card')
  const router = useRouter()
  const addUser = useCompareUsersStore((state) => state.addUser)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const users = useCompareUsersStore((state) => state.users)
  const isAdded = users.find((u) => u._id === user._id)

  return (
    <Card className="group transition-all duration-300 animate-fadeIn h-full bg-card/20 hover:bg-card/40 border-muted/50 hover:border-primary/30 backdrop-blur-md flex flex-col @xs/people:flex-row items-center p-4 gap-4">
      <div className="shrink-0">
        <Avatar className="size-20 ring-4 ring-background shadow-xl group-hover:ring-primary/20 transition-all duration-300">
          <AvatarImage className={'object-cover'} src={user.image} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center @xs/people:items-start flex-1 min-w-0 h-full">
        <h2 className="text-xl font-bold text-center @xs/people:text-left line-clamp-1 transition-colors w-full">
          {user.name}
        </h2>

        <div className="flex items-center gap-2 mt-auto w-full">
          <Button
            onClick={() => (isAdded ? removeUser(user._id) : addUser(user))}
            variant={isAdded ? 'secondary' : 'outline'}
            size="sm"
            className="flex-1 gap-2 text-xs font-semibold h-9"
          >
            <GitCompareIcon className="size-4" />
            {t('compare')}
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-2 text-xs font-semibold h-9 shadow-lg shadow-primary/10"
            onClick={() => router.push(`/people/${user._id}`)}
          >
            {t('view-profile')}
            <ExternalLink className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
