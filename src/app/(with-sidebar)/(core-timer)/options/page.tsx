'use client'
import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTranslations } from 'next-intl'
import {
  BellIcon,
  BoxModelIcon,
  ComponentBooleanIcon,
  FileTextIcon,
  GlobeIcon,
  LapTimerIcon,
  LockClosedIcon,
  MagicWandIcon,
  SpeakerLoudIcon,
  UpdateIcon
} from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import MenuSelectLanguage from '@/features/settings/ui/MenuSelectLanguage'
import { MenuSection } from '@/features/settings/ui/MenuSection'
import MenuInputOption from '@/features/settings/ui/MenuInputOption'
import { MenuOption } from '@/features/settings/ui/MenuOption'
import ThemeSelect from '@/features/settings/ui/ThemeSelect'
import CustomTheme from '@/features/settings/ui/CustomTheme'
import MenuSelectColor from '@/features/settings/ui/MenuSelectColor'
import MenuSelectVoiceGender from '@/features/settings/ui/MenuSelectVoiceGender'
import MenuSelectScrambleSize from '@/features/settings/ui/MenuSelectScrambleSize'
import MenuSelectDefaultStartCube from '@/features/settings/ui/MenuSelectDefaultStartCube'
import MenuSelectActivationKey from '@/features/settings/ui/MenuSelectActivationKey'
import { DataImportExport } from '@/features/settings/ui/DataImportExport'
import MenuToggleAnalytics from '@/features/settings/ui/MenuToggleAnalytics'
import useWebsiteColors from '@/shared/model/useWebsiteColors'
import { Trash } from 'lucide-react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import useAlert from '@/shared/model/useAlert'
import { cubesDB } from '@/entities/cube/api/indexdb'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { cn } from '@/shared/lib/utils'

const SECTION_ACCENTS: Record<string, string> = {
  region: 'bg-cube-red',
  timer: 'bg-cube-green',
  features: 'bg-cube-yellow',
  alerts: 'bg-cube-orange',
  sounds: 'bg-cube-blue',
  background: 'bg-cube-red',
  preferences: 'bg-cube-green',
  privacy: 'bg-cube-yellow',
  'app-data': 'bg-cube-orange'
}

const SECTION_IDS = Object.keys(SECTION_ACCENTS)

export default function OptionsPage() {
  const { settings, setSettings } = useSettingsStore()
  const t = useTranslations('Index')
  const { control, reset } = useForm({ defaultValues: settings })
  const { applyColorTheme } = useWebsiteColors()
  const setCubes = useTimerStore((state) => state.setCubes)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const alert = useAlert()
  const [formKey, setFormKey] = useState(0)
  const [activeSection, setActiveSection] = useState<string>('region')

  useEffect(() => {
    reset(settings)
  }, [settings, reset])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-15% 0px -75% 0px' }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [formKey])

  const navSections = [
    { id: 'region', icon: <GlobeIcon className="size-4 shrink-0" />, label: t('Settings-menu.locale') },
    { id: 'timer', icon: <LapTimerIcon className="size-4 shrink-0" />, label: t('Settings-menu.timer') },
    { id: 'features', icon: <MagicWandIcon className="size-4 shrink-0" />, label: t('Settings-menu.features') },
    { id: 'alerts', icon: <BellIcon className="size-4 shrink-0" />, label: t('Settings-menu.alerts') },
    { id: 'sounds', icon: <SpeakerLoudIcon className="size-4 shrink-0" />, label: t('Settings-menu.sounds') },
    { id: 'background', icon: <ComponentBooleanIcon className="size-4 shrink-0" />, label: t('Settings-menu.theme') },
    { id: 'preferences', icon: <BoxModelIcon className="size-4 shrink-0" />, label: t('Settings-menu.preferences') },
    { id: 'privacy', icon: <LockClosedIcon className="size-4 shrink-0" />, label: t('Settings-menu.privacy') },
    { id: 'app-data', icon: <FileTextIcon className="size-4 shrink-0" />, label: t('Settings-menu.data') }
  ]

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleResetSettings = () => {
    reset(defaultSettings)
    setSettings(defaultSettings)
    applyColorTheme(defaultSettings.preferences.colorTheme)
    setFormKey((k) => k + 1)
    toast.success(t('SettingsPage.reset-settings-success'))
  }

  const handleDeleteAppData = async () => {
    const confirmed = await alert({
      title: t('SettingsPage.delete-app-data-title'),
      subtitle: t('SettingsPage.delete-app-data-subtitle'),
      confirmText: t('Inputs.delete'),
      cancelText: t('Inputs.cancel')
    })
    if (!confirmed) return

    await cubesDB.clear()
    setCubes([])
    setSelectedCube(null)
    toast.success(t('SettingsPage.delete-app-data-success'))
  }

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <CoreHeader breadcrumbs={[{ label: t('SettingsPage.options'), href: '/options' }]} />
      <PageBody variant="hero" className="w-full max-w-6xl mx-auto px-3 sm:px-6 pb-4">
        <div className="flex items-start gap-10">
          <nav
            aria-label={t('SettingsPage.options')}
            className="hidden lg:flex w-52 shrink-0 sticky top-20 flex-col gap-0.5"
          >
            {navSections.map(({ id, icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-md pl-2 pr-3 py-2 text-sm text-left transition-colors',
                  activeSection === id
                    ? 'bg-muted/60 text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                )}
              >
                <span
                  className={cn(
                    'h-4 w-0.5 rounded-full shrink-0 transition-colors',
                    activeSection === id ? SECTION_ACCENTS[id] : 'bg-transparent'
                  )}
                  aria-hidden
                />
                {icon}
                <span className="truncate">{label}</span>
              </button>
            ))}
          </nav>
          <div key={formKey} className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0 flex flex-col gap-7">
            <MenuSelectLanguage />
            <MenuSection
              id="timer"
              accent={SECTION_ACCENTS['timer']}
              icon={<LapTimerIcon />}
              title={t('Settings-menu.timer')}
            >
              <MenuSelectActivationKey />
              <MenuOption
                label={t('Settings-menu.inspection')}
                name={'timer.inspection'}
                control={control}
                description={t('Settings-descriptions.inspection')}
              />
              <MenuInputOption
                name={'timer.inspectionTime'}
                label={t('Settings-menu.inspection-time')}
                control={control}
                inputProps={{ min: 5000, max: 60000, step: 1000 }}
                description={t('Settings-descriptions.inspection-time')}
              />
              <MenuOption
                name={'timer.startCue'}
                label={t('Settings-menu.start-cue')}
                control={control}
                description={t('Settings-descriptions.start-cue')}
              />
              <MenuOption
                name={'timer.holdToStart'}
                label={t('Settings-menu.hold-to-start')}
                control={control}
                description={t('Settings-descriptions.hold-to-start')}
              />
              <MenuInputOption
                name={'timer.holdToStartTime'}
                label={t('Settings-menu.hold-to-start-time')}
                control={control}
                inputProps={{ min: 300, max: 1000, step: 100 }}
                description={t('Settings-descriptions.hold-to-start-time')}
              />
              <MenuInputOption
                name={'timer.decimals'}
                label={t('Settings-menu.decimal-places')}
                control={control}
                inputProps={{ max: 3, min: 1, step: 1 }}
                description={t('Settings-descriptions.decimal-places')}
              />
            </MenuSection>
            <MenuSection
              id="features"
              accent={SECTION_ACCENTS['features']}
              icon={<MagicWandIcon />}
              title={t('Settings-menu.features')}
            >
              <MenuOption
                name={'features.scrambleImage'}
                label={t('Settings-menu.scramble-image')}
                control={control}
                description={t('Settings-descriptions.scramble-image')}
              />
              <MenuOption
                name={'features.sessionStats'}
                label={t('Settings-menu.session-stats')}
                control={control}
                description={t('Settings-descriptions.session-stats')}
              />
              <MenuOption
                name={'features.quickActionButtons'}
                label={t('Settings-menu.quick-action-buttons')}
                control={control}
                description={t('Settings-descriptions.quick-action-buttons')}
              />
              <MenuOption
                name={'features.hideWhileSolving'}
                label={t('Settings-menu.hide-while-solving')}
                control={control}
                description={t('Settings-descriptions.hide-while-solving')}
              />
              <MenuOption
                name={'features.scrambleBackground'}
                label={t('Settings-menu.scramble-background')}
                control={control}
                description={t('Settings-descriptions.scramble-background')}
              />
              <MenuSelectScrambleSize />
              <MenuOption
                name={'features.haptics'}
                label={t('Settings-menu.haptics')}
                control={control}
                description={t('Settings-descriptions.haptics')}
              />
            </MenuSection>
            <MenuSection
              id="alerts"
              accent={SECTION_ACCENTS['alerts']}
              icon={<BellIcon />}
              title={t('Settings-menu.alerts')}
            >
              <MenuOption
                name={'alerts.bestTime'}
                label={t('Settings-menu.best-time')}
                control={control}
                description={t('Settings-descriptions.best-time-alert')}
              />
              <MenuOption
                name={'alerts.bestAverage'}
                label={t('Settings-menu.best-average')}
                control={control}
                description={t('Settings-descriptions.best-average-alert')}
              />
              <MenuOption
                name={'alerts.worstTime'}
                label={t('Settings-menu.worst-time')}
                control={control}
                description={t('Settings-descriptions.worst-time-alert')}
              />
            </MenuSection>
            <MenuSection
              id="sounds"
              accent={SECTION_ACCENTS['sounds']}
              icon={<SpeakerLoudIcon />}
              title={t('Settings-menu.sounds')}
            >
              <MenuOption
                name={'sounds.newPersonalBest'}
                label={t('Settings-menu.newPersonalBest')}
                control={control}
                description={t('Settings-descriptions.new-personal-best-sound')}
              />
              <MenuOption
                name={'sounds.inspection'}
                label={t('Settings-menu.inspection-sound')}
                control={control}
                description={t('Settings-descriptions.inspection-sound')}
              />
              <MenuOption
                name={'sounds.newRound'}
                label={t('Settings-menu.new-round-sound')}
                control={control}
                description={t('Settings-descriptions.new-round-sound')}
              />
              <MenuOption
                name={'sounds.favorite'}
                label={t('Settings-menu.favorite-sound')}
                control={control}
                description={t('Settings-descriptions.favorite-sound')}
              />
              <MenuOption
                name={'sounds.trash'}
                label={t('Settings-menu.trash-sound')}
                control={control}
                description={t('Settings-descriptions.trash-sound')}
              />
              <MenuSelectVoiceGender />
            </MenuSection>
            <MenuSection
              id="background"
              accent={SECTION_ACCENTS['background']}
              icon={<ComponentBooleanIcon />}
              title={t('Settings-menu.theme')}
            >
              <ThemeSelect />
              <CustomTheme />
              <MenuSelectColor />
            </MenuSection>
            <MenuSection
              id="preferences"
              accent={SECTION_ACCENTS['preferences']}
              icon={<BoxModelIcon />}
              title={t('Settings-menu.preferences')}
            >
              <MenuSelectDefaultStartCube />
            </MenuSection>
            <MenuSection
              id="privacy"
              accent={SECTION_ACCENTS['privacy']}
              icon={<LockClosedIcon />}
              title={t('Settings-menu.privacy')}
            >
              <MenuToggleAnalytics />
            </MenuSection>
            <MenuSection
              id="app-data"
              accent={SECTION_ACCENTS['app-data']}
              icon={<FileTextIcon />}
              title={t('Settings-menu.data')}
            >
              <DataImportExport />
            </MenuSection>
            <div className="border-t border-border/60 pt-5 mb-10 px-3 flex flex-col sm:flex-row flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                className="flex items-center gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                data-testid="reset-settings-button"
              >
                <UpdateIcon className="size-4" />
                {t('SettingsPage.reset-settings')}
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteAppData}
                className="flex items-center gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                data-testid="delete-app-data-button"
              >
                <Trash className="size-4" />
                {t('SettingsPage.delete-app-data')}
              </Button>
            </div>
          </div>
        </div>
      </PageBody>
    </ScrollArea>
  )
}
