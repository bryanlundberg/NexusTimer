import exportDataToFile from "@/lib/exportDataToFile";
import translation from "@/translations/global.json";
import { Button } from "@/components/button";
import { Language } from "@/interfaces/types/Language";
import { useRef } from "react";
import importDataFromFile from "@/lib/importDataFromFile";

interface DataImportExport {
  lang: Language;
}

export function DataImportExport({ lang }: DataImportExport) {
  const dataInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-center gap-2">
      <input
        type="file"
        accept=".txt"
        ref={dataInputRef}
        className="hidden"
        onChange={importDataFromFile}
      />
      <Button
        className="font-normal transition duration-400 dark:hover:bg-blue-500 light:hover:bg-blue-500 light:hover:text-neutral-100 dark:hover:text-neutral-100 dark:border-neutral-200 light:border-neutral-200"
        label={translation.settings["import-from-file"][lang]}
        onClick={() => dataInputRef.current && dataInputRef.current.click()}
      />
      <Button
        className="font-normal transition duration-400 dark:hover:bg-blue-500 light:hover:bg-blue-500 light:hover:text-neutral-100 dark:hover:text-neutral-100 dark:border-neutral-200 light:border-neutral-200"
        label={translation.settings["export-to-file"][lang]}
        onClick={exportDataToFile}
      />
    </div>
  );
}
