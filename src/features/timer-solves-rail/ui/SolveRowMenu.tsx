'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CopyIcon } from '@radix-ui/react-icons'
import { Maximize2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { QaDeleteIcon } from '@/components/ui/quick-action-icons'
import useQuickActions from '@/features/manage-solves/model/useQuickActions'
import { Solve } from '@/entities/solve/model/types'

interface SolveRowMenuProps {
  solve: Solve
  x: number
  y: number
  onClose: () => void
  onOpenDetails: (solve: Solve) => void
}

export default function SolveRowMenu({ solve, x, y, onClose, onOpenDetails }: SolveRowMenuProps) {
  const t = useTranslations('Index')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const { handleTogglePlus2, handleToggleDNF, handleToggleBookmark, handleClipboard, handleDeleteSolve } =
    useQuickActions(solve)

  return (
    <DropdownMenu open modal={false} onOpenChange={(open) => !open && onClose()}>
      <DropdownMenuTrigger asChild>
        <span aria-hidden className="pointer-events-none fixed size-0" style={{ left: x, top: y }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" sideOffset={2} data-testid="solve-row-menu">
        <DropdownMenuItem onSelect={() => onOpenDetails(solve)}>
          <Maximize2 /> {t('SolvesRail.open-details')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={!!solve.plus2} onSelect={handleTogglePlus2}>
          {t('tooltips.plus-two')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={!!solve.dnf} onSelect={handleToggleDNF}>
          {t('tooltips.dnf')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={!!solve.bookmark} onSelect={handleToggleBookmark}>
          {t('tooltips.bookmark')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleClipboard()}>
          <CopyIcon /> {t('tooltips.copy')}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          data-testid="solve-row-menu-delete"
          onSelect={(event) => {
            if (!confirmingDelete) {
              event.preventDefault()
              setConfirmingDelete(true)
              return
            }
            handleDeleteSolve()
          }}
        >
          <QaDeleteIcon /> {confirmingDelete ? t('SolvesRail.confirm-delete') : t('tooltips.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
