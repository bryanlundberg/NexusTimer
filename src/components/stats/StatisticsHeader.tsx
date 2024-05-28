import { useTranslations } from "next-intl";

export function StatisticHeader() {
  const t = useTranslations("Index");
  return (
    <>
      <div className="flex items-center h-10 p-1 font-medium rounded-md dark:bg-zinc-700 dark:text-zinc-200 light:bg-neutral-200 light:text-neutral-950">
        <div className="w-1/5"></div>
        <div className="w-1/5 text-center">{t("StatsPage.global")}</div>
        <div className="w-1/5 text-center">{t("StatsPage.sessions")}</div>
        <div className="w-1/5 text-center">C {t("SolvesPage.all")}</div>
        <div className="w-1/5 text-center">C {t("SolvesPage.session")}</div>
      </div>
    </>
  );
}
