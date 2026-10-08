import { useSession } from '@/shared/model/useSession'
import { useRouter } from '@/shared/config/i18n/navigation'
import { Controller, useForm } from 'react-hook-form'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Globe2, Lock } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useTranslations } from 'next-intl'
import { createRoomSchema, ROOM_NAME_MAX_LENGTH } from '@nexustimer/contracts'
import { nextRid, requestRoom } from '@/features/free-play-room/model/room-requests'
import { useState } from 'react'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { toast } from 'sonner'

export default function CreateRoomModal() {
  const t = useTranslations('Multiplayer.create-room')
  const tMultiplayer = useTranslations('Multiplayer')
  const { data: session } = useSession()
  const router = useRouter()
  const close = useOverlayStore((store) => store.close)
  const [isPrivate, setIsPrivate] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    register
  } = useForm({
    defaultValues: {
      name: '',
      event: '3x3',
      maxRoundTime: '60'
    }
  })

  const submitForm = async (data: { name: string; event: string; maxRoundTime: string }) => {
    if (!session?.user?.id) {
      toast.error(tMultiplayer('account-required-description'))
      return
    }

    const input = createRoomSchema.safeParse({
      name: data.name,
      event: data.event,
      maxRoundTime: Number(data.maxRoundTime),
      private: isPrivate
    })
    if (!input.success) {
      toast.error(t('error'))
      return
    }

    try {
      const reply = await requestRoom({ type: 'room:create', rid: nextRid(), ...input.data })
      if (reply.type !== 'room:created') {
        toast.error(t('error'))
        return
      }
      close()
      router.push(`/free-play/${reply.roomId}`)
    } catch {
      toast.error(t('error'))
    }
  }

  return (
    <DialogContent className="sm:max-w-xl max-h-[90dvh] flex flex-col">
      <DialogHeader className="shrink-0">
        <DialogTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
          {isPrivate ? (
            <Lock className="size-4 text-muted-foreground" />
          ) : (
            <Globe2 className="size-4 text-muted-foreground" />
          )}
          {isPrivate ? t('title-private') : t('title')}
        </DialogTitle>
        <DialogDescription>{t('description')}</DialogDescription>
      </DialogHeader>

      <div className="overflow-y-auto flex-1 min-h-0">
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="room-name" className="text-sm font-medium">
              {t('room-name')}
            </Label>
            <Input
              autoComplete={'off'}
              {...register('name', { required: t('room-name-required') })}
              id="room-name"
              maxLength={ROOM_NAME_MAX_LENGTH}
              placeholder={t('room-name-placeholder')}
              enterKeyHint="done"
              aria-invalid={!!errors.name}
              className="h-11"
            />
            {errors.name && (
              <p className="text-[13px] font-medium text-destructive sm:text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="room-event" className="text-sm font-medium">
                {t('event')}
              </Label>
              <Controller
                name={'event'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger id="room-event" className="h-11 w-full">
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
                      <SelectItem value="FTO">FTO</SelectItem>
                      <SelectItem value="SQ1">Square-1</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="room-max-time" className="text-sm font-medium">
                {t('max-round-time')}
              </Label>
              <Controller
                name={'maxRoundTime'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger id="room-max-time" className="h-11 w-full">
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
              <p className="text-[13px] leading-snug text-muted-foreground sm:text-xs">
                {t('max-round-time-description')}
              </p>
            </div>
          </div>

          {/* Private room toggle */}
          <label
            htmlFor="room-private"
            className="panel-notch-bl-tr flex cursor-pointer select-none items-center justify-between gap-4 p-4 [-webkit-tap-highlight-color:transparent]"
          >
            <span className="flex items-center gap-3">
              <Lock className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] leading-snug sm:text-sm">{t('private')}</span>
                <span className="text-[13px] leading-snug text-muted-foreground sm:text-xs">
                  {t('private-description')}
                </span>
              </span>
            </span>
            <Switch id="room-private" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </label>
        </div>

        <DialogFooter className="mt-6 shrink-0">
          <Button
            className="w-full pointer-coarse:h-11 md:w-auto"
            onClick={handleSubmit(submitForm)}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('creating') : t('continue')}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  )
}
