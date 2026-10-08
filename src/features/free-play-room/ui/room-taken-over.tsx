import { MonitorSmartphone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

interface RoomTakenOverProps {
  movedToAnotherRoom: boolean
  onPlayHere: () => void
  onLeave: () => void
}

export default function RoomTakenOver({ movedToAnotherRoom, onPlayHere, onLeave }: RoomTakenOverProps) {
  const t = useTranslations('Multiplayer')

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="icon-notch mb-2 flex size-12 items-center justify-center">
          <MonitorSmartphone className="size-5 text-muted-foreground" />
        </div>
        <h2 className="max-w-xs text-lg font-semibold">{movedToAnotherRoom ? t('moved') : t('replaced')}</h2>
      </div>
      <div className="flex w-full max-w-xs gap-2">
        <Button variant="outline" className="flex-1 pointer-coarse:h-11" onClick={onLeave}>
          {t('back-to-lobby')}
        </Button>
        <Button className="flex-1 pointer-coarse:h-11" onClick={onPlayHere}>
          {t('play-here')}
        </Button>
      </div>
    </div>
  )
}
