import exportDataToFile from "@/lib/exportDataToFile";
import { Button } from "@/components/button";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTranslations } from "next-intl";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/24/solid";

export function DataImportExport() {
  const t = useTranslations("Index.Settings-menu");
  const { setImportModalOpen } = useSettingsModalStore();
  return (
    <div className="flex justify-center w-11/12 gap-2 mx-auto light">
      <Button
        className="font-normal transition duration-400"
        label={t("import-from-file")}
        onClick={() => setImportModalOpen(true)}
        minimalistic={false}
        icon={<BarsArrowDownIcon className="w-6 h-6" />}
      />
      <Button
        className="font-normal transition duration-400"
        label={t("export-to-file")}
        onClick={exportDataToFile}
        minimalistic={false}
        icon={<BarsArrowUpIcon className="w-6 h-6" />}
      />
    </div>
  );
}
