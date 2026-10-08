import { useState, KeyboardEvent } from 'react'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROOM_CODE_LENGTH } from '@nexustimer/contracts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RoomCodeGateProps {
  error: string | null
  submitting: boolean
  onSubmit: (code: string) => void
  onCancel: () => void
}

export default function RoomCodeGate({ error, submitting, onSubmit, onCancel }: RoomCodeGateProps) {
  const t = useTranslations('Multiplayer')
  const [code, setCode] = useState('')

  const submit = () => {
    if (code.length !== ROOM_CODE_LENGTH || submitting) return
    onSubmit(code)
    setCode('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className="flex flex-col items-center justify-center h-dvh gap-6 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="icon-notch size-12 flex items-center justify-center mb-2">
          <Lock className="size-5 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">{t('join-private-room.title')}</h2>
        <p className="text-sm text-muted-foreground max-w-xs">{t('join-private-room.description')}</p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Input
          autoFocus
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .slice(0, ROOM_CODE_LENGTH)
            )
          }
          onKeyDown={handleKeyDown}
          placeholder={t('join-private-room.placeholder')}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          enterKeyHint="go"
          aria-label={t('join-private-room.title')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'room-code-error' : undefined}
          className="h-12 text-center font-mono text-lg tracking-[0.3em] uppercase"
          maxLength={ROOM_CODE_LENGTH}
        />
        {error && (
          <p
            id="room-code-error"
            role="alert"
            className="text-center text-[13px] font-medium text-destructive sm:text-xs"
          >
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 pointer-coarse:h-11" onClick={onCancel} disabled={submitting}>
            {t('join-private-room.cancel')}
          </Button>
          <Button
            className="flex-1 pointer-coarse:h-11"
            onClick={submit}
            disabled={code.length !== ROOM_CODE_LENGTH || submitting}
          >
            {submitting ? t('join-private-room.joining') : t('join-private-room.join')}
          </Button>
        </div>
      </div>
    </div>
  )
}
