import {
  BellIcon,
  BoxModelIcon,
  ComponentBooleanIcon,
  FileTextIcon,
  GlobeIcon,
  LapTimerIcon,
  LockClosedIcon,
  MagicWandIcon,
  SpeakerLoudIcon
} from '@radix-ui/react-icons'

export const SETTINGS_SECTIONS = [
  { id: 'region', accent: 'bg-cube-red', icon: GlobeIcon, titleKey: 'Settings-menu.locale' },
  { id: 'timer', accent: 'bg-cube-green', icon: LapTimerIcon, titleKey: 'Settings-menu.timer' },
  { id: 'features', accent: 'bg-cube-yellow', icon: MagicWandIcon, titleKey: 'Settings-menu.features' },
  { id: 'alerts', accent: 'bg-cube-orange', icon: BellIcon, titleKey: 'Settings-menu.alerts' },
  { id: 'sounds', accent: 'bg-cube-blue', icon: SpeakerLoudIcon, titleKey: 'Settings-menu.sounds' },
  { id: 'background', accent: 'bg-cube-red', icon: ComponentBooleanIcon, titleKey: 'Settings-menu.theme' },
  { id: 'preferences', accent: 'bg-cube-green', icon: BoxModelIcon, titleKey: 'Settings-menu.preferences' },
  { id: 'privacy', accent: 'bg-cube-yellow', icon: LockClosedIcon, titleKey: 'Settings-menu.privacy' },
  { id: 'app-data', accent: 'bg-cube-orange', icon: FileTextIcon, titleKey: 'Settings-menu.data' }
] as const

export const SETTINGS_SECTION_IDS: readonly string[] = SETTINGS_SECTIONS.map((s) => s.id)

export const SECTION_ACCENTS: Record<string, string> = Object.fromEntries(
  SETTINGS_SECTIONS.map((s) => [s.id, s.accent])
)
