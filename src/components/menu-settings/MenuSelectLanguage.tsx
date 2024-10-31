"use client";

import { MenuSection } from "./MenuSection";
import { useLocale, useTranslations } from "next-intl";
import { languages } from "@/lib/const/languages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobeIcon } from "@radix-ui/react-icons";
import { syncTranslations } from "@/actions/language";

export default function MenuSelectLanguage() {
  const t = useTranslations("Index.Settings-menu");
  const locale = useLocale();

  return (
    <>
      <MenuSection icon={<GlobeIcon />} title={t("locale")}>
        <div className="mx-3 flex items-center justify-between">
          <div className="grow">{t("language")}</div>
          <Select defaultValue={locale} onValueChange={syncTranslations}>
            <SelectTrigger className="w-[180px] bg-background">
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
      </MenuSection>
    </>
  );
}
