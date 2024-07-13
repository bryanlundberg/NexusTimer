import { MenuSection } from "./MenuSection";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { ChevronUpDownIcon, HeartIcon } from "@heroicons/react/24/solid";
import useClickOutside from "@/hooks/useClickOutside";
import { useTimerStore } from "@/store/timerStore";
import { MiniatureIcon } from "../Select";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";
import { AnimatePresence, motion } from "framer-motion";
import loadSettings from "@/lib/loadSettings";
import { Cube } from "@/interfaces/Cube";

export default function MenuSelectPreferences() {
  const { settings, setSettings } = useSettingsModalStore();
  const t = useTranslations("Index");

  const [open, setOpen] = useState(false);
  const { cubes } = useTimerStore();
  const componentRef = useRef<HTMLDivElement | null>(null);
  const { backgroundImage } = useBackgroundImageStore();

  const handleClose = () => {
    setOpen(false);
  };

  const handleCubeSelect = (cube: Cube | null) => {
    const currentSettings = loadSettings();
    currentSettings.preferences.defaultCube.cube = cube;
    setSettings(currentSettings);
    window.localStorage.setItem("settings", JSON.stringify(currentSettings));
    handleClose();
  };

  useClickOutside(componentRef, handleClose);

  return (
    <MenuSection
      icon={<HeartIcon className="w-6 h-6" />}
      title={t("Settings-menu.preferences")}
    >
      <div className="flex justify-between me-6">
        <div className="ms-12">{t("Settings-menu.default-cube")}</div>
        <div
          className="flex justify-end relative sm:w-[400px]"
          ref={componentRef}
        >
          <button
            onClick={() => setOpen(!open)}
            className={`grow text-md appearance-none max-w-40 border font-medium rounded-md px-3 transition duration-200 light:shadow-black  light:hover:bg-neutral-200 dark:hover:bg-zinc-800 dark:hover:border-zinc-500 light:hover:border-neutral-400 h-10 ${
              backgroundImage ? "opacity-90 hover:opacity-100" : ""
            } ${
              open
                ? "dark:bg-zinc-800 dark:border-zinc-500 light:bg-neutral-200 light:border-neutral-400"
                : "dark:bg-zinc-900 dark:border-zinc-600 light:bg-neutral-100 light:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              {settings.preferences.defaultCube.cube && (
                <MiniatureIcon
                  category={settings.preferences.defaultCube.cube.category}
                />
              )}
              <div>
                {settings.preferences.defaultCube.cube
                  ? settings.preferences.defaultCube.cube.name
                  : t("Inputs.none")}
              </div>
              <ChevronUpDownIcon className="w-5 h-5" />
            </div>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ y: 0, scale: 0.9, opacity: 0.8 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ x: 0, scale: 0.9, opacity: 0 }}
                id="list-options"
                className="absolute z-40 overflow-auto max-h-[400px] p-1 top-12 mt-1 right-0 w-full h-auto border rounded-md light:bg-neutral-200 light:border-neutral-400 light:text-neutral-900 dark:bg-zinc-900 dark:border-zinc-700 dark:text-slate-100"
              >
                <div
                  onClick={() => handleCubeSelect(null)}
                  className="cursor-pointer transition duration-200 p-1 select-none rounded-md ps-2 flex items-center justify-between overflow-hidden light:bg-transparent light:text-neutral-900 light:hover:bg-neutral-500 light:hover:text-neutral-100 dark:bg-transparent dark:hover:bg-zinc-700 dark:text-neutral-50"
                >
                  <div className="flex justify-start gap-3">
                    <div className="overflow-hidden">{t("Inputs.none")}</div>
                  </div>
                </div>
                {cubes?.map((cube) => (
                  <div
                    key={cube.id}
                    onClick={() => handleCubeSelect(cube)}
                    className="cursor-pointer transition duration-200 p-1 select-none rounded-md ps-2 flex items-center justify-between overflow-hidden light:bg-transparent light:text-neutral-900 light:hover:bg-neutral-500 light:hover:text-neutral-100 dark:bg-transparent dark:hover:bg-zinc-700 dark:text-neutral-50"
                  >
                    <div className="flex justify-start gap-3">
                      <MiniatureIcon category={cube.category} />
                      <div className="overflow-hidden">{cube.name}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MenuSection>
  );
}
