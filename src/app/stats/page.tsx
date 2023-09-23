"use client";

import CategoryStatistics from "@/components/CategoryStatistics";
import PersonalStatistics from "@/components/PersonalStatistics";
import { useState } from "react";

type PersonalStatisticsTab = "Personal" | "Category";

export default function StatsPage() {
  const [currentTab, setCurrentTab] =
    useState<PersonalStatisticsTab>("Personal");
  console.log(currentTab);

  return (
    <div className="grow w-full md:max-w-6xl mx-auto flex flex-col border border-zinc-800 rounded-md min-h-full">
      <div className="border-b border-zinc-800 py-4 ">
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mx-3">
            <div className="font-medium text-2xl">Metrics</div>
            <select
              onChange={(e) => {
                if (e.target.value === "Personal") setCurrentTab("Personal");
                if (e.target.value === "Category") setCurrentTab("Category");
              }}
              value={currentTab}
              name="metrics"
              id="select-metrics"
              className="bg-zinc-900 border rounded-md p-1 border-zinc-800 w-28"
            >
              <option value="Personal">Personal</option>
              <option value="Category">Category</option>
            </select>
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
