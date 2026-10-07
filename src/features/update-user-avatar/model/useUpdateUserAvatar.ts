import { toast } from 'sonner'
import { useSession } from '@/shared/model/useSession'
import { useState } from 'react'
import loader from '@/shared/lib/loader'
import uploadFile from '@/shared/lib/uploadFile'

export function useUpdateUserAvatar() {
  const { data: session, update } = useSession()
  const [isUploading, setIsUploading] = useState(false)

  const updateAvatar = async (file?: File) => {
    if (!file || !session?.user?.id) return
    try {
      setIsUploading(true)
      loader.start()
      await uploadFile(file, `/avatars`, session.user.id)
      toast.success('User image updated successfully')
      await update()
    } catch (e) {
      toast.error('Error updating user image')
    } finally {
      loader.stop()
      setIsUploading(false)
    }
  }

  return { updateAvatar, isUploading }
}
