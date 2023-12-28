import exportDataToFile from "@/lib/exportDataToFile";
import { Button } from "@/components/button";
import { useRef } from "react";
import importDataFromFile from "@/lib/importDataFromFile";
import Import from "@/icons/Import";
import Export from "@/icons/Export";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useRouter } from "next/navigation";

export function DataImportExport() {
  const dataInputRef = useRef<HTMLInputElement>(null);
  const { lang } = useSettingsModalStore();
  const { setSelectedCube } = useTimerStore();
  const router = useRouter();
  return (
    <div className="flex justify-center w-11/12 gap-2 mx-auto light">
      <input
        type="file"
        accept=".txt"
        ref={dataInputRef}
        className="hidden"
        onChange={(e) => {
          importDataFromFile(e);
          router.push("/cubes");
          setSelectedCube(null);
        }}
      />
      <Button
        className="font-normal transition duration-400"
        label={translation.settings["import-from-file"][lang]}
        onClick={() => dataInputRef.current && dataInputRef.current.click()}
        icon={<Import />}
      />
      <Button
        className="font-normal transition duration-400"
        label={translation.settings["export-to-file"][lang]}
        onClick={exportDataToFile}
        icon={<Export />}
      />
    </div>
  );
}
