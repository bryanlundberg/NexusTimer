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
  const t = useTranslations("Index");
  const locale = useLocale();

  return (
    <>
      <MenuSection id="region" icon={<GlobeIcon />} title={t("Settings-menu.locale")}>
        <div className="mx-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="grow">{t("Settings-menu.language")}</div>
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
          <div className="text-xs text-muted-foreground">
            {t("Settings-descriptions.language-description")}
          </div>
        </div>
      </MenuSection>
    </>
  );
}
