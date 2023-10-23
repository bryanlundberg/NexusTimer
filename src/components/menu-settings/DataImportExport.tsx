import exportDataToFile from "@/lib/exportDataToFile";
import translation from "@/translations/global.json";
import { Button } from "@/components/button";
import { Language } from "@/interfaces/types/Language";
import { useRef } from "react";
import importDataFromFile from "@/lib/importDataFromFile";

interface DataImportExport {
  lang: Language
}

export function DataImportExport({ lang }: DataImportExport) {
  const dataInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2 justify-center">
      <input
        type="file"
        accept=".txt"
        ref={dataInputRef}
        style={{ display: 'none' }} // Hide the file input element
        onChange={importDataFromFile}
      />
      <Button
        className="font-normal"
        label={translation.settings["import-from-file"][lang]}
        onClick={() => dataInputRef.current && dataInputRef.current.click()}
      />
      <Button
        className="font-normal"
        label={translation.settings["export-to-file"][lang]}
        onClick={exportDataToFile}
      />
    </div>
  );
}
