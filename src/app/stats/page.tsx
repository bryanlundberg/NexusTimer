"use client";
import CategoryStatistics from "@/components/CategoryStatistics";
import PersonalStatistics from "@/components/PersonalStatistics";
import SelectMetrics from "@/components/SelectMetrics";
import { useEffect, useState } from "react";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function StatsPage() {
  const { settings } = useSettingsModalStore();

  const [currentTab, setCurrentTab] = useState(
    translation.metrics["header-select"]["personal"][settings.locale[0].lang]
  );

  const options = [
    translation.metrics["header-select"]["personal"][settings.locale[0].lang],
    translation.metrics["header-select"]["category"][settings.locale[0].lang],
  ];

  useEffect(() => {
    setCurrentTab(
      translation.metrics["header-select"]["personal"][settings.locale[0].lang]
    );
  }, [settings]);

  const handleChange = (view: any) => {
    setCurrentTab(view);
  };

  return (
    <div className="mt-3 grow w-full md:max-w-6xl mx-auto flex flex-col xl:border border-zinc-800 rounded-md min-h-full">
      <div className="border-b border-zinc-800 py-4 ">
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mx-3 gap-3">
            <div className="font-medium text-2xl">
              {translation.metrics["header"][settings.locale[0].lang]}
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
      translation.metrics["header-select"]["personal"][
        settings.locale[0].lang
      ] ? (
        <PersonalStatistics />
      ) : (
        <CategoryStatistics />
      )}
    </div>
  );
}
