import ButtonCreateCollection from '@/features/navigation/ui/button-create-collection'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'

export default function CubesPageHeader() {
  return (
    <div className="flex justify-between items-center gap-2 w-full mb-2">
      <MainCubeSelector />
      <ButtonCreateCollection />
    </div>
  )
}
