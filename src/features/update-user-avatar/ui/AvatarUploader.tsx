import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUpdateUserAvatar } from '../model/useUpdateUserAvatar'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { Image } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function AvatarUploader() {
  const { data: session } = useSession()
  const { updateAvatar } = useUpdateUserAvatar()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const t = useTranslations('Index.AccountPage')

  const handleClick = () => fileInputRef.current?.click()

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="size-32 group/item ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
        <AvatarImage className="object-cover size-32" src={session?.user?.image as string} />
        <AvatarFallback className="text-2xl font-bold bg-primary/5">
          {session?.user?.name?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={'flex flex-col items-center gap-2 text-xs text-muted-foreground'}>
        <Input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) => updateAvatar(e.target.files?.[0])}
        />
        <Button type="button" variant="secondary" size="sm" onClick={handleClick} className={'w-fit gap-2'}>
          <Image className="size-3.5" /> {t('change-picture')}
        </Button>
        <p className="text-center">{t('avatar-requirements')}</p>
      </div>
    </div>
  )
}
