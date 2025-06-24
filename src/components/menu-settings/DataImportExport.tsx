import exportDataToFile from "@/lib/exportDataToFile";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";
import DialogImportBackup from "../dialogs/dialog-import-backup/dialog-import-backup";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export function DataImportExport() {
  const t = useTranslations("Index");
  return (
    <div className="ps-3 pe-3 mb-3">
      <div className="flex flex-wrap gap-2 mb-1">
        <Dialog>
          <DialogTrigger asChild className="flex items-center gap-1">
            <Button variant={"outline"}>
              <DownloadIcon /> {t("Settings-menu.import-from-file")}
            </Button>
          </DialogTrigger>
          <DialogImportBackup />
        </Dialog>

        <Button
          variant={"outline"}
          className="flex items-center gap-1"
          onClick={exportDataToFile}
        >
          <UploadIcon />
          {t("Settings-menu.export-to-file")}
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        {t("Settings-descriptions.data-import-export")}
      </div>
    </div>
  );
}
