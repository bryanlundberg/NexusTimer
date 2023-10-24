import exportDataToFile from "@/lib/exportDataToFile";
import translation from "@/translations/global.json";
import { Button } from "@/components/button";
import { Language } from "@/interfaces/types/Language";
import { useRef } from "react";
import importDataFromFile from "@/lib/importDataFromFile";
import Import from "@/icons/Import";
import Export from "@/icons/Export";

interface DataImportExport {
  lang: Language;
}

export function DataImportExport({ lang }: DataImportExport) {
  const dataInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="light flex justify-center gap-2">
      <input
        type="file"
        accept=".txt"
        ref={dataInputRef}
        className="hidden"
        onChange={importDataFromFile}
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
