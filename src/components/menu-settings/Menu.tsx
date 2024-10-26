import { useSettingsModalStore } from "@/store/SettingsModalStore";
import ThemeSelect from "@/components/menu-settings/ThemeSelect";
import { MenuSection } from "@/components/menu-settings/MenuSection";
import { MenuOption } from "@/components/menu-settings/MenuOption";
import { DataImportExport } from "@/components/menu-settings/DataImportExport";
import { useTimerStore } from "@/store/timerStore";
import Link from "next/link";
import useEscape from "@/hooks/useEscape";
import { AnimatePresence, motion } from "framer-motion";
import CustomTheme from "./CustomTheme";
import { useTranslations } from "next-intl";
import MenuSelectLanguage from "./MenuSelectLanguage";
import MenuSelectDefaultStartCube from "./MenuSelectDefaultStartCube";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
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
import Logo from "../logo/logo";

export default function MenuSettings() {
  const { settingsOpen, setSettingsOpen, settings } = useSettingsModalStore();

  const { isSolving } = useTimerStore();
  const t = useTranslations("Index.Settings-menu");

  useEscape(() => setSettingsOpen(false));

  return (
    <>
      <AnimatePresence>
        {settingsOpen && !isSolving ? (
          <div className="absolute z-30 flex w-full h-full overflow-auto">
            <motion.div
              initial={{ x: -400, opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0.6 }}
              transition={{ type: "lineal" }}
              className="flex flex-col w-full gap-3 sm:max-w-[450px] bg-background border-r"
            >
              <ScrollArea>
                <div className="py-5 relative">
                  <Link
                    href={"/"}
                    onClick={() => setSettingsOpen(false)}
                    className="flex items-center cursor-pointer ps-3 absolute top-7 left-4"
                  >
                    <ArrowLeftIcon />
                  </Link>
                  <div className="text-2xl text-center font-black">
                    {t("title")}
                  </div>
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
                        href={
                          "https://github.com/bryanlundberg/NexusTimer/issues"
                        }
                        target="_blank"
                      >
                        <Button variant={"link"}>
                          {t("suggest")}
                          <ExternalLinkIcon />
                        </Button>
                      </Link>

                      <Link
                        href={
                          "https://github.com/bryanlundberg/NexusTimer/issues"
                        }
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
              </ScrollArea>
            </motion.div>
            {/* Area to the right  -> Its a transparent layer next to menu */}
            <Link
              href={"/"}
              onClick={() => {
                setSettingsOpen(false);
              }}
              className="sm:grow cursor-default"
            ></Link>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
