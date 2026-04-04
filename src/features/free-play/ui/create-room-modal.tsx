import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Globe2, Lock, Copy, Check } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ref, serverTimestamp, set } from '@firebase/database'
import { rtdb } from '@/shared/config/firebase'
import genScramble from '@/shared/lib/timer/genScramble'
import { RoomStatus } from '@/entities/free-play-mode/model/enums'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateRoomCode() {
  const length = 6
  const randomBytes = new Uint8Array(length)
  crypto.getRandomValues(randomBytes)
  return Array.from(randomBytes, (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join('')
}

async function hashRoomCode(text: string): Promise<string> {
  const res = await fetch('/api/v1/rooms/hash-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: text })
  })
  const { hash } = await res.json()
  return hash
}

export default function CreateRoomModal() {
  const t = useTranslations('Multiplayer.create-room')
  const { data: session } = useSession()
  const router = useRouter()
  const [isPrivate, setIsPrivate] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [codeCopied, setCodeCopied] = useState(false)

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

  const handlePrivateToggle = (checked: boolean) => {
    setIsPrivate(checked)
    if (checked && !roomCode) {
      setRoomCode(generateRoomCode())
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

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
      currentRound: 1,
      name: data.name,
      event: data.event,
      ...(isPrivate && { passwordHash: await hashRoomCode(roomCode) })
    })

    router.push(`/free-play/${roomId}`)
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

          {/* Private room toggle */}
          <div className="flex items-center justify-between rounded-lg border border-muted-foreground/20 p-4">
            <div className="flex items-center gap-3">
              <Lock className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('private')}</p>
                <p className="text-xs text-muted-foreground">{t('private-description')}</p>
              </div>
            </div>
            <Switch checked={isPrivate} onCheckedChange={handlePrivateToggle} />
          </div>

          {/* Room code display */}
          {isPrivate && (
            <div className="grid gap-2">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
                {t('room-code')}
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center h-12 px-4 rounded-md border border-muted-foreground/20 bg-muted/40">
                  <span className="font-mono text-lg font-semibold tracking-[0.3em]">{roomCode}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-12 shrink-0"
                  onClick={handleCopyCode}
                >
                  {codeCopied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{t('room-code-hint')}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed">
            💡 {t('max-round-time-description')}
          </p>
        </div>

        <DialogFooter className="mt-6 shrink-0">
          <Button className="w-full md:w-auto" onClick={handleSubmit(submitForm)} disabled={isSubmitting}>
            {isSubmitting ? t('creating') : t('continue')}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  )
}
