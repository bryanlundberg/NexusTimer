import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Globe2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ref, serverTimestamp, set } from '@firebase/database'
import { rtdb } from '@/shared/config/firebase'
import genScramble from '@/shared/lib/timer/genScramble'
import { RoomStatus } from '@/entities/free-play-mode/model/enums'
import { useTranslations } from 'next-intl'

export default function CreateRoomModal() {
  const t = useTranslations('Multiplayer.create-room')
  const { data: session } = useSession()
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    register
  } = useForm({
    defaultValues: {
      name: '',
      event: '3x3',
      maxRoundTime: '60',
      status: RoomStatus.IDLE
    }
  })

  const submitForm = async (data: any) => {
    const roomId = Math.floor(Math.random() * 1000000).toString()
    await set(ref(rtdb, 'rooms/' + roomId), {
      roomId,
      status: RoomStatus.IN_PROGRESS,
      createdAt: serverTimestamp(),
      maxRoundTime: parseInt(data.maxRoundTime, 10),
      createdBy: session?.user?.id || '',
      authority: session?.user?.id || '',
      scramble: genScramble(data.event),
      currentRoundTimeLimit: Number(data.maxRoundTime) * 1000 + Date.now(),
      name: data.name,
      event: data.event
    })

    router.push(`/free-play/${roomId}`)
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>
          <span className="inline-flex items-center gap-2">
            <Globe2 className="size-4" /> {t('title')}
          </span>
        </DialogTitle>
        <DialogDescription>{t('description')}</DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <div className="grid gap-2">
          <Label htmlFor="room-name" className="text-sm font-medium">
            {t('room-name')}
          </Label>
          <Input
            autoComplete={'off'}
            {...register('name', { required: t('room-name-required') })}
            id="room-name"
            placeholder={t('room-name-placeholder')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="room-event" className="text-sm font-medium">
            {t('event')}
          </Label>
          <Controller
            name={'event'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2x2">2x2</SelectItem>
                  <SelectItem value="3x3">3x3</SelectItem>
                  <SelectItem value="4x4">4x4</SelectItem>
                  <SelectItem value="5x5">5x5</SelectItem>
                  <SelectItem value="6x6">6x6</SelectItem>
                  <SelectItem value="7x7">7x7</SelectItem>
                  <SelectItem value="3x3 OH">3x3 OH</SelectItem>
                  <SelectItem value="Clock">Clock</SelectItem>
                  <SelectItem value="Megaminx">Megaminx</SelectItem>
                  <SelectItem value="Pyraminx">Pyraminx</SelectItem>
                  <SelectItem value="Skewb">Skewb</SelectItem>
                  <SelectItem value="square1">Square-1</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="insp" className="text-sm font-medium">
            {t('max-round-time')}
          </Label>
          <Controller
            name={'maxRoundTime'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">1:00 min</SelectItem>
                  <SelectItem value="70">1:10 min</SelectItem>
                  <SelectItem value="80">1:20 min</SelectItem>
                  <SelectItem value="90">1:30 min</SelectItem>
                  <SelectItem value="100">1:40 min</SelectItem>
                  <SelectItem value="110">1:50 min</SelectItem>
                  <SelectItem value="120">2:00 min</SelectItem>
                  <SelectItem value="150">2:30 min</SelectItem>
                  <SelectItem value="180">3:00 min</SelectItem>
                  <SelectItem value="210">3:30 min</SelectItem>
                  <SelectItem value="240">4:00 min</SelectItem>
                  <SelectItem value="270">4:30 min</SelectItem>
                  <SelectItem value="300">5:00 min</SelectItem>
                  <SelectItem value="330">5:30 min</SelectItem>
                  <SelectItem value="360">6:00 min</SelectItem>
                  <SelectItem value="390">6:30 min</SelectItem>
                  <SelectItem value="420">7:00 min</SelectItem>
                  <SelectItem value="450">7:30 min</SelectItem>
                  <SelectItem value="480">8:00 min</SelectItem>
                  <SelectItem value="510">8:30 min</SelectItem>
                  <SelectItem value="540">9:00 min</SelectItem>
                  <SelectItem value="570">9:30 min</SelectItem>
                  <SelectItem value="600">10:00 min</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <p className="text-xs text-muted-foreground">{t('max-round-time-description')}</p>
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button onClick={handleSubmit(submitForm)} disabled={isSubmitting}>
          {t('continue')}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
