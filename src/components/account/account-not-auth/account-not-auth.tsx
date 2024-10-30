"use client";

import ButtonGoogle from "@/components/buttons/button-google/button-google";
import AccountHeader from "../account-header/account-header";
import { useTranslations } from "next-intl";

export default function AccountNotAuth() {
  const t = useTranslations("Index");
  return (
    <>
      <div className="max-w-md mx-auto bg-background/90 backdrop-blur-lg pt-2">
        <AccountHeader back="/settings" label={t("SettingsPage.account")} />

        <div className="space-y-2">
          <ButtonGoogle />
          <p className="text-center text-xs">
            {t("SettingsPage.not-authenticated")}
          </p>
        </div>
      </div>
    </>
  );
}
