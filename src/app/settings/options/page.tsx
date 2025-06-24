"use client";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import ThemeSelect from "@/components/menu-settings/ThemeSelect";
import { MenuSection } from "@/components/menu-settings/MenuSection";
import { MenuOption } from "@/components/menu-settings/MenuOption";
import { DataImportExport } from "@/components/menu-settings/DataImportExport";
import { useTranslations } from "next-intl";
import {
  BellIcon,
  BoxModelIcon,
  ComponentBooleanIcon,
  FileTextIcon,
  LapTimerIcon,
  MagicWandIcon,
  SpeakerLoudIcon,
} from "@radix-ui/react-icons";
import MenuSelectLanguage from "@/components/menu-settings/MenuSelectLanguage";
import CustomTheme from "@/components/menu-settings/CustomTheme";
import MenuSelectDefaultStartCube from "@/components/menu-settings/MenuSelectDefaultStartCube";
import AccountHeader from "@/components/account/account-header/account-header";
import { Separator } from "@/components/ui/separator";
import MenuSelectColor from "@/components/menu-settings/MenuSelectColor";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { saveSettings } from "@/lib/settingsUtils";
import MenuInputOption from "@/components/menu-settings/MenuInputOption";
import _ from "lodash";

export default function Page() {
  const { settings, setSettings } = useSettingsModalStore();
  const t = useTranslations("Index");
  const { watch, control, getValues, formState: { isDirty }, reset } = useForm({ defaultValues: settings });
  const formWatch = watch();

  useEffect(() => {
    const debounceSave = _.debounce(() => {
      if (isDirty) {
        saveSettings(getValues());
        setSettings(getValues());
        reset(getValues());
      }
    }, 400);

    debounceSave();

    return () => {
      debounceSave.cancel();
    };
  }, [formWatch, getValues, isDirty, setSettings, reset]);

  return (
    <>
      <div className="overflow-y-auto">
        <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg">
          <AccountHeader back="/" label={t("SettingsPage.options")}/>

          <MenuSelectLanguage/>

          <Separator className="my-5"/>

          <MenuSection
            id="timer"
            icon={<LapTimerIcon/>}
            title={t("Settings-menu.timer")}
          >
            <MenuOption
              label={t("Settings-menu.inspection")}
              name={"timer.inspection"}
              control={control}
              description={t("Settings-descriptions.inspection")}
            />

            <MenuInputOption
              name={"timer.inspectionTime"}
              label={t("Settings-menu.inspection-time")}
              control={control}
              inputProps={{ min: 5000, max: 60000, step: 1000 }}
              description={t("Settings-descriptions.inspection-time")}
            />

            <MenuOption
              name={"timer.startCue"}
              label={t("Settings-menu.start-cue")}
              control={control}
              description={t("Settings-descriptions.start-cue")}
            />

            <MenuOption
              name={("timer.holdToStart")}
              label={t("Settings-menu.hold-to-start")}
              control={control}
              description={t("Settings-descriptions.hold-to-start")}
            />

            <MenuInputOption
              name={"timer.holdToStartTime"}
              label={t("Settings-menu.hold-to-start-time")}
              control={control}
              inputProps={{ min: 300, max: 1000, step: 100 }}
              description={t("Settings-descriptions.hold-to-start-time")}
            />

            <MenuOption
              name={("timer.manualMode")}
              label={t("Settings-menu.manual-mode")}
              control={control}
              description={t("Settings-descriptions.manual-mode")}
            />

            <MenuInputOption
              name={"timer.decimals"}
              label={t("Settings-menu.decimal-places")}
              control={control}
              inputProps={{ max: 4, min: 1, step: 1 }}
              description={t("Settings-descriptions.decimal-places")}
            />

          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection
            id="features"
            icon={<MagicWandIcon/>}
            title={t("Settings-menu.features")}
          >
            <MenuOption
              name={("features.scrambleImage")}
              label={t("Settings-menu.scramble-image")}
              control={control}
              description={t("Settings-descriptions.scramble-image")}
            />
            <MenuOption
              name={("features.sessionStats")}
              label={t("Settings-menu.session-stats")}
              control={control}
              description={t("Settings-descriptions.session-stats")}
            />
            <MenuOption
              name={("features.quickActionButtons")}
              label={t("Settings-menu.quick-action-buttons")}
              control={control}
              description={t("Settings-descriptions.quick-action-buttons")}
            />
            <MenuOption
              name={("features.hideWhileSolving")}
              label={t("Settings-menu.hide-while-solving")}
              control={control}
              description={t("Settings-descriptions.hide-while-solving")}
            />
            <MenuOption
              name={("features.scrambleBackground")}
              label={t("Settings-menu.scramble-background")}
              control={control}
              description={t("Settings-descriptions.scramble-background")}
            />
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection
            id="alerts"
            icon={<BellIcon/>}
            title={t("Settings-menu.alerts")}
          >
            <MenuOption
              name={("alerts.bestTime")}
              label={t("Settings-menu.best-time")}
              control={control}
              description={t("Settings-descriptions.best-time-alert")}
            />
            <MenuOption
              name={("alerts.bestAverage")}
              label={t("Settings-menu.best-average")}
              control={control}
              description={t("Settings-descriptions.best-average-alert")}
            />

            <MenuOption
              name={"alerts.worstTime"}
              label={t("Settings-menu.worst-time")}
              control={control}
              description={t("Settings-descriptions.worst-time-alert")}
            />
          </MenuSection>

          <Separator className="my-5" />

          <MenuSection
            id="sounds"
            icon={<SpeakerLoudIcon />}
            title={t("Settings-menu.sounds")}
          >
            <MenuOption
              name={"sounds.newPersonalBest"}
              label={t("Settings-menu.newPersonalBest")}
              control={control}
              description={t("Settings-descriptions.new-personal-best-sound")}
            />
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection
            id="background"
            icon={<ComponentBooleanIcon/>}
            title={t("Settings-menu.theme")}
          >
            <ThemeSelect/>
            <CustomTheme/>
            <MenuSelectColor/>
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection
            id="preferences"
            icon={<BoxModelIcon/>}
            title={t("Settings-menu.preferences")}
          >
            <MenuSelectDefaultStartCube/>
          </MenuSection>

          <Separator className="my-5"/>

          <MenuSection
            id="app-data"
            icon={<FileTextIcon/>}
            title={t("Settings-menu.data")}
          >
            <DataImportExport/>
          </MenuSection>
        </div>
      </div>
    </>
  );
}
