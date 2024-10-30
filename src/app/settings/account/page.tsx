"use client";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AccountHeader from "@/components/account/account-header/account-header";
import Link from "next/link";
import AccountNotAuth from "@/components/account/account-not-auth/account-not-auth";
import AccountLastBackup from "@/components/account/account-last-backup/account-last-backup";
import { useTranslations } from "next-intl";

export default function Page() {
  const { data: session } = useSession();
  const t = useTranslations("Index");
  if (!session) {
    return <AccountNotAuth />;
  }

  return (
    <>
      <AccountHeader back="/settings" label="Account" />
      <div className="flex flex-col gap-3 justify-center items-center">
        <Avatar className="size-20">
          <AvatarImage src={session.user?.image as string} />
          <AvatarFallback>
            {session.user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="font-mono">{session.user?.email}</div>

        <Link href={"./account/save"} className="w-full">
          <Button className="w-full" variant={"secondary"}>
            {t("SettingsPage.save")}
          </Button>
        </Link>

        <Link href={"./account/load"} className="w-full">
          <Button className="w-full" variant={"secondary"}>
            {t("SettingsPage.load")}
          </Button>
        </Link>

        <Button
          className="w-full"
          variant={"destructive"}
          onClick={() => signOut({ redirectTo: "/" })}
        >
          {t("SettingsPage.logout")}
        </Button>

        <AccountLastBackup session={session} />
      </div>
    </>
  );
}
