import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { LogIn } from 'lucide-react'
import { Link } from '@/shared/config/i18n/navigation'
import ConnectedUsersIcon from '@/features/free-play/ui/connected-users-icon'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

export default function SignInToPlay() {
  const t = useTranslations('Multiplayer')
  const tAuth = useTranslations('Index.Auth')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="flex h-full flex-col items-center justify-center py-16 px-6 notch-br border border-dashed border-muted-foreground/20"
    >
      <ConnectedUsersIcon className="size-10 text-muted-foreground/30 mb-4" />
      <h3 className="text-base font-semibold mb-1">{t('account-required')}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-5">{t('account-required-description')}</p>
      <Link href="/sign-in" className={cn(buttonVariants({ variant: 'outline' }), 'pointer-coarse:h-11')}>
        <LogIn />
        {tAuth('sign-in')}
      </Link>
    </motion.div>
  )
}
