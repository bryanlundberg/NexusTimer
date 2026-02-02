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
    <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl">
      <div className="h-2 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      <div className="p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            <span className="inline-flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe2 className="size-5 text-primary" />
              </div>
              {t('title')}
            </span>
          </DialogTitle>
          <DialogDescription className="text-base">{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="room-name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
              {t('room-name')}
            </Label>
            <Input
              autoComplete={'off'}
              {...register('name', { required: t('room-name-required') })}
              id="room-name"
              placeholder={t('room-name-placeholder')}
              className="h-12 border-muted-foreground/20 focus-visible:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="room-event"
                className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                {t('event')}
              </Label>
              <Controller
                name={'event'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="h-12 border-muted-foreground/20 w-full">
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
              <Label htmlFor="insp" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
                {t('max-round-time')}
              </Label>
              <Controller
                name={'maxRoundTime'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className={'h-12 border-muted-foreground/20 w-full'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1:00 min</SelectItem>
                      <SelectItem value="120">2:00 min</SelectItem>
                      <SelectItem value="180">3:00 min</SelectItem>
                      <SelectItem value="300">5:00 min</SelectItem>
                      <SelectItem value="600">10:00 min</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed">
            💡 {t('max-round-time-description')}
          </p>
        </div>

        <DialogFooter className="mt-8">
          <Button
            size="lg"
            className="w-full md:w-auto font-bold px-8 rounded-full"
            onClick={handleSubmit(submitForm)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : t('continue')}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  )
}
