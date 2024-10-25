"use client";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import ThemeSelect from "@/components/menu-settings/ThemeSelect";
import { MenuSection } from "@/components/menu-settings/MenuSection";
import { MenuOption } from "@/components/menu-settings/MenuOption";
import { DataImportExport } from "@/components/menu-settings/DataImportExport";
import { Link } from "@/i18n/routing";
import useEscape from "@/hooks/useEscape";
import { useTranslations } from "next-intl";
import {
  ArrowLeftIcon,
  BellIcon,
  BoxModelIcon,
  ComponentBooleanIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LapTimerIcon,
  MagicWandIcon,
  QuoteIcon,
} from "@radix-ui/react-icons";
import MenuSelectLanguage from "@/components/menu-settings/MenuSelectLanguage";
import CustomTheme from "@/components/menu-settings/CustomTheme";
import MenuSelectDefaultStartCube from "@/components/menu-settings/MenuSelectDefaultStartCube";
import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import ImportModal from "@/components/menu-settings/ImportModal";

export default function Page() {
  const { settings } = useSettingsModalStore();
  const t = useTranslations("Index.Settings-menu");
  return (
    <>
      <div className="overflow-y-auto">
        <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg">
          <div className="py-5 relative">
            <Link
              href={"/"}
              className="flex items-center cursor-pointer ps-3 absolute top-7 left-4"
            >
              <ArrowLeftIcon />
            </Link>
            <div className="text-2xl text-center font-black">{t("title")}</div>
          </div>

          <MenuSelectLanguage />

          <MenuSection icon={<LapTimerIcon />} title={t("timer")}>
            <MenuOption
              setting={settings.timer.inspection}
              label={t("inspection")}
            />
            <MenuOption
              setting={settings.timer.startCue}
              label={t("start-cue")}
            />
            <MenuOption
              setting={settings.timer.holdToStart}
              label={t("hold-to-start")}
            />
            <MenuOption
              setting={settings.timer.manualMode}
              label={t("manual-mode")}
            />
          </MenuSection>

          <MenuSection icon={<MagicWandIcon />} title={t("features")}>
            <MenuOption
              setting={settings.features.scrambleImage}
              label={t("scramble-image")}
            />
            <MenuOption
              setting={settings.features.sessionStats}
              label={t("session-stats")}
            />
            <MenuOption
              setting={settings.features.quickActionButtons}
              label={t("quick-action-buttons")}
            />
            <MenuOption
              setting={settings.features.hideWhileSolving}
              label={t("hide-while-solving")}
            />
            <MenuOption
              setting={settings.features.scrambleBackground}
              label={t("scramble-background")}
            />
          </MenuSection>

          <MenuSection icon={<BellIcon />} title={t("alerts")}>
            <MenuOption
              setting={settings.alerts.bestTime}
              label={t("best-time")}
            />
            <MenuOption
              setting={settings.alerts.bestAverage}
              label={t("best-average")}
            />

            <MenuOption
              setting={settings.alerts.worstTime}
              label={t("worst-time")}
            />
          </MenuSection>

          <MenuSection icon={<ComponentBooleanIcon />} title={t("theme")}>
            <ThemeSelect />
            <CustomTheme />
          </MenuSection>

          <MenuSection icon={<FileTextIcon />} title={t("data")}>
            <DataImportExport />
          </MenuSection>

          <MenuSection icon={<BoxModelIcon />} title={t("preferences")}>
            <MenuSelectDefaultStartCube />
          </MenuSection>

          <MenuSection icon={<QuoteIcon />} title={t("about")}>
            <div className="flex flex-col justify-center items-center gap-3">
              <Logo className="my-10" />

              <div className="text-center w-11/12 italic mx-auto text-sm">
                &rdquo;{t("legend")}&rdquo;
              </div>

              <div className="flex gap-3 underline">
                <Link
                  href={"https://github.com/bryanlundberg/NexusTimer/issues"}
                  target="_blank"
                >
                  <Button variant={"link"}>
                    {t("suggest")}
                    <ExternalLinkIcon />
                  </Button>
                </Link>

                <Link
                  href={"https://github.com/bryanlundberg/NexusTimer/issues"}
                  target="_blank"
                >
                  <Button variant={"link"}>
                    {t("report-bug")}
                    <ExternalLinkIcon />
                  </Button>
                </Link>
              </div>
            </div>
          </MenuSection>
        </div>
      </div>
      <ImportModal />
    </>
  );
}
