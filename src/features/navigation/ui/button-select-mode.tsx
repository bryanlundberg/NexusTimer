'use client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useTimerStore } from '@/store/timerStore'
import { MixIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { TimerMode } from '@/features/timer/model/enums'

export default function ButtonSelectMode() {
  const timerMode = useTimerStore((state) => state.timerMode)
  const setTimerMode = useTimerStore((state) => state.setTimerMode)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')

  useEffect(() => {
    if (!selectedCube) return
    if (selectedCube.category !== '3x3' && selectedCube.category !== '2x2' && timerMode === TimerMode.VIRTUAL) {
      setTimerMode(TimerMode.NORMAL)
    }
  }, [selectedCube, setTimerMode, timerMode])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="py-0 px-3" disabled={!selectedCube}>
            <MixIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuLabel>{t('HomePage.mode')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={timerMode} onValueChange={(e: any) => setTimerMode(e)}>
            <DropdownMenuRadioItem value={TimerMode.NORMAL}>Normal</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.MANUAL}>Manual</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.STACKMAT}>Stackmat</DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value={TimerMode.VIRTUAL}
              disabled={selectedCube?.category !== '3x3' && selectedCube?.category !== '2x2'}
            >
              Virtual
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.SMART_CUBE} disabled>
              Smart cube
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
