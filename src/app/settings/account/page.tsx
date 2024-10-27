"use client";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AccountHeader from "@/components/account/account-header/account-header";
import Link from "next/link";
import AccountNotAuth from "@/components/account/account-not-auth/account-not-auth";

export default function Page() {
  const { data: session } = useSession();

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
            Save
          </Button>
        </Link>

        <Link href={"./account/load"} className="w-full">
          <Button className="w-full" variant={"secondary"}>
            Load
          </Button>
        </Link>

        <Button
          className="w-full"
          variant={"destructive"}
          onClick={() => signOut({ redirectTo: "/" })}
        >
          Logout
        </Button>

        <div>Last update, 9 minutes ago</div>
      </div>
    </>
  );
}
