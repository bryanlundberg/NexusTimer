import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import useClickOutside from "@/hooks/useClickOutside";
import { useTimerStore } from "@/store/timerStore";
import { MiniatureIcon } from "../Select";
import { AnimatePresence, motion } from "framer-motion";
import loadSettings from "@/lib/loadSettings";
import { Cube } from "@/interfaces/Cube";

export default function MenuSelectDefaultStartCube() {
  const { settings, setSettings } = useSettingsModalStore();
  const t = useTranslations("Index");

  const [open, setOpen] = useState(false);
  const { cubes } = useTimerStore();
  const componentRef = useRef<HTMLButtonElement | null>(null);

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

  const defaultCube = settings.preferences.defaultCube.cube;

  useClickOutside(componentRef, handleClose);

  return (
    <div className="flex justify-between items-center mb-1 w-full">
      <div className="ms-12">{t("Settings-menu.default-cube")}</div>
      <div className="relative me-6 w-fit mx-auto">
        <button
          onClick={() => setOpen(!open)}
          ref={componentRef}
          className={`text-md border rounded-md transition duration-200   hover:bg-neutral-200 text-neutral-950 hover:border-neutral-400 h-10 px-2 w-40
              ${
                open
                  ? "border-neutral-400 bg-neutral-200"
                  : "bg-neutral-50 border-neutral-200 "
              }`}
        >
          <div className="flex items-center gap-2">
            {defaultCube && <MiniatureIcon category={defaultCube.category} />}
            <div className="truncate" title={defaultCube?.name}>
              {defaultCube ? defaultCube.name : t("Inputs.none")}
            </div>
          </div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ y: 0, scale: 0.9, opacity: 0.8 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ x: 0, scale: 0.9, opacity: 0 }}
              id="list-options"
              className="absolute overflow-auto max-h-[400px] p-1 top-10 mt-1 right-0 w-full h-auto border rounded-md bg-neutral-200 border-neutral-400 text-neutral-900"
            >
              <div
                onClick={() => handleCubeSelect(null)}
                className={`cursor-pointer transition duration-200 p-1 select-none rounded-md ps-2 flex overflow-hidden ${
                  defaultCube === null
                    ? "bg-neutral-700 text-neutral-50"
                    : "text-neutral-900 hover:bg-neutral-500 hover:text-neutral-100"
                }`}
              >
                <div className="overflow-hidden">{t("Inputs.none")}</div>
              </div>
              {cubes?.map((cube) => (
                <div
                  key={cube.id}
                  onClick={() => handleCubeSelect(cube)}
                  className={`cursor-pointer transition duration-200 p-1 select-none rounded-md ps-2 flex overflow-hidden ${
                    defaultCube?.id === cube.id
                      ? "bg-neutral-700 text-neutral-50"
                      : "text-neutral-900 hover:bg-neutral-500 hover:text-neutral-100"
                  }`}
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
  );
}
