import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import type { SolveServer } from '@/entities/solve/model/types'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { getCountryName } from '@/shared/lib/getCountryName'

interface UserCellProps {
  user: SolveServer['user']
}

export function UserCell({ user }: UserCellProps) {
  const router = useRouter()
  const locale = useLocale()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex flex-row items-center gap-2 min-w-0 hover:underline w-fit"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/people/${user._id}`)
          }}
        >
          <Avatar className="size-7 shrink-0">
            <AvatarImage className="object-cover" src={user.image} />
            <AvatarFallback className="text-[10px]">{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">{user.name}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <h2 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2">
          {user.name}
          {user?.pronoun && <span className="text-sm text-muted-foreground font-normal">{user.pronoun}</span>}
        </h2>
        {user?.country && (
          <div className="flex items-center justify-center gap-1.5">
            <CountryFlag code={user.country} />
            {getCountryName(user.country, locale)}
          </div>
        )}
        {user?.goal && <Badge>{user.goal}</Badge>}
      </TooltipContent>
    </Tooltip>
  )
}
