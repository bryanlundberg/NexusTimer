import {
  AlertsIcon,
  DataIcon,
  FeaturesIcon,
  PrivacyIcon,
  RegionIcon,
  SoundsIcon,
  ThemeIcon,
  TimerIcon
} from '@/components/ui/settings-icons'

export const SETTINGS_SECTIONS = [
  { id: 'region', color: 'var(--cube-red)', icon: RegionIcon, titleKey: 'Settings-menu.locale' },
  {
    id: 'timer',
    color: 'var(--cube-green)',
    icon: TimerIcon,
    titleKey: 'Settings-menu.timer'
  },
  {
    id: 'features',
    color: 'var(--cube-yellow)',
    icon: FeaturesIcon,
    titleKey: 'Settings-menu.features'
  },
  {
    id: 'alerts',
    color: 'var(--cube-orange)',
    icon: AlertsIcon,
    titleKey: 'Settings-menu.alerts'
  },
  {
    id: 'sounds',
    color: 'var(--cube-blue)',
    icon: SoundsIcon,
    titleKey: 'Settings-menu.sounds'
  },
  {
    id: 'background',
    color: 'var(--cube-red)',
    icon: ThemeIcon,
    titleKey: 'Settings-menu.theme'
  },
  {
    id: 'privacy',
    color: 'var(--cube-yellow)',
    icon: PrivacyIcon,
    titleKey: 'Settings-menu.privacy'
  },
  {
    id: 'app-data',
    color: 'var(--cube-orange)',
    icon: DataIcon,
    titleKey: 'Settings-menu.data'
  }
] as const

export const SETTINGS_SECTION_IDS: readonly string[] = SETTINGS_SECTIONS.map((s) => s.id)
