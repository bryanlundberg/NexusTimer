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
  { id: 'region', icon: RegionIcon, titleKey: 'Settings-menu.locale' },
  { id: 'timer', icon: TimerIcon, titleKey: 'Settings-menu.timer' },
  { id: 'features', icon: FeaturesIcon, titleKey: 'Settings-menu.features' },
  { id: 'alerts', icon: AlertsIcon, titleKey: 'Settings-menu.alerts' },
  { id: 'sounds', icon: SoundsIcon, titleKey: 'Settings-menu.sounds' },
  { id: 'background', icon: ThemeIcon, titleKey: 'Settings-menu.theme' },
  { id: 'privacy', icon: PrivacyIcon, titleKey: 'Settings-menu.privacy' },
  { id: 'app-data', icon: DataIcon, titleKey: 'Settings-menu.data' }
] as const

export const SETTINGS_SECTION_IDS: readonly string[] = SETTINGS_SECTIONS.map((s) => s.id)
