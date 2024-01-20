import exportDataToFile from "@/lib/exportDataToFile";
import { Button } from "@/components/button";
import Import from "@/icons/Import";
import Export from "@/icons/Export";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export function DataImportExport() {
  const { lang } = useSettingsModalStore();
  const { setImportModalOpen } = useSettingsModalStore();
  return (
    <div className="flex justify-center w-11/12 gap-2 mx-auto light">
      <Button
        className="font-normal transition duration-400"
        label={translation.settings["import-from-file"][lang]}
        onClick={() => setImportModalOpen(true)}
        minimalistic={false}
        icon={<Import />}
      />
      <Button
        className="font-normal transition duration-400"
        label={translation.settings["export-to-file"][lang]}
        onClick={exportDataToFile}
        minimalistic={false}
        icon={<Export />}
      />
    </div>
  );
}
