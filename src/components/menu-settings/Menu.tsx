import ArrowLeft from "@/icons/ArrowLeft";
import CpuChip from "@/icons/CpuChip";
import BellAlert from "@/icons/BellAlert";
import Clock from "@/icons/Clock";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import Sparkles from "@/icons/Sparkles";
import ThemeSelect from "@/components/menu-settings/ThemeSelect";
import { MenuSection } from "@/components/menu-settings/MenuSection";
import { MenuOption } from "@/components/menu-settings/MenuOption";
import { DataImportExport } from "@/components/menu-settings/DataImportExport";
import { useTimerStore } from "@/store/timerStore";
import Folder from "@/icons/Folder";
import Shield from "@/icons/Shield";
import Link from "next/link";
import useEscape from "@/hooks/useEscape";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import CustomTheme from "./CustomTheme";
import { useTranslations } from "next-intl";
import MenuSelectLanguage from "./MenuSelectLanguage";

export default function MenuSettings() {
  const { settingsOpen, setSettingsOpen, settings, setSettings } =
    useSettingsModalStore();

  const { isSolving } = useTimerStore();
  const t = useTranslations("Index.Settings-menu");

  useEscape(() => setSettingsOpen(false));
  console.log(settings);

  const handleChangeLang = (code: any) => {
    const newSettings = { ...settings };
    newSettings.locale.language.lang = code;
    window.localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  return (
    <>
      <AnimatePresence>
        {settingsOpen && !isSolving ? (
          <div className="absolute z-10 flex w-full h-full overflow-auto">
            <motion.div
              initial={{ x: -400, opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0.6 }}
              transition={{ type: "lineal" }}
              className="flex flex-col w-full gap-3 overflow-auto bg-neutral-50 text-zinc-800 sm:w-96 light"
            >
              <div className="flex items-center my-3">
                <Link
                  href={"/"}
                  onClick={() => setSettingsOpen(false)}
                  className="flex items-center cursor-pointer ms-3"
                >
                  <ArrowLeft />
                </Link>
                <div className="flex-1 text-2xl font-medium text-center">
                  {t("title")}
                </div>
              </div>

              <MenuSelectLanguage settings={settings} />

              <MenuSection icon={<Clock />} title={t("title")}>
                <MenuOption
                  setting={settings.timer.inspection}
                  label={"Inspection"}
                />
                <MenuOption
                  setting={settings.timer.startCue}
                  label={"startCue"}
                />
                <MenuOption
                  setting={settings.timer.holdToStart}
                  label={"holdToStart"}
                />
                <MenuOption
                  setting={settings.timer.manualMode}
                  label={"manualMode"}
                />
              </MenuSection>

              <MenuSection icon={<CpuChip />} title={t("features")}>
                <MenuOption
                  setting={settings.features.scrambleImage}
                  label={"scrambleImage"}
                />
                <MenuOption
                  setting={settings.features.sessionStats}
                  label={"sessionStats"}
                />
                <MenuOption
                  setting={settings.features.quickActionButtons}
                  label={"quickActionButtons"}
                />
                <MenuOption
                  setting={settings.features.hideWhileSolving}
                  label={"hideWhileSolving"}
                />
                <MenuOption
                  setting={settings.features.scrambleBackground}
                  label={"scrambleBackground"}
                />
              </MenuSection>

              <MenuSection icon={<BellAlert />} title={t("alerts")}>
                <MenuOption
                  setting={settings.alerts.bestTime}
                  label={"bestTime"}
                />
                <MenuOption
                  setting={settings.alerts.bestAverage}
                  label={"bestAverage"}
                />

                <MenuOption
                  setting={settings.alerts.worstTime}
                  label={"worstTime"}
                />
              </MenuSection>

              <MenuSection icon={<Sparkles />} title={t("theme")}>
                <ThemeSelect />
                <CustomTheme />
              </MenuSection>

              <MenuSection icon={<Folder />} title={t("data")}>
                <DataImportExport />
              </MenuSection>
              <MenuSection icon={<Shield />} title={t("about")}>
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image
                    src={"/brand_logo.svg"}
                    alt="logo"
                    width={320}
                    height={100}
                  />

                  <div className="text-center w-11/12 italic">
                    &rdquo;{t("legend")}&rdquo;
                  </div>

                  <div className="flex gap-3 underline">
                    <Link
                      href="https://github.com/bryanlundberg/NexusTimer/issues"
                      target="_blank"
                      className="hover:text-zinc-500 text-blue-600 transition duration-300"
                    >
                      {t("suggest")}
                    </Link>
                    <Link
                      href="https://github.com/bryanlundberg/NexusTimer/issues"
                      target="_blank"
                      className="hover:text-zinc-500 text-blue-600 transition duration-300"
                    >
                      {t("report-bug")}
                    </Link>
                  </div>
                </div>
              </MenuSection>
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
