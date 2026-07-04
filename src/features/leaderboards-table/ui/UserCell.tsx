import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
      <TooltipContent className="p-0 max-w-56">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <Avatar className="size-8 shrink-0 ring-1 ring-primary-foreground/20">
            <AvatarImage className="object-cover" src={user.image} />
            <AvatarFallback className="bg-primary-foreground/15 text-[10px] text-primary-foreground">
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="truncate text-sm font-semibold leading-tight">{user.name}</span>
              {user?.pronoun && (
                <span className="shrink-0 text-[10px] font-normal text-primary-foreground/60">{user.pronoun}</span>
              )}
            </div>
            {user?.country && (
              <span className="flex items-center gap-1.5 text-[11px] text-primary-foreground/70">
                <CountryFlag code={user.country} className="shrink-0" />
                <span className="truncate">{getCountryName(user.country, locale)}</span>
              </span>
            )}
            {user?.goal && (
              <span className="mt-0.5 inline-flex w-fit max-w-full items-center truncate rounded bg-primary-foreground/15 px-1.5 py-0.5 text-[10px] font-medium">
                {user.goal}
              </span>
            )}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
