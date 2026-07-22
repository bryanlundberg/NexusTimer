import { motion } from 'motion/react'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import LayoutDashboardIcon from '@/components/ui/layout-dashboard-icon'
import type { AnimatedIconHandle } from '@/components/ui/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { TimerMode } from '@/features/timer/model/enums'

interface ModeDropdownProps {
  value: TimerMode
  onChange: (mode: TimerMode) => void
}

export default function ModeDropdown({ value, onChange }: ModeDropdownProps) {
  const tIndex = useTranslations('Index')
  const iconRef = useRef<AnimatedIconHandle>(null)

  return (
    <motion.div
      className="absolute top-3 right-3 md:top-4 md:right-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            data-testid="button-select-mode"
            variant="ghost"
            className="group py-0 px-3"
            onMouseEnter={() => iconRef.current?.startAnimation()}
            onMouseLeave={() => iconRef.current?.stopAnimation()}
          >
            <LayoutDashboardIcon ref={iconRef} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuLabel>{tIndex('HomePage.mode')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as TimerMode)}>
            <DropdownMenuRadioItem value={TimerMode.NORMAL} data-testid="mode-normal">
              {tIndex('HomePage.modes.normal')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.MANUAL} data-testid="mode-manual">
              {tIndex('HomePage.modes.manual')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.STACKMAT} data-testid="mode-stackmat">
              {tIndex('HomePage.modes.stackmat')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
