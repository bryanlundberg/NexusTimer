"use client";

import { MenuSection } from "./MenuSection";
import { useLocale, useTranslations } from "next-intl";
import { languages } from "@/lib/const/languages";
import { useRef } from "react";
import { useRouter } from "@/navigation";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { Button } from "../button";
import useClickOutside from "@/hooks/useClickOutside";
import useOpenClose from "@/hooks/useOpenClose";

export default function MenuSelectLanguage() {
  const { isOpen, close } = useOpenClose(false);
  const componentRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(componentRef, () => close());
  const { setSettingsOpen } = useSettingsModalStore();
  const t = useTranslations("Index.Settings-menu");
  const router = useRouter();
  const locale = useLocale();

  function onSelectChange(event: any) {
    const nextLocale = event.target.id;
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
            <Button
              onClick={() => close()}
              label={labelData}
              icon={flagIcon}
              className="min-w-32 max-w-40 text-black font-mono"
              minimalistic={false}
            />

            {/* menu options */}

            {isOpen && (
              <div
                ref={componentRef}
                className="absolute top-10 right-0 border bg-white z-10 w-full max-h-96 overflow-auto"
              >
                {languages.map((item) => {
                  return (
                    <div
                      key={item.code}
                      id={item.code}
                      className="flex items-center gap-2 p-2 hover:bg-neutral-100 hover:cursor-pointer"
                      onClick={(e: any) => onSelectChange(e)}
                    >
                      {item.flag}
                      {item.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </MenuSection>
    </>
  );
}
