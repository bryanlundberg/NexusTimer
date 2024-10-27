"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AccountHeader from "@/components/account/account-header/account-header";
import Link from "next/link";
import ButtonGoogle from "@/components/buttons/button-google/button-google";
import Logo from "@/components/logo/logo";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
export default function Page() {
  const { data: session } = useSession();
  const t = useTranslations("Index.Settings-menu");
  return (
    <>
      <AccountHeader back="/" label="Settings" />
      <div className="flex flex-col gap-3 justify-center items-center">
        {session ? (
          <>
            <Link href={"/settings/account"} className="w-full">
              <Button className="w-full">Account</Button>
            </Link>
          </>
        ) : (
          <>
            <ButtonGoogle />
          </>
        )}

        <Link href={"/settings/options"} className="w-full">
          <Button className="w-full">Options</Button>
        </Link>
        <Link href={"/settings/help"} className="w-full">
          <Button className="w-full">Help</Button>
        </Link>

        <div className="flex flex-col justify-center items-center gap-3">
          <Logo className="my-3 mt-10" />

          <div className="text-center w-11/12 italic mx-auto text-sm">
            &rdquo;{t("legend")}&rdquo;
          </div>

          <div className="flex gap-3 underline">
            <Link
              href={"https://github.com/bryanlundberg/NexusTimer/issues"}
              target="_blank"
            >
              <Button variant={"link"}>
                {t("suggest")}
                <ExternalLinkIcon />
              </Button>
            </Link>

            <Link
              href={"https://github.com/bryanlundberg/NexusTimer/issues"}
              target="_blank"
            >
              <Button variant={"link"}>
                {t("report-bug")}
                <ExternalLinkIcon />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
