import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUpdateUserAvatar } from '../model/useUpdateUserAvatar'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { Image } from 'lucide-react'

export function AvatarUploader() {
  const { data: session } = useSession()
  const { updateAvatar } = useUpdateUserAvatar()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => fileInputRef.current?.click()

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-32 group/item">
        <AvatarImage className="object-cover size-32" src={session?.user?.image as string}/>
        <AvatarFallback>{session?.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className={'flex flex-col gap-1 text-sm text-muted-foreground'}>
        <Input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) => updateAvatar(e.target.files?.[0])}
        />
        <Button type="button" variant="secondary" onClick={handleClick} className={'w-fit'}>
          <Image /> Change picture
        </Button>
        JPG, GIF or PNG. Max size of 800K
      </div>
    </div>
  )
}
