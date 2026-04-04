import { useState, useRef, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface JoinPrivateRoomModalProps {
  room: {
    roomId: string
    name: string
  }
  onClose: () => void
}

export default function JoinPrivateRoomModal({ room, onClose }: JoinPrivateRoomModalProps) {
  const t = useTranslations('Multiplayer.join-private-room')
  const router = useRouter()
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
        <DialogDescription>
          <span className="font-medium text-foreground">{room.name}</span>
          {' — '}
          {t('description')}
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
            className={`h-12 font-mono text-lg text-center tracking-[0.3em] uppercase border-muted-foreground/20 focus-visible:ring-primary/30 ${error ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
            maxLength={6}
          />
          {error && <p className="text-xs text-destructive text-center">{t('wrong-code')}</p>}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isJoining}>
            {t('cancel')}
          </Button>
          <Button className="flex-1" onClick={handleJoin} disabled={code.length !== 6 || isJoining}>
            {isJoining ? t('joining') : t('join')}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
