'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

const DOWNLOAD_URL = 'https://c707vqzanp.ufs.sh/f/7SKMBzVlOB2HwGJzdKMHr2JoUKbvhputIcT4jNE5ldLg96OB'

export default function HowToConnectNexus() {
  const t = useTranslations('Index')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground sm:h-9"
        >
          <HelpCircle className="size-3.5" />
          {t('HomePage.nx-how-to')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('HomePage.nx-how-to')}</DialogTitle>
          <DialogDescription>{t('HomePage.nx-how-to-desc')}</DialogDescription>
        </DialogHeader>

        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground">
          <li className="wrap-break-word">{t('HomePage.nx-step-1')}</li>
          <li className="wrap-break-word">{t('HomePage.nx-step-2')}</li>
          <li className="wrap-break-word">{t('HomePage.nx-step-3')}</li>
        </ol>

        <Image src="/nexus_connect.png" alt="Nexus Connect App" width={200} height={60} className="w-full rounded-md" />

        <Link href={DOWNLOAD_URL} target="_blank" rel="noreferrer noopener" className="mx-auto">
          <Image
            src="/utils/android-apk.webp"
            alt="Download Nexus Connect App"
            width={200}
            height={60}
            className="mx-auto"
            unoptimized
          />
        </Link>
      </DialogContent>
    </Dialog>
  )
}
