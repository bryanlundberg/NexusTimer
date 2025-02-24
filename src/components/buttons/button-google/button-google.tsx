"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function ButtonGoogle() {
  const t = useTranslations("Index");
  const { data: session } = useSession();
  return (
    <>
      {!session && (
        <>
          <Button
            className="flex gap-2 items-center w-full"
            onClick={() =>
              signIn("google", { redirectTo: "/settings/account" })
            }
          >
            <Image
              src={"/timer-logos/google.svg"}
              alt="google logo"
              width={20}
              height={20}
            />
            {t("Inputs.sign-in-google")}
          </Button>
        </>
      )}
    </>
  );
}
