"use client";
import { createOrUpdateBackup } from "@/actions/actions";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllCubes } from "@/db/dbOperations";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();
  const t = useTranslations("Index");
  const router = useRouter();
  if (!session) redirect("/settings");
  return (
    <>
      <AccountHeader back="./" label={t("SettingsPage.save-data-title")} />

      <Card className="p-3 bg-secondary/10">
        <p>{t("SettingsPage.save-data-description")}</p>
        <p className="text-yellow-600">{t("SettingsPage.save-data-warning")}</p>

        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link href={"./"} className="w-full">
            <Button variant={"secondary"} className="w-full">
              {t("Inputs.back")}
            </Button>
          </Link>
          <Button
            className="w-full"
            onClick={async () => {
              const cubes = await getAllCubes();
              if (
                !cubes ||
                !session ||
                !session.user ||
                typeof session.user.email !== "string"
              ) {
                return; // send toast error to screen
              }

              await createOrUpdateBackup({
                email: session.user.email,
                data: JSON.stringify(cubes),
              });

              router.push("/settings/account");
            }}
          >
            {t("Inputs.continue")}
          </Button>
        </div>
      </Card>
    </>
  );
}
