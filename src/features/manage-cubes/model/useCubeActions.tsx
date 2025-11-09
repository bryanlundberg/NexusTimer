import { useRouter } from 'next/navigation'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Cube } from '@/entities/cube/model/types'
import DeleteCollectionForm from '@/features/manage-cubes/ui/DeleteCollectionForm'
import EditCollectionForm from '@/features/manage-cubes/ui/EditCollectionForm'
import { editCubeCollection } from '@/features/manage-cubes/api/editCubeCollection'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { useTimerStore } from '@/store/timerStore'
import { toast } from 'sonner'
import CreateCollectionForm from '@/features/manage-cubes/ui/CreateCollectionForm'

export const useCubeActions = (cube?: Cube) => {
  const router = useRouter()
  const { open } = useOverlayStore()
  const setCubes = useTimerStore((state) => state.setCubes)

  const handleRedirect = () => {
    router.push('/app')
  }

  const handleEdit = () => {
    open({
      id: 'edit-cube',
      component: <EditCollectionForm />,
      metadata: cube
    })
  }

  const handleDelete = () => {
    open({
      id: 'delete-cube',
      component: <DeleteCollectionForm />,
      metadata: cube
    })
  }

  const handleCreate = () => {
    open({
      id: 'create-cube',
      component: <CreateCollectionForm />,
      metadata: cube
    })
  }

  const handleFavorite = async () => {
    await editCubeCollection({ favorite: !cube?.favorite, id: cube!.id })
    const cubes = await cubesDB.getAll()
    setCubes(cubes)
    toast.success('Cube favorite status updated', { duration: 1000 })
  }

  return {
    handleRedirect,
    handleEdit,
    handleDelete,
    handleFavorite,
    handleCreate
  }
}
