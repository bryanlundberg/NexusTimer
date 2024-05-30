"use client";

import { OverallContainer } from "@/components/OverallContainer";
import { OverallHeader } from "@/components/OverallHeader";
import CategoryStatistics from "@/components/stats/CategoryStatistics";
import { useTranslations } from "next-intl";

export default function StatsPage() {
  const t = useTranslations("Index.StatsPage");

  return (
    <>
      <OverallContainer>
        <OverallHeader title={t("title")} />
        <CategoryStatistics />
      </OverallContainer>
    </>
  );
}
