import { useState, useRef, KeyboardEvent } from 'react'
import { useRouter } from '@/shared/config/i18n/navigation'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'

interface JoinPrivateRoomModalProps {
  room: {
    roomId: string
    name: string
  }
}

export default function JoinPrivateRoomModal({ room }: JoinPrivateRoomModalProps) {
  const t = useTranslations('Multiplayer.join-private-room')
  const router = useRouter()
  const close = useOverlayStore((store) => store.close)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleJoin = async () => {
    if (code.length !== 6 || isJoining) return
    setIsJoining(true)

    const res = await fetch('/api/v1/rooms/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: room.roomId, password: code })
    })
    const data = await res.json()

    if (data.success) {
      close()
      router.push(`/free-play/${room.roomId}`)
    } else {
      setError(true)
      setCode('')
      setIsJoining(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleJoin()
  }

  const handleCodeChange = (value: string) => {
    setCode(
      value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6)
    )
    if (error) setError(false)
  }

  return (
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Lock className="size-4 text-muted-foreground" />
          {t('title')}
        </DialogTitle>
        <DialogDescription className="flex flex-col gap-1">
          <span className="font-medium text-foreground">{room.name}</span>
          <span>{t('description')}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Input
            ref={inputRef}
            autoFocus
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('placeholder')}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            enterKeyHint="go"
            aria-label={t('title')}
            aria-invalid={error}
            aria-describedby={error ? 'room-code-error' : undefined}
            className="h-12 text-center font-mono text-lg tracking-[0.3em] uppercase"
            maxLength={6}
          />
          {error && (
            <p
              id="room-code-error"
              role="alert"
              className="text-center text-[13px] font-medium text-destructive sm:text-xs"
            >
              {t('wrong-code')}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 pointer-coarse:h-11" onClick={close} disabled={isJoining}>
            {t('cancel')}
          </Button>
          <Button className="flex-1 pointer-coarse:h-11" onClick={handleJoin} disabled={code.length !== 6 || isJoining}>
            {isJoining ? t('joining') : t('join')}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
