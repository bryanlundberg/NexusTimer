import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import DialogNavbarItem from './dialog-navbar-item'
import GoogleButton from '@/features/authentication/ui/GoogleButton'
import Logo from '@/shared/ui/logo/logo'

type Navigation = NavItem[]

interface NavItem {
  path: string
  name: string
}

export default function DialogNavbar() {
  const t = useTranslations('Index')
  const navigation: Navigation = [
    {
      path: '/',
      name: t('HomePage.title')
    },
    {
      path: '/solves',

      name: t('SolvesPage.title')
    },
    {
      path: '/stats',
      name: t('StatsPage.title')
    },
    {
      path: '/cubes',
      name: t('CubesPage.title')
    },
    {
      path: '/clash',
      name: 'Clash Mode'
    }
  ]
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Logo />
          </DialogTitle>
          <DialogDescription>
            Explore your solves, track progress, and improve your speedcubing skills with quick access to stats, timers,
            and tutorials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {navigation.map((item) => {
              return <DialogNavbarItem href={item.path} label={item.name} key={item.path} />
            })}
          </div>

          <DialogNavbarItem href={'/settings'} label={t('SettingsPage.title')} key={'item.settings'} />

          <GoogleButton />
        </div>
      </DialogContent>
    </>
  )
}
