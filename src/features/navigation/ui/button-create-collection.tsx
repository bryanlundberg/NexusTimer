import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'

export default function ButtonCreateCollection() {
  const t = useTranslations('Index')
  const { handleCreate } = useCubeActions(undefined)

  return (
    <Button variant={'secondary'} className="p-2" data-testid="create-collection-button" onClick={handleCreate}>
      <PlusIcon className="size-4" strokeWidth={5} />{' '}
      <span className="hidden sm:inline">{t('CubesPage.new-collection')}</span>
    </Button>
  )
}
