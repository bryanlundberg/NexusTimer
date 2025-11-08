import { useRouter } from 'next/navigation'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { Cube } from '@/entities/cube/model/types'
import DeleteCollectionForm from '@/features/manage-cubes/ui/DeleteCollectionForm'
import EditCollectionForm from '@/features/manage-cubes/ui/EditCollectionForm'

export const useCubeActions = (cube?: Cube) => {
  const router = useRouter()
  const { open } = useOverlayStore()

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

  return {
    handleRedirect,
    handleEdit,
    handleDelete
  }
}
