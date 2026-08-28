'use client'
import { Fragment, memo } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { cn } from '@/shared/lib/utils'
import { VIRTUAL_MOVE_GROUPS, VIRTUAL_MOVES } from '@/features/timer/model/virtualKeymap'

type VirtualKeymapKeyProps = {
  code: string
  label: string
  move?: string
  isPressed: boolean
  onSelect: (code: string, move: string | null) => void
}

function VirtualKeymapKey({ code, label, move, isPressed, onSelect }: VirtualKeymapKeyProps) {
  const definition = move ? VIRTUAL_MOVES[move] : undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={definition ? `${label.toUpperCase()}: ${definition.move}` : label.toUpperCase()}
          className={cn(
            'relative flex h-(--key-h) w-(--key-w) cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border transition-colors',
            'focus-visible:ring-ring/50 outline-none focus-visible:ring-2',
            definition
              ? 'border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20'
              : 'border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60',
            isPressed && 'ring-primary/60 ring-2'
          )}
        >
          <span className="text-[length:min(0.625rem,2.2cqw)] leading-none uppercase opacity-60">{label}</span>
          <span className="text-[length:min(0.875rem,3.1cqw)] leading-none font-semibold">
            {definition ? definition.move : '·'}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-60">
        {VIRTUAL_MOVE_GROUPS.map((group, groupIndex) => (
          <Fragment key={group.id}>
            {groupIndex > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
            <div className="grid grid-cols-4 gap-1">
              {group.moves.map((option) => (
                <DropdownMenuItem
                  key={option.move}
                  highlight="rounded"
                  onSelect={() => onSelect(code, option.move)}
                  className={cn(
                    'justify-center px-1 py-1.5 text-xs font-medium',
                    move === option.move && 'bg-primary/15 text-foreground'
                  )}
                >
                  {option.move}
                </DropdownMenuItem>
              ))}
            </div>
          </Fragment>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          highlight="rounded"
          disabled={!move}
          onSelect={() => onSelect(code, null)}
        >
          Clear key
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default memo(VirtualKeymapKey)
