import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FileTextIcon, PlusIcon } from '@radix-ui/react-icons'
import { DatabaseBackupIcon } from 'lucide-react'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import CreateCollectionForm from '@/features/manage-cubes/ui/CreateCollectionForm'

interface EmptyCubesProps extends React.HTMLAttributes<HTMLDivElement> {
  onCreate?: () => void
  hideTitle?: boolean
  hideDescription?: boolean
}

export default function EmptyCubes({ onCreate, hideDescription = false, hideTitle = false, ...rest }: EmptyCubesProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const t = useTranslations('Index.CubesPage')
  const open = useOverlayStore((state) => state.open)
  const close = useOverlayStore((state) => state.close)

  const handleClickOnCreate = () => {
    if (onCreate) return onCreate()
    open({
      id: 'create-cube',
      component: <CreateCollectionForm />
    })
  }

  const handleClickOnImportOtherTimers = () => {
    router.push('/options#app-data')
    close()
  }

  const handleClickOnRestoreAccountData = () => {
    router.push('/account')
    close()
  }

  return (
    <>
      <div
        {...rest}
        data-testid="empty-cubes-container"
        className="flex flex-col items-center justify-center h-full overflow-auto rounded-lg grow min-h-[400px] mx-auto w-full"
      >
        <div className="flex flex-col items-center justify-center gap-4 p-6 max-w-md mx-auto">
          <div className="relative w-64 h-64 mb-4">
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-full"
            ></motion.div>
            <motion.div
              className="absolute inset-4 bg-primary/20 rounded-full"
            ></motion.div>
            <motion.div
              className="absolute inset-0"
            >
              <Image
                src={'/utils/iron-cube.png'}
                alt={'no-cubes-for-display'}
                width={200}
                height={200}
                draggable={false}
                className="object-contain w-full h-full"
                unoptimized
              />
            </motion.div>
          </div>

          {!hideDescription && (
            <p className="text-muted-foreground text-center text-balance text-lg">{t('no-cubes-description')}</p>
          )}

          <div className={'flex flex-col gap-3'}>
            <Button
              className={'w-full'}
              size="lg"
              onClick={handleClickOnCreate}
              data-testid="empty-cubes-create-button"
            >
              <PlusIcon className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
              {t('new-collection')}
            </Button>
            {session?.user && (
              <Button
                variant={'secondary'}
                onClick={handleClickOnRestoreAccountData}
                data-testid="empty-cubes-restore-account-button"
              >
                <DatabaseBackupIcon /> Restore Account Data
              </Button>
            )}
            <Button
              variant={'ghost'}
              onClick={handleClickOnImportOtherTimers}
              data-testid="empty-cubes-import-other-timers-button"
            >
              <FileTextIcon /> Import from Other Timers
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
