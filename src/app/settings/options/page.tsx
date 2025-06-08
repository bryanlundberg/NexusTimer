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
} from "@radix-ui/react-icons";
import MenuSelectLanguage from "@/components/menu-settings/MenuSelectLanguage";
import CustomTheme from "@/components/menu-settings/CustomTheme";
import MenuSelectDefaultStartCube from "@/components/menu-settings/MenuSelectDefaultStartCube";
import AccountHeader from "@/components/account/account-header/account-header";
import { Separator } from "@/components/ui/separator";
import MenuSelectColor from "@/components/menu-settings/MenuSelectColor";

export default function Page() {
  const { settings } = useSettingsModalStore();
  const t = useTranslations("Index");
  return (
    <>
      <div className="overflow-y-auto">
        <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg">
          <AccountHeader back="/settings" label={t("SettingsPage.options")} />

          <MenuSelectLanguage />

          <Separator className="my-5" />

          <MenuSection
            id="timer"
            icon={<LapTimerIcon />}
            title={t("Settings-menu.timer")}
          >
            <MenuOption
              setting={settings.timer.inspection}
              label={t("Settings-menu.inspection")}
            />
            <MenuOption
              setting={settings.timer.startCue}
              label={t("Settings-menu.start-cue")}
            />
            <MenuOption
              setting={settings.timer.holdToStart}
              label={t("Settings-menu.hold-to-start")}
            />
            <MenuOption
              setting={settings.timer.manualMode}
              label={t("Settings-menu.manual-mode")}
            />
          </MenuSection>

          <Separator className="my-5" />

          <MenuSection
            id="features"
            icon={<MagicWandIcon />}
            title={t("Settings-menu.features")}
          >
            <MenuOption
              setting={settings.features.scrambleImage}
              label={t("Settings-menu.scramble-image")}
            />
            <MenuOption
              setting={settings.features.sessionStats}
              label={t("Settings-menu.session-stats")}
            />
            <MenuOption
              setting={settings.features.quickActionButtons}
              label={t("Settings-menu.quick-action-buttons")}
            />
            <MenuOption
              setting={settings.features.hideWhileSolving}
              label={t("Settings-menu.hide-while-solving")}
            />
            <MenuOption
              setting={settings.features.scrambleBackground}
              label={t("Settings-menu.scramble-background")}
            />
          </MenuSection>

          <Separator className="my-5" />

          <MenuSection
            id="alerts"
            icon={<BellIcon />}
            title={t("Settings-menu.alerts")}
          >
            <MenuOption
              setting={settings.alerts.bestTime}
              label={t("Settings-menu.best-time")}
            />
            <MenuOption
              setting={settings.alerts.bestAverage}
              label={t("Settings-menu.best-average")}
            />

            <MenuOption
              setting={settings.alerts.worstTime}
              label={t("Settings-menu.worst-time")}
            />
          </MenuSection>

          <Separator className="my-5" />

          <MenuSection
            id="background"
            icon={<ComponentBooleanIcon />}
            title={t("Settings-menu.theme")}
          >
            <ThemeSelect />
            <CustomTheme />
            <MenuSelectColor/>
          </MenuSection>

          <Separator className="my-5" />

          <MenuSection
            id="app-data"
            icon={<FileTextIcon />}
            title={t("Settings-menu.data")}
          >
            <DataImportExport />
          </MenuSection>

          <Separator className="my-5" />

          <MenuSection
            id="preferences"
            icon={<BoxModelIcon />}
            title={t("Settings-menu.preferences")}
          >
            <MenuSelectDefaultStartCube />
          </MenuSection>
        </div>
      </div>
    </>
  );
}
