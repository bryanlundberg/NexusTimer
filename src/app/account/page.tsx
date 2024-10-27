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
      <AccountHeader back="/" label="Account" />
      <div className="flex flex-col gap-3 justify-center items-center">
        <Avatar className="size-20">
          <AvatarImage src={session.user?.image as string} />
          <AvatarFallback>
            {session.user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="font-mono">{session.user?.email}</div>

        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() => router.push("/account/save")}
        >
          Save (merge)
        </Button>

        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() => router.push("/account/load")}
        >
          Load (overwrite)
        </Button>

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
