"use client";
import { getLastBackup } from "@/actions/actions";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteCubeById, getAllCubes, saveCube } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";
import { useTimerStore } from "@/store/timerStore";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const t = useTranslations("Index");
  const { data: session } = useSession();
  const router = useRouter();
  const { setCubes } = useTimerStore();
  const handleDownloadData = async () => {
    if (!session || !session.user || !session.user.email) return;

    // Get backup from server
    const backup = await getLastBackup({ email: session.user.email });
    if (!backup) return;

    // Transform response plain text into JS, removing _id field
    const parsedBackup = JSON.parse(backup);
    const cloudBackup = JSON.parse(parsedBackup.data);

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
          }

          addedCube = true;
        }
      });
      if (!addedCube) {
        newBackup.push(cubeCloud);
      }
    });

    // Clear app storage
    for (const c of cubes) {
      await deleteCubeById(c.id);
    }

    // Replace storage with new Object Backup
    for (const c of newBackup) {
      await saveCube({
        ...c,
      });
    }

    // Update global state
    const appData = await getAllCubes();
    if (appData) {
      setCubes(appData);
    }
    // redirect account page
    router.push("/");
  };

  return (
    <>
      <AccountHeader back="/" label={t("SettingsPage.load-data-title")} />

      <Card className="p-3 bg-secondary/10">
        <p>{t("SettingsPage.load-data-description")}</p>
        <p className="text-yellow-600">{t("SettingsPage.load-data-warning")}</p>

        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link href={"/"} className="flex-1">
            <Button className="w-full" variant={"secondary"}>
              {t("Inputs.back")}
            </Button>
          </Link>

          <Button className="flex-1" onClick={handleDownloadData}>
            {t("Inputs.continue")}
          </Button>
        </div>
      </Card>
    </>
  );
}
