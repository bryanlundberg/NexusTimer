"use client";

import { MenuSection } from "./MenuSection";
import { useLocale, useTranslations } from "next-intl";
import { languages } from "@/lib/const/languages";
import { useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { Button } from "../button";
import useClickOutside from "@/hooks/useClickOutside";
import useOpenClose from "@/hooks/useOpenClose";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MenuSelectLanguage() {
  const { isOpen, close, toggle } = useOpenClose(false);
  const componentRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(componentRef, () => close());
  const { setSettingsOpen } = useSettingsModalStore();
  const t = useTranslations("Index.Settings-menu");
  const router = useRouter();
  const locale = useLocale();

  function handleLanguageChange(event: any) {
    const nextLocale = event;
    setSettingsOpen(false);
    router.replace(`${window.location.origin}/${nextLocale}`);
  }
  const localeData = (locale: string) => {
    const language = languages.find((item) => item.code === locale);
    if (!language) return languages[0];
    return language;
  };

  const labelData = localeData(locale)?.name.toString();
  const flagIcon = localeData(locale)?.flag;
  return (
    <>
      <MenuSection
        icon={<GlobeAltIcon className="w-6 h-6" />}
        title={t("locale")}
      >
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
