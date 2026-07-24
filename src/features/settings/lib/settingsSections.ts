import {
  AlertsIcon,
  DataIcon,
  FeaturesIcon,
  PreferencesIcon,
  PrivacyIcon,
  RegionIcon,
  SoundsIcon,
  ThemeIcon,
  TimerIcon
} from '@/components/ui/settings-icons'

export const SETTINGS_SECTIONS = [
  { id: 'region', accent: 'bg-cube-red', icon: RegionIcon, titleKey: 'Settings-menu.locale' },
  { id: 'timer', accent: 'bg-cube-green', icon: TimerIcon, titleKey: 'Settings-menu.timer' },
  { id: 'features', accent: 'bg-cube-yellow', icon: FeaturesIcon, titleKey: 'Settings-menu.features' },
  { id: 'alerts', accent: 'bg-cube-orange', icon: AlertsIcon, titleKey: 'Settings-menu.alerts' },
  { id: 'sounds', accent: 'bg-cube-blue', icon: SoundsIcon, titleKey: 'Settings-menu.sounds' },
  { id: 'background', accent: 'bg-cube-red', icon: ThemeIcon, titleKey: 'Settings-menu.theme' },
  { id: 'preferences', accent: 'bg-cube-green', icon: PreferencesIcon, titleKey: 'Settings-menu.preferences' },
  { id: 'privacy', accent: 'bg-cube-yellow', icon: PrivacyIcon, titleKey: 'Settings-menu.privacy' },
  { id: 'app-data', accent: 'bg-cube-orange', icon: DataIcon, titleKey: 'Settings-menu.data' }
] as const

export const SETTINGS_SECTION_IDS: readonly string[] = SETTINGS_SECTIONS.map((s) => s.id)

export const SECTION_ACCENTS: Record<string, string> = Object.fromEntries(
  SETTINGS_SECTIONS.map((s) => [s.id, s.accent])
)
