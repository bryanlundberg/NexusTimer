"use client";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Page() {
  const t = useTranslations("Index");
  return (
    <>
      <AccountHeader back="./" label="Help" />

      <div className="flex flex-col gap-2">
        <Link href={"./help/privacy-policy"} className="w-full">
          <Button variant={"secondary"} className="w-full">
            {t("SettingsPage.privacy-policy")}
          </Button>
        </Link>

        <Link href={"./help/terms-of-service"} className="w-full">
          <Button variant={"secondary"} className="w-full">
            {t("SettingsPage.tos")}
          </Button>
        </Link>

        <Link
          href={"https://github.com/bryanlundberg/NexusTimer"}
          className="w-full"
        >
          <Button variant={"secondary"} className="w-full">
            {t("SettingsPage.source")}
          </Button>
        </Link>
      </div>
    </>
  );
}
