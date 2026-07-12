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
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Nexi, NexiGridBackdrop } from '@/shared/ui/nexi'

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
  const reduceMotion = useReducedMotion()

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
    router.push('/account/load')
    close()
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.07,
        delayChildren: reduceMotion ? 0 : 0.08
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  }

  const CardActionButton = ({
    onClick,
    icon,
    title,
    description,
    'data-testid': dataTestId
  }: {
    onClick: () => void
    icon: React.ReactNode
    title: string
    description: string
    'data-testid'?: string
  }) => (
    <motion.div variants={item}>
      <Button
        className={cn(
          'group/action w-full h-auto justify-start gap-4 px-4 py-3.5 text-left',
          'border border-border/70 bg-card/40 hover:bg-accent hover:border-primary/30'
        )}
        variant="ghost"
        onClick={onClick}
        data-testid={dataTestId}
      >
        <span
          className={cn(
            'grid place-items-center size-9 shrink-0 rounded-md',
            'bg-primary/10 text-primary transition-colors group-hover/action:bg-primary/15',
            '[&_svg]:size-4.5'
          )}
        >
          {icon}
        </span>
        <span className="flex flex-col min-w-0 flex-1">
          <span className="font-medium leading-tight wrap-break-word whitespace-normal">{title}</span>
          <span className="mt-0.5 text-xs text-muted-foreground leading-snug wrap-break-word whitespace-normal">
            {description}
          </span>
        </span>
      </Button>
    </motion.div>
  )

  return (
    <motion.div
      {...(rest as any)}
      data-testid="empty-cubes-container"
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        'flex flex-col items-center justify-center h-full grow mx-auto w-full max-w-sm px-2 text-center',
        className
      )}
    >
      <motion.div variants={item} className="relative grid place-items-center size-40 shrink-0" aria-hidden="true">
        <NexiGridBackdrop />
        <div className="absolute inset-8 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute inset-12 rounded-full bg-primary/15 blur-xl" />
        <Nexi state="loading" size={132} aria-label={t('no-cubes-for-display')} />
      </motion.div>

      {(!hideTitle || !hideDescription) && (
        <div className="mt-1 mb-6 flex flex-col gap-2">
          {!hideTitle && (
            <motion.h2 variants={item} className="text-lg font-semibold tracking-tight text-balance text-foreground">
              {t('empty-title')}
            </motion.h2>
          )}
          {!hideDescription && (
            <motion.p variants={item} className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {t('empty-description')}
            </motion.p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2.5 w-full">
        <CardActionButton
          icon={<PlusIcon />}
          onClick={handleClickOnCreate}
          data-testid="empty-cubes-create-button"
          title={t('new-collection')}
          description={t('new-collection-description')}
        />
        {session?.user && (
          <CardActionButton
            icon={<DatabaseBackupIcon />}
            onClick={handleClickOnRestoreAccountData}
            data-testid="empty-cubes-restore-account-button"
            title={t('restore-account-data')}
            description={t('restore-account-data-description')}
          />
        )}
        <CardActionButton
          icon={<FileTextIcon />}
          onClick={handleClickOnImportOtherTimers}
          data-testid="empty-cubes-import-other-timers-button"
          title={t('import-from-other-timers')}
          description={t('import-from-other-timers-description')}
        />
      </div>
    </motion.div>
  )
}
