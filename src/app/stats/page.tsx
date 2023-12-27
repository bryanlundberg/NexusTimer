"use client";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { OverallContainer } from "@/components/OverallContainer";
import { OverallHeader } from "@/components/OverallHeader";
import CategoryStatistics from "@/components/stats/CategoryStatistics";

export default function StatsPage() {
  const { lang } = useSettingsModalStore();

  return (
    <>
      <OverallContainer>
        <OverallHeader title={translation.solves["header"][lang]} />
        <CategoryStatistics />
      </OverallContainer>
    </>
  );
}
