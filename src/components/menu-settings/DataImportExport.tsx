import exportDataToFile from "@/lib/exportDataToFile";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";

export function DataImportExport() {
  const t = useTranslations("Index.Settings-menu");
  const { setImportModalOpen } = useSettingsModalStore();
  return (
    <div className="flex justify-center w-11/12 gap-2 mx-auto light">
      <Button
        variant={"outline"}
        className="flex items-center gap-1"
        onClick={() => setImportModalOpen(true)}
      >
        <DownloadIcon /> {t("import-from-file")}
      </Button>
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
