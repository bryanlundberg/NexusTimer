"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AccountHeader from "@/components/account/account-header/account-header";
import Link from "next/link";
import ButtonGoogle from "@/components/buttons/button-google/button-google";

export default function Page() {
  const { data: session } = useSession();

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
      </div>
    </>
  );
}
