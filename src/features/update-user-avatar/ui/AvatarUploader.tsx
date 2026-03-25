import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUpdateUserAvatar } from '../model/useUpdateUserAvatar'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { useRef } from 'react'
import { Camera } from 'lucide-react'

export function AvatarUploader() {
  const { data: session } = useSession()
  const { updateAvatar } = useUpdateUserAvatar()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => fileInputRef.current?.click()

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="relative group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Avatar className="size-24 sm:size-28 ring-2 ring-border ring-offset-2 ring-offset-background transition-all group-hover:ring-primary/40">
          <AvatarImage className="object-cover" src={session?.user?.image as string} />
          <AvatarFallback className="text-2xl font-bold bg-muted">
            {session?.user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-all">
          <Camera className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      <Input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(e) => updateAvatar(e.target.files?.[0])}
      />
    </div>
  )
}
