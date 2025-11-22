import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUpdateUserAvatar } from '../model/useUpdateUserAvatar'
import { useSession } from 'next-auth/react'

export function AvatarUploader() {
  const { data: session } = useSession()
  const { updateAvatar } = useUpdateUserAvatar()

  return (
    <Avatar className="size-20 relative group/item">
      <AvatarImage className="object-cover" src={session?.user?.image as string} />
      <AvatarFallback>{session?.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      <input
        type="file"
        accept="image/*"
        className="absolute z-10 inset-0 w-full h-full bg-neutral-900 hidden group-hover/item:flex justify-center items-center cursor-pointer hover:opacity-50 text-xs"
        onChange={(e) => updateAvatar(e.target.files?.[0])}
      />
    </Avatar>
  )
}
