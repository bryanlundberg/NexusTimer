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

export default function Page() {
  const { clearCubes, getAllCubes, saveBatchCubes } = useNXData();
  const t = useTranslations("Index");
  const { data: session } = useSession();
  const router = useRouter();
  const setCubes = useTimerStore((state) => state.setCubes);
  const { syncBackup } = useSyncBackup();

  const handleDownloadData = async () => {
    if (!session || !session.user || !session.user.email) return;

    try {
      const response = await fetch(`/api/v1/users/${session.user.id}/backup`);

      if (!response.ok) {
        console.error('Failed to fetch backup');
        return;
      }

      const backup = await response.json();
      if (!backup) return;

      const backupData = importNexusTimerData(backup.data);
      const existingCubes = await getAllCubes();

      const newCubes = await syncBackup(backupData, existingCubes);
      await clearCubes();
      await saveBatchCubes(newCubes);
      setCubes(newCubes);
      router.push("/");
      toast.success("Backup loaded successfully!");
    } catch (error) {
      console.error('Error loading backup:', error);
    }
  };

  return (
    <>
      <AccountHeader back="/" label={t("SettingsPage.load-data-title")} />

      <Card className="p-3 bg-secondary/10">
        <p>{t("SettingsPage.load-data-description")}</p>
        <p className="text-yellow-600">{t("SettingsPage.load-data-warning")}</p>

        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link href={"/settings/account"} className="flex-1">
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
