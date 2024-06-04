import { MenuSection } from "./MenuSection";
import { useLocale, useTranslations } from "next-intl";
import { languages } from "@/lib/const/languages";
import { sort } from "fast-sort";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { GlobeAltIcon, LanguageIcon } from "@heroicons/react/24/solid";

export default function MenuSelectLanguage() {
  const { setSettingsOpen } = useSettingsModalStore();
  const t = useTranslations("Index.Settings-menu");
  const router = useRouter();
  const locale = useLocale();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    setSettingsOpen(false);
    router.replace(`${window.location.origin}/${nextLocale}`);
  }

  return (
    <>
      <MenuSection
        icon={<GlobeAltIcon className="w-6 h-6" />}
        title={t("locale")}
      >
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
