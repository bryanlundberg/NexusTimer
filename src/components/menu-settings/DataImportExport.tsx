import exportDataToFile from "@/lib/exportDataToFile";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";
import DialogImportBackup from "../dialogs/dialog-import-backup/dialog-import-backup";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export function DataImportExport() {
  const t = useTranslations("Index.Settings-menu");
  return (
    <div className="flex flex-wrap gap-2 ps-3">
      <Dialog>
        <DialogTrigger asChild className="flex items-center gap-1">
          <Button variant={"outline"}>
            <DownloadIcon /> {t("import-from-file")}
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
        {t("export-to-file")}
      </Button>
    </div>
  );
}
