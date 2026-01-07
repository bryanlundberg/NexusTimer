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
import { cn } from '@/shared/lib/utils'

interface EmptyCubesProps extends React.HTMLAttributes<HTMLDivElement> {
  onCreate?: () => void
  hideTitle?: boolean
  hideDescription?: boolean
  className?: string
}

export default function EmptyCubes({
  onCreate,
  hideDescription = false,
  hideTitle = false,
  className,
  ...rest
}: EmptyCubesProps) {
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

  const CardActionButton = ({
    onClick,
    icon,
    title,
    description,
    variant,
    'data-testid': dataTestId
  }: {
    onClick: () => void
    icon: React.ReactNode
    title: string
    description: string
    variant: any
    'data-testid'?: string
  }) => (
    <Button className="w-full justify-start h-auto py-5" variant={variant} onClick={onClick} data-testid={dataTestId}>
      <div className="flex items-start gap-4 text-left w-full">
        <div className="shrink-0">{icon}</div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-medium leading-none mb-1 break-words whitespace-normal">{title}</span>
          <span className="text-sm text-muted-foreground leading-snug break-words whitespace-normal">
            {description}
          </span>
        </div>
      </div>
    </Button>
  )

  return (
    <>
      <div
        {...rest}
        data-testid="empty-cubes-container"
        className={cn('flex flex-col items-center justify-center h-full grow mx-auto w-full', className)}
      >
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
            <div className="absolute inset-4 bg-primary/20 rounded-full"></div>
            <div className="absolute inset-0">
              <Image
                src={'/utils/iron-cube.png'}
                alt={t('no-cubes-for-display')}
                width={200}
                height={200}
                draggable={false}
                className="object-contain w-full h-full"
                unoptimized
              />
            </div>
          </div>

          <div className={'flex flex-col gap-3 w-full'}>
            <CardActionButton
              icon={<PlusIcon />}
              variant={'ghost'}
              onClick={handleClickOnCreate}
              data-testid="empty-cubes-create-button"
              title={t('new-collection')}
              description={t('new-collection-description')}
            />
            {session?.user && (
              <CardActionButton
                icon={<DatabaseBackupIcon />}
                variant={'ghost'}
                onClick={handleClickOnRestoreAccountData}
                data-testid="empty-cubes-restore-account-button"
                title={t('restore-account-data')}
                description={t('restore-account-data-description')}
              />
            )}
            <CardActionButton
              icon={<FileTextIcon />}
              variant={'ghost'}
              onClick={handleClickOnImportOtherTimers}
              data-testid="empty-cubes-import-other-timers-button"
              title={t('import-from-other-timers')}
              description={t('import-from-other-timers-description')}
            />
          </div>
        </div>
      </div>
    </>
  )
}
