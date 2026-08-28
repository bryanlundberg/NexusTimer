import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUpdateUserAvatar } from '../model/useUpdateUserAvatar'
import { AvatarCropDialog } from './AvatarCropDialog'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function AvatarUploader() {
  const { data: session } = useSession()
  const { updateAvatar, isUploading } = useUpdateUserAvatar()
  const tAccount = useTranslations('Index.AccountPage')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!imageSrc) return
    return () => URL.revokeObjectURL(imageSrc)
  }, [imageSrc])

  const handleClick = () => {
    if (isUploading) return
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error(tAccount('crop-invalid-file'))
      return
    }
    setImageSrc(URL.createObjectURL(file))
  }

  const handleCropCancel = () => {
    setImageSrc(null)
  }

  const handleCropConfirm = (file: File) => {
    handleCropCancel()
    updateAvatar(file)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        aria-busy={isUploading}
        className="relative group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
      >
        <Avatar className="size-24 sm:size-28 ring-2 ring-border ring-offset-2 ring-offset-background transition-all group-hover:ring-primary/40">
          <AvatarImage className="object-cover" src={session?.user?.image as string} />
          <AvatarFallback className="text-2xl font-bold bg-muted">
            {session?.user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-full transition-all ${
            isUploading ? 'bg-black/50' : 'bg-black/0 group-hover:bg-black/40'
          }`}
        >
          {isUploading ? (
            <Loader2 className="size-6 text-white animate-spin" />
          ) : (
            <Camera className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </button>

      <Input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={handleFileChange}
      />

      <AvatarCropDialog
        open={imageSrc !== null}
        imageSrc={imageSrc}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />
    </div>
  )
}
