"use client";
import { getLastBackup } from "@/actions/actions";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllCubes } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();

  const handleDownloadData = async () => {
    if (!session || !session.user || !session.user.email) return;

    // Get backup from server
    const backup = await getLastBackup({ email: session.user.email });

    // Transform response plain text into JS, removing _id field
    if (!backup) return;

    const parsedBackup = JSON.parse(backup);
    const cloudBackup = JSON.parse(parsedBackup.data);

    if (cloudBackup.length === 0) return;

    // Get local data from indexDB

    const cubes = await getAllCubes();

    if (!cubes) return;

    // Create new backup object

    const newBackup: Cube[] = [...cubes];

    cloudBackup.forEach((cubeCloud: Cube) => {
      let addedCube = false;
      cubes.forEach((cubeLocal: Cube) => {
        // Compare cube x cube
        if (cubeCloud.id === cubeLocal.id) {
          // merge all solves from both local and cloud (session/historial)
          const solves = [
            ...cubeLocal.solves.all,
            ...cubeCloud.solves.all,
            ...cubeLocal.solves.session,
            ...cubeCloud.solves.session,
          ];

          // remove duplicate solves
          const uniqueSolves = Array.from(
            new Map(solves.map((solve) => [solve.id, solve])).values()
          );

          // Create a copy of local cube to help maintain category, name, createdAt, etc...
          const newCubeData: Cube = {
            ...cubeLocal,
            solves: { all: uniqueSolves, session: [] },
          };

          // Finds the index of the local cube into the new backup
          const cubeLocalIndex = newBackup.findIndex(
            (c) => c.id === cubeLocal.id
          );

          if (cubeLocalIndex !== -1) {
            // If exists updates the local cube object with new solves data
            newBackup[cubeLocalIndex] = newCubeData;
          } else {
          }
        }
      });
      if (!addedCube) {
        newBackup.push(cubeCloud);
      }
    });

    // Clear app storage

    // Replace storage with new Object Backup

    // Update global state

    // redirect account page
  };

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

          <Button className="w-full" onClick={handleDownloadData}>
            Continue
          </Button>
        </div>
      </Card>
    </>
  );
}
