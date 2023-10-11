"use client";
import ArrowLeft from "@/icons/ArrowLeft";
import Toggle from "@/components/headless/Toggle";
import Language from "@/icons/Language";
import CpuChip from "@/icons/CpuChip";
import BellAlert from "@/icons/BellAlert";
import Clock from "@/icons/Clock";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import genId from "@/lib/genId";
import { langCollection } from "@/lib/langCollection";
import translation from "@/translations/global.json";
import { Settings } from "@/interfaces/Settings";
import { sort } from "fast-sort";
import Sparkles from "@/icons/Sparkles";
import ThemeSelect from "./ThemeSelect";

export default function SettingsMenu() {
  const { setSettingsOpen, settings, setSettings, lang } =
    useSettingsModalStore();
  const handleChangeLang = (tagLang: any) => {
    const newSettings = { ...settings };

    newSettings.locale.language.lang = tagLang;

    window.localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  return (
    <>
      <div className="absolute z-10 flex flex-col w-full h-screen gap-3 overflow-auto transition bg-neutral-50 text-zinc-800 grow sm:w-96">
        <div className="flex items-center my-3">
          <div
            onClick={() => setSettingsOpen(false)}
            className="flex items-center cursor-pointer ms-3"
          >
            <ArrowLeft />
          </div>
          <div className="flex-1 text-2xl font-medium text-center">
            {translation.settings["settings"][lang]}
          </div>
        </div>

        <Section
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
        </Section>
        <Section icon={<Clock />} title={translation.settings["timer"][lang]}>
          {Object.values(settings.timer).map((item) => (
            <Option
              key={genId()}
              status={item.status}
              label={translation.settings[item.key as keyof Settings][lang]}
              read={translation.settings[item.key as keyof Settings][lang]}
              id={item.key}
            />
          ))}
        </Section>

        <Section
          icon={<CpuChip />}
          title={translation.settings["features"][lang]}
        >
          {Object.values(settings.features).map((item) => (
            <Option
              key={genId()}
              status={item.status}
              label={translation.settings[item.key as keyof Settings][lang]}
              read={translation.settings[item.key as keyof Settings][lang]}
              id={item.key}
            />
          ))}
        </Section>

        <Section
          icon={<BellAlert />}
          title={translation.settings["alerts"][lang]}
        >
          {Object.values(settings.alerts).map((item) => (
            <Option
              key={genId()}
              status={item.status}
              label={translation.settings[item.key as keyof Settings][lang]}
              read={translation.settings[item.key as keyof Settings][lang]}
              id={item.key}
            />
          ))}
        </Section>

        <Section
          icon={<Sparkles />}
          title={translation.settings["theme"][lang]}
        >
          <ThemeSelect />
        </Section>
      </div>
    </>
  );
}

function Section({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex mb-3 font-medium text-blue-500">
        <div className="w-6 mx-3">{icon}</div>
        <div className="w-full">{title}</div>
      </div>
      {children}
    </div>
  );
}

function Option({
  label,
  status,
  read,
  id,
}: {
  label: string;
  status: boolean;
  read: string;
  id: string;
}) {
  return (
    <div className="flex justify-between mb-1">
      <div className="ms-12">{label}</div>
      <div className="me-6">
        <Toggle status={status} read={read} id={id} />
      </div>
    </div>
  );
}
