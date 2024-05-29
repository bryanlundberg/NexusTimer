import Language from "@/icons/Language";
import { MenuSection } from "./MenuSection";
import { useLocale, useTranslations } from "next-intl";
import { Settings } from "@/interfaces/Settings";
import { languages } from "@/lib/const/languages";
import { sort } from "fast-sort";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function MenuSelectLanguage({
  settings,
}: {
  settings: Settings;
}) {
  const t = useTranslations("Index.Settings-menu");
  const router = useRouter();
  const locale = useLocale();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    Cookies.set("NEXT_LOCALE", nextLocale);
    router.refresh();
  }

  return (
    <>
      <MenuSection icon={<Language />} title={t("locale")}>
        <div className="flex justify-between">
          <div className="ms-12">{t("language")}</div>
          <div className="me-6">
            <select
              value={locale}
              className="px-2 py-1 bg-gray-200 rounded-md outline-none w-36"
              onChange={(e: any) => onSelectChange(e)}
            >
              {sort(languages)
                .asc((u) => u.name)
                .map((lang) => {
                  return (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
      </MenuSection>
    </>
  );
}
