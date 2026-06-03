'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Check, Copy, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

const CHROME_FLAG = 'chrome://flags/#enable-experimental-web-platform-features'
const CHROME_BT_INTERNALS = 'chrome://bluetooth-internals/#devices'

export function HowToConnectDialog() {
  const t = useTranslations('Index.HomePage')
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(value)
      toast.success(t('htc-copied'))
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* ignore */
    }
  }

  const renderUrl = (url: string) => (
    <div className="mt-1.5 flex items-start gap-2">
      <code className="min-w-0 flex-1 rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground break-all">
        {url}
      </code>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => handleCopy(url)}
        aria-label={t('htc-copy')}
        className="size-7 shrink-0"
      >
        {copied === url ? <Check className="size-3" /> : <Copy className="size-3" />}
      </Button>
    </div>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1 text-xs text-muted-foreground hover:text-foreground sm:h-9"
        >
          <HelpCircle className="size-3.5" />
          {t('how-to-connect')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('how-to-connect-title')}</DialogTitle>
          <DialogDescription>{t('how-to-connect-desc')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 text-sm">
          <section className="flex flex-col gap-2">
            <h3 className="font-medium break-words">{t('htc-chrome-title')}</h3>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-muted-foreground">
              <li className="break-words">
                <span>{t('htc-chrome-step-1')}</span>
                {renderUrl(CHROME_FLAG)}
              </li>
              <li className="break-words">{t('htc-chrome-step-2')}</li>
            </ol>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="font-medium break-words">{t('htc-mac-title')}</h3>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-muted-foreground">
              <li className="break-words">{t('htc-mac-step-1')}</li>
              <li className="break-words">
                <span>{t('htc-mac-step-2')}</span>
                {renderUrl(CHROME_BT_INTERNALS)}
              </li>
            </ol>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
