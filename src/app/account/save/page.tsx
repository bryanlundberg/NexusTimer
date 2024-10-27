"use client";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <AccountHeader back="/account" label="Save data" />

      <Card className="p-3 bg-secondary">
        <p>
          Do you want <span className="text-green-700">save</span> your account
          data on the <span className="text-blue-700">cloud</span>?
        </p>
        <p className="text-yellow-600">
          This will overwrite previously saved data.
        </p>

        <div className=" flex gap-2 w-full justify-center mt-5">
          <Button onClick={() => router.push("/account")}>Back</Button>
          <Button>Continue</Button>
        </div>
      </Card>
    </>
  );
}
