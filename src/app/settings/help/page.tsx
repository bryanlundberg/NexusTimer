"use client";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <AccountHeader back="./" label="Help" />

      <div className="flex flex-col gap-2">
        <Link href={"./help/privacy-policy"} className="w-full">
          <Button variant={"secondary"} className="w-full">
            Privacy Policy
          </Button>
        </Link>

        <Link
          href={"https://github.com/bryanlundberg/NexusTimer"}
          className="w-full"
        >
          <Button variant={"secondary"} className="w-full">
            Source
          </Button>
        </Link>
      </div>
    </>
  );
}
