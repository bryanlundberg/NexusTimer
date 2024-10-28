"use client";
import { createBackup } from "@/actions/actions";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllCubes } from "@/db/dbOperations";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) redirect("/settings");
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
          <Button
            onClick={async () => {
              const cubes = await getAllCubes();
              if (!cubes) return; // send toast error to screen
              const backup = await createBackup({
                email: session.user?.email as string,
                data: JSON.stringify(cubes),
              });

              if (!backup) return; // send toast error to screen
              router.push("/settings/account");
            }}
          >
            Continue
          </Button>
        </div>
      </Card>
    </>
  );
}
