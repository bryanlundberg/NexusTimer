"use client";

import { MenuSection } from "./MenuSection";
import { useLocale, useTranslations } from "next-intl";
import { languages } from "@/lib/const/languages";
import { useRouter } from "@/i18n/routing";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobeIcon } from "@radix-ui/react-icons";

export default function MenuSelectLanguage() {
  const { setSettingsOpen } = useSettingsModalStore();
  const t = useTranslations("Index.Settings-menu");
  const router = useRouter();
  const locale = useLocale();

  function handleLanguageChange(event: any) {
    const nextLocale = event;
    setSettingsOpen(false);
    router.replace(`${window.location.origin}/${nextLocale}`);
  }

  return (
    <>
      <MenuSection icon={<GlobeIcon />} title={t("locale")}>
        <div className="flex justify-between ">
          <div className="ms-12">{t("language")}</div>
          <div className="me-6 relative">
            <Select defaultValue={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((item) => {
                  return (
                    <SelectItem value={item.code} key={item.code}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </MenuSection>
    </>
  );
}
