import { useTranslations } from "next-intl";

export default function TableHeader() {
  const t = useTranslations("Index.CubesPage");
  return (
    <>
      <div className="table-header-group h-10 mb-10 text-sm font-medium border-b dark:bg-zinc-900 dark:text-zinc-200 light:bg-neutral-200 light:text-neutral-950">
        <div className="table-row">
          <div className="table-cell w-20 text-center align-middle">
            {t("favorite")}
          </div>
          <div className="table-cell text-left align-middle">{t("cube")}</div>
          <div className="table-cell text-center align-middle">
            {t("category")}
          </div>
          <div className="table-cell text-center align-middle">
            {t("solves")}
          </div>
          <div className="hidden text-center align-middle md:table-cell">
            {t("created-at")}
          </div>
          <div className="hidden text-center align-middle md:table-cell">
            {t("status")}
          </div>
          <div className="table-cell w-10 text-center align-middle sm:w-20"></div>
        </div>
      </div>
    </>
  );
}
