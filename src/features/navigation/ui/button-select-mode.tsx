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
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { MixIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { TimerMode } from '@/features/timer/model/enums'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import ConnectQR from '@/features/nexus-connect/ui/ConnectQR'
import { useNexusConnectStore } from '@/features/nexus-connect/model/useNexusConnectStore'
import genId from '@/shared/lib/genId'

export default function ButtonSelectMode() {
  const timerMode = useTimerStore((state) => state.timerMode)
  const setTimerMode = useTimerStore((state) => state.setTimerMode)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')
  const open = useOverlayStore((state) => state.open)
  const connectId = useNexusConnectStore((state) => state.nexusConnectId)
  const setConnectId = useNexusConnectStore((state) => state.setNexusConnectId)

  useEffect(() => {
    if (!selectedCube) return
    if (selectedCube.category !== '3x3' && selectedCube.category !== '2x2' && timerMode === TimerMode.VIRTUAL) {
      setTimerMode(TimerMode.NORMAL)
    }
  }, [selectedCube, setTimerMode, timerMode])

  const handleNexusConnectClick = async () => {
    const id = connectId || genId()
    if (!connectId) setConnectId(id)

    open({
      id: 'nexus-connect-info',
      component: <ConnectQR />,
      metadata: {}
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button data-testid={'button-select-mode'} variant="ghost" className="py-0 px-3" disabled={!selectedCube}>
            <MixIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuLabel>{t('HomePage.mode')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={timerMode} onValueChange={(e: any) => setTimerMode(e)}>
            <DropdownMenuRadioItem value={TimerMode.NORMAL} data-testid={'mode-normal'}>
              {t('HomePage.modes.normal')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.MANUAL} data-testid={'mode-manual'}>
              {t('HomePage.modes.manual')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.STACKMAT} data-testid={'mode-stackmat'}>
              {t('HomePage.modes.stackmat')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              data-testid={'mode-virtual'}
              value={TimerMode.VIRTUAL}
              disabled={selectedCube?.category !== '3x3' && selectedCube?.category !== '2x2'}
            >
              {t('HomePage.modes.virtual')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem data-testid={'mode-smart'} value={TimerMode.SMART_CUBE} disabled>
              {t('HomePage.modes.smart')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              data-testid={'mode-nexus-connect'}
              value={TimerMode.NEXUS_CONNECT}
              onClick={handleNexusConnectClick}
            >
              {t('HomePage.modes.nexus-connect')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
