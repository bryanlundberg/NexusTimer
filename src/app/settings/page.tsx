"use client";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import AccountHeader from "@/components/account/account-header/account-header";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) redirect("/");

  return (
    <>
      <AccountHeader back="/" label="Settings" />
      <div className="flex flex-col gap-3 justify-center items-center">
        <Button
          className="w-full"
          onClick={() => router.push("/settings/account")}
        >
          Account
        </Button>

        <Button
          className="w-full"
          onClick={() => router.push("/settings/options")}
        >
          Options
        </Button>

        <Button
          className="w-full"
          onClick={() => router.push("/settings/help")}
        >
          Help
        </Button>
      </div>
    </>
  );
}
