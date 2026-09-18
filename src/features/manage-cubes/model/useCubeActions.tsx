import { useRouter } from 'next/navigation'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Cube } from '@/entities/cube/model/types'
import DeleteCollectionForm from '@/features/manage-cubes/ui/DeleteCollectionForm'
import EditCollectionForm from '@/features/manage-cubes/ui/EditCollectionForm'
import { editCubeCollection } from '@/features/manage-cubes/api/editCubeCollection'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import CreateCollectionForm from '@/features/manage-cubes/ui/CreateCollectionForm'

export const useCubeActions = (cube?: Cube) => {
  const router = useRouter()
  const { open } = useOverlayStore()
  const patchCube = useTimerStore((state) => state.patchCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)

  const handleRedirect = () => {
    setSelectedCube(cube || null)
    setNewScramble(cube || null)
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
    const isFavoriting = !cube?.favorite

    patchCube(await editCubeCollection({ favorite: isFavoriting, id: cube!.id }))
  }

  return {
    handleRedirect,
    handleEdit,
    handleDelete,
    handleFavorite,
    handleCreate
  }
}
