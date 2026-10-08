import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function RoomCodeChip({ code }: { code: string }) {
  const t = useTranslations('Multiplayer.create-room')
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? t('code-copied') : t('copy-code')}
          className="flex h-7 shrink-0 items-center gap-1.5 px-2 font-mono text-xs font-semibold tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground pointer-coarse:h-10"
        >
          {code}
          {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {t('room-code-hint')}
      </TooltipContent>
    </Tooltip>
  )
}
