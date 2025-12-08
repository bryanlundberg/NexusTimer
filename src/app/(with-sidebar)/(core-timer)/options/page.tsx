'use client'
import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useTranslations } from 'next-intl'
import {
  BellIcon,
  BoxModelIcon,
  ComponentBooleanIcon,
  FileTextIcon,
  LapTimerIcon,
  Link2Icon,
  MagicWandIcon,
  SpeakerLoudIcon,
  UpdateIcon
} from '@radix-ui/react-icons'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import AccountHeader from '@/features/account/ui/account-header'
import MenuSelectLanguage from '@/features/settings/ui/MenuSelectLanguage'
import { MenuSection } from '@/features/settings/ui/MenuSection'
import MenuInputOption from '@/features/settings/ui/MenuInputOption'
import { MenuOption } from '@/features/settings/ui/MenuOption'
import ThemeSelect from '@/features/settings/ui/ThemeSelect'
import CustomTheme from '@/features/settings/ui/CustomTheme'
import MenuSelectColor from '@/features/settings/ui/MenuSelectColor'
import MenuSelectDefaultStartCube from '@/features/settings/ui/MenuSelectDefaultStartCube'
import { DataImportExport } from '@/features/settings/ui/DataImportExport'
import useWebsiteColors from '@/shared/model/useWebsiteColors'
import { Trash } from 'lucide-react';
import { useTimerStore } from '@/shared/model/timer/useTimerStore';
import useAlert from '@/shared/model/useAlert';
import { cubesDB } from '@/entities/cube/api/indexdb';

export default function OptionsPage() {
  const { settings, setSettings } = useSettingsStore()
  const t = useTranslations('Index')
  const { control, reset } = useForm({ defaultValues: settings })
  const { applyColorTheme } = useWebsiteColors()
  const setCubes = useTimerStore(state => state.setCubes);
  const setSelectedCube = useTimerStore(state => state.setSelectedCube);
  const alert = useAlert();
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    reset(settings)
  }, [settings, reset])

  const handleResetSettings = () => {
    reset(defaultSettings)
    setSettings(defaultSettings)
    applyColorTheme(defaultSettings.preferences.colorTheme)
    setFormKey((k) => k + 1)
    toast.success('Settings have been reset to default')
  }

  const handleDeleteAppData = async () => {
    const confirmed = await alert({
      title: 'Delete all app data?',
      subtitle: 'This action will permanently delete all your cubes and solves data and cannot be undone. Are you sure you want to proceed?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })
    if (!confirmed) return;

    await cubesDB.clear()
    setCubes([]);
    setSelectedCube(null);
    toast.success('All app data has been deleted');
  }

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <div className="mt-5">
        <div key={formKey} className="max-w-md mx-auto bg-background/90 backdrop-blur-lg">
          <AccountHeader back="/app" label={t('SettingsPage.options')}/>

          <MenuSelectLanguage/>

          <Separator className="my-5"/>

          <MenuSection id="timer" icon={<LapTimerIcon/>} title={t('Settings-menu.timer')}>
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
              inputProps={{ max: 4, min: 1, step: 1 }}
              description={t('Settings-descriptions.decimal-places')}
            />
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection id="features" icon={<MagicWandIcon/>} title={t('Settings-menu.features')}>
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
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection id="alerts" icon={<BellIcon/>} title={t('Settings-menu.alerts')}>
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

          <Separator className="my-5"/>

          <MenuSection id="sounds" icon={<SpeakerLoudIcon/>} title={t('Settings-menu.sounds')}>
            <MenuOption
              name={'sounds.newPersonalBest'}
              label={t('Settings-menu.newPersonalBest')}
              control={control}
              description={t('Settings-descriptions.new-personal-best-sound')}
            />
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection id="background" icon={<ComponentBooleanIcon/>} title={t('Settings-menu.theme')}>
            <ThemeSelect/>
            <CustomTheme/>
            <MenuSelectColor/>
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection id="preferences" icon={<BoxModelIcon/>} title={t('Settings-menu.preferences')}>
            <MenuSelectDefaultStartCube/>
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection icon={<Link2Icon/>} title={'Cloud Sync'} id="cloud-sync">
            <MenuOption
              label={'Enable Automatic Save Cloud'}
              name={'sync.autoSaveEnabled'}
              control={control}
              description={'Automatically save your data to the cloud'}
            />

            <MenuOption
              label={'Enable Automatic Load Cloud'}
              name={'sync.autoLoadEnabled'}
              control={control}
              description={'Automatically load your data from the cloud when you open the app'}
            />

            <MenuInputOption
              name={'sync.backupInterval'}
              label={'Backup Interval'}
              control={control}
              inputProps={{ min: defaultSettings.sync.backupInterval, max: 100, step: 5 }}
              description={'Number of solves between each automatic cloud backup'}
            />
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection id="app-data" icon={<FileTextIcon/>} title={t('Settings-menu.data')}>
            <DataImportExport/>
          </MenuSection>

          <Separator className="my-5"/>

          <div className={'ps-3 pe-3 mb-3'}>
            <div className="flex gap-2 mb-10">
              <Button
                variant="destructive"
                onClick={handleResetSettings}
                className="flex items-center gap-2"
                data-testid="reset-settings-button"
              >
                <UpdateIcon className="size-4"/>
                {'Reset settings'}
              </Button>

              <Button
                variant={'destructive'}
                onClick={handleDeleteAppData}
                className="flex items-center gap-2" data-testid="delete-app-data-button"
              >
                <Trash className="size-4"/>
                Delete App data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
