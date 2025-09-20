"use client";
import AccountHeader from "@/components/account/account-header/account-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTimerStore } from "@/store/timerStore";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { importNexusTimerData } from '@/lib/importDataFromFile';
import { useSyncBackup } from '@/hooks/useSyncBackup';
import { useNXData } from '@/hooks/useNXData';
import { toast } from 'sonner';
import { useUser } from '@/hooks/api/useUser';
import { decompressSync, strFromU8 } from 'fflate';

export default function Page() {
  const { clearCubes, getAllCubes, saveBatchCubes } = useNXData();
  const t = useTranslations("Index");
  const { data: session } = useSession();
  const router = useRouter();
  const setCubes = useTimerStore((state) => state.setCubes);
  const { syncBackup } = useSyncBackup();
  const { data: user } = useUser(session?.user?.id!);

  const handleDownloadData = async () => {
    if (!session || !session.user || !session.user.email) return;

    try {
      if (!user?.backup?.url) {
        toast.error("No backup found for this user.");
        return;
      }

      const doc = await fetch(`${user.backup.url}`);
      const compressed = new Uint8Array(await doc.arrayBuffer());

      const decompressed = decompressSync(compressed);
      const data = strFromU8(decompressed);

      const backupData = importNexusTimerData(data);
      const existingCubes = await getAllCubes();

      const newCubes = await syncBackup(backupData, existingCubes);
      await clearCubes();
      await saveBatchCubes(newCubes);
      setCubes(newCubes);
      router.push("/app");
      toast.success("Backup loaded successfully!");
    } catch (error) {
      console.error('Error loading backup:', error);
    }
  };

  return (
    <>
      <AccountHeader back="/app" label={t("SettingsPage.load-data-title")} />

      <Card className="p-3 bg-secondary/10">
        <p>{t("SettingsPage.load-data-description")}</p>
        <p className="text-yellow-600">{t("SettingsPage.load-data-warning")}</p>

        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link href={"/account"} className="flex-1">
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
