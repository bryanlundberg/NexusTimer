import { useTranslations } from "next-intl";

export default function EmptyStatistics() {
  const t = useTranslations("Index.StatsPage");

  return (
    <div className="flex flex-col items-center justify-center grow">
      <h2 className="text-2xl font-bold mb-4 text-center text-balance">{t("empty-statistics")}</h2>
      <p className="text-gray-600 text-center text-balance">{t("empty-statistics-description")}</p>
    </div>
  );
}
