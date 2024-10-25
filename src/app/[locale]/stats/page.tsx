"use client";
import Navigation from "@/components/navigation/navigation";
import CategoryStatistics from "@/components/stats/CategoryStatistics";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Index");
  return (
    <>
      {/* container */}
      <div className="max-w-7xl mx-auto px-2 pt-2 flex flex-col w-full min-h-full overflow-auto">
        {/* header */}
        <Navigation />
        <CategoryStatistics />
      </div>
    </>
  );
}
