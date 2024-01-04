import ArrowLeft from "@/icons/ArrowLeft";
import Language from "@/icons/Language";
import CpuChip from "@/icons/CpuChip";
import BellAlert from "@/icons/BellAlert";
import Clock from "@/icons/Clock";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import genId from "@/lib/genId";
import { langCollection } from "@/lib/const/langCollection";
import translation from "@/translations/global.json";
import { Settings } from "@/interfaces/Settings";
import { sort } from "fast-sort";
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

export default function MenuSettings() {
  const { settingsOpen, setSettingsOpen, settings, setSettings, lang } =
    useSettingsModalStore();
  const handleChangeLang = (tagLang: any) => {
    const newSettings = { ...settings };
    newSettings.locale.language.lang = tagLang;
    window.localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };
  const { isSolving } = useTimerStore();

  useEscape(() => setSettingsOpen(false));

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
              className="flex flex-col w-full gap-3 overflow-auto bg-neutral-50 text-zinc-800 sm:w-96"
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
                  {translation.settings["settings"][lang]}
                </div>
              </div>

              <MenuSection
                icon={<Language />}
                title={translation.settings["locale"][lang]}
              >
                <div className="flex justify-between">
                  <div className="ms-12">
                    {translation.settings["language"][lang]}
                  </div>
                  <div className="me-6">
                    <select
                      value={lang}
                      className="px-2 py-1 bg-gray-200 rounded-md outline-none w-36"
                      onChange={(e) => handleChangeLang(e.target.value)}
                    >
                      {sort(langCollection)
                        .asc((u) => u.name)
                        .map((lang) => {
                          return (
                            <option key={genId()} value={lang.tag}>
                              {lang.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </MenuSection>
              <MenuSection
                icon={<Clock />}
                title={translation.settings["timer"][lang]}
              >
                {Object.values(settings.timer).map((item) => (
                  <MenuOption
                    key={genId()}
                    status={item.status}
                    label={
                      translation.settings[item.key as keyof Settings][lang]
                    }
                    read={
                      translation.settings[item.key as keyof Settings][lang]
                    }
                    id={item.key}
                  />
                ))}
              </MenuSection>

              <MenuSection
                icon={<CpuChip />}
                title={translation.settings["features"][lang]}
              >
                {Object.values(settings.features).map((item) => (
                  <MenuOption
                    key={genId()}
                    status={item.status}
                    label={
                      translation.settings[item.key as keyof Settings][lang]
                    }
                    read={
                      translation.settings[item.key as keyof Settings][lang]
                    }
                    id={item.key}
                  />
                ))}
              </MenuSection>

              <MenuSection
                icon={<BellAlert />}
                title={translation.settings["alerts"][lang]}
              >
                {Object.values(settings.alerts).map((item) => (
                  <MenuOption
                    key={genId()}
                    status={item.status}
                    label={
                      translation.settings[item.key as keyof Settings][lang]
                    }
                    read={
                      translation.settings[item.key as keyof Settings][lang]
                    }
                    id={item.key}
                  />
                ))}
              </MenuSection>

              <MenuSection
                icon={<Sparkles />}
                title={translation.settings["theme"][lang]}
              >
                <ThemeSelect />
              </MenuSection>

              <MenuSection
                icon={<Folder />}
                title={translation.settings["data"][lang]}
              >
                <DataImportExport />
              </MenuSection>
              <MenuSection
                icon={<Shield />}
                title={translation.settings["about"][lang]}
              >
                <div className="flex flex-col justify-center items-center gap-3">
                  <Image
                    src={"/brand_logo.svg"}
                    alt="logo"
                    width={320}
                    height={100}
                  />

                  <div className="text-center w-11/12 italic">
                    &rdquo;{translation.settings["legend"][lang]}&rdquo;
                  </div>

                  <div className="flex gap-3 underline">
                    <Link
                      href="https://github.com/bryanlundberg/NexusTimer/issues"
                      target="_blank"
                      className="hover:text-zinc-500 text-blue-600 transition duration-300"
                    >
                      {translation.settings["suggest"][lang]}
                    </Link>
                    <Link
                      href="https://github.com/bryanlundberg/NexusTimer/issues"
                      target="_blank"
                      className="hover:text-zinc-500 text-blue-600 transition duration-300"
                    >
                      {translation.settings["report-bug"][lang]}
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
