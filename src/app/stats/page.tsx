"use client";
import CategoryStatistics from "@/components/CategoryStatistics";
import PersonalStatistics from "@/components/PersonalStatistics";
import SelectMetrics from "@/components/SelectMetrics";
import { useEffect, useState } from "react";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import Navigation from "@/components/Navigation";

export default function StatsPage() {
  const { settings, lang } = useSettingsModalStore();

  const [currentTab, setCurrentTab] = useState(
    translation.metrics["header-select"]["personal"][lang]
  );

  const options = [
    translation.metrics["header-select"]["personal"][lang],
    translation.metrics["header-select"]["category"][lang],
  ];

  useEffect(() => {
    setCurrentTab(translation.metrics["header-select"]["personal"][lang]);
  }, [settings, lang]);

  const handleChange = (view: any) => {
    setCurrentTab(view);
  };

  return (
    <>
      <div className="flex flex-col w-full min-h-full mx-auto mt-3 rounded-md grow md:max-w-6xl xl:border light:border-neutral-200 dark:border-zinc-800">
        <div className="py-4 border-b light:border-neutral-200 dark:border-zinc-800 ">
          <div className="w-full mx-auto">
            <div className="flex items-center justify-between gap-3 mx-3">
              <div className="text-2xl font-medium">
                {translation.metrics["header"][lang]}
              </div>
              <SelectMetrics
                label={currentTab}
                options={options}
                handleChange={handleChange}
                extraClass="w-36 sm:w-56"
              />
            </div>
          </div>
        </div>
        {currentTab ===
        translation.metrics["header-select"]["personal"][lang] ? (
          <PersonalStatistics />
        ) : (
          <CategoryStatistics />
        )}
      </div>
      <Navigation />
    </>
  );
}
