import loader from '@/utils/loader'
import uploadFile from '@/utils/uploadFile'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

export function useUpdateUserAvatar() {
  const { data: session, update } = useSession()

  const updateAvatar = async (file?: File) => {
    if (!file || !session?.user?.id) return
    try {
      loader.start()
      const urlImage = await uploadFile(file, `/avatars`, session.user.id)
      const res = await fetch(`/api/v1/users/${session.user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ image: urlImage.url })
      })
      if (!res.ok) throw new Error('PATCH /users failed')
      const updatedUser = await res.json()
      toast.success('User image updated successfully')
      await update({ user: { image: updatedUser.image } })
    } catch (e) {
      toast.error('Error updating user image')
    } finally {
      loader.stop()
    }
  }

  return { updateAvatar }
}
