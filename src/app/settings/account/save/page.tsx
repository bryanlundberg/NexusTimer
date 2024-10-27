"use client";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <AccountHeader back="./" label="Save data" />

      <Card className="p-3 bg-secondary/10">
        <p>
          Do you want <span className="text-green-700">save</span> your account
          data on the <span className="text-blue-700">cloud</span>?
        </p>
        <p className="text-yellow-600">
          This will overwrite previously saved data.
        </p>

        <div className=" flex gap-2 w-full justify-center mt-5">
          <Link href={"./"}>
            <Button>Back</Button>
          </Link>
          <Button>Continue</Button>
        </div>
      </Card>
    </>
  );
}
