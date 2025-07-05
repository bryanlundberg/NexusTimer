"use client";
import { getLastBackup } from "@/actions/actions";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clearCubes, getAllCubes, saveBatchCubes } from '@/db/dbOperations';
import { Cube } from "@/interfaces/Cube";
import { useTimerStore } from "@/store/timerStore";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCubesDatesAndOrder, importNexusTimerData } from '@/lib/importDataFromFile';
import _, { uniqBy } from 'lodash';

export default function Page() {
  const t = useTranslations("Index");
  const { data: session } = useSession();
  const router = useRouter();
  const { setCubes } = useTimerStore();
  const handleDownloadData = async () => {
    if (!session || !session.user || !session.user.email) return;

    const backup = await getLastBackup({ email: session.user.email });
    if (!backup) return;

    const jsonBackup = JSON.parse(backup);
    const backupData = importNexusTimerData(jsonBackup.data);
    const existingCubes = await getAllCubes();

    let newCubes = _.cloneDeep(existingCubes) as Cube[];

    for(let i = 0; i < backupData.length; i++) {
      const backupCube = backupData[i];
      const existingCube = newCubes.find(cube => cube.id === backupCube.id);

      if (existingCube) {
        newCubes[newCubes.indexOf(existingCube)].solves = {
          session: uniqBy([...existingCube.solves.session, ...backupCube.solves.session], 'id'),
          all: uniqBy([...existingCube.solves.all, ...backupCube.solves.all], 'id'),
        }
      } else {
        newCubes.push(backupCube);
      }
    }

    newCubes = formatCubesDatesAndOrder(newCubes);

    await clearCubes();
    await saveBatchCubes(newCubes);
    setCubes(newCubes);
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
