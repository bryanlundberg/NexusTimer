"use client";
import CategoryStatistics from "@/components/CategoryStatistics";
import PersonalStatistics from "@/components/PersonalStatistics";
import SelectMetrics from "@/components/SelectMetrics";
import { useState } from "react";

type PersonalStatisticsTab = "Personal" | "Category";

export default function StatsPage() {
  const [currentTab, setCurrentTab] =
    useState<PersonalStatisticsTab>("Personal");

  const options = ["Personal", "Category"];

  const handleChange = (view: any) => {
    setCurrentTab(view);
  };

  return (
    <div className="mt-3 grow w-full md:max-w-6xl mx-auto flex flex-col xl:border border-zinc-800 rounded-md min-h-full">
      <div className="border-b border-zinc-800 py-4 ">
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mx-3 gap-3">
            <div className="font-medium text-2xl">Metrics</div>
            <SelectMetrics
              label={currentTab}
              options={options}
              handleChange={handleChange}
              extraClass="w-36 sm:w-56"
            />
          </div>
        </div>
      </div>
      {currentTab === "Personal" ? (
        <PersonalStatistics />
      ) : (
        <CategoryStatistics />
      )}
    </div>
  );
}
