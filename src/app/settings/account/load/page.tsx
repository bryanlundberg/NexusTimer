"use client";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <AccountHeader back="./" label="Load data" />

      <Card className="p-3 bg-secondary/10">
        <p>
          Do you want to <span className="text-green-700">download</span> your
          account data from the <span className="text-blue-700">cloud</span>?
        </p>
        <p className="text-yellow-600">
          This will merge current data with saved data.
        </p>

        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link href={"./"} className="w-full">
            <Button className="w-full" variant={"secondary"}>
              Back
            </Button>
          </Link>

          <Button className="w-full">Continue</Button>
        </div>
      </Card>
    </>
  );
}
