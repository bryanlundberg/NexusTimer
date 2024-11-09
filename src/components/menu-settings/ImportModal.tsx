import useClickOutside from "@/hooks/useClickOutside";
import importDataFromFile from "@/lib/importDataFromFile";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import Image from "next/image";
import { useRef, useState } from "react";
import Loading from "../Loading";
import { getAllCubes } from "@/db/dbOperations";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ImportModal() {
  const { setImportModalOpen, importModalOpen } = useSettingsModalStore();
  const { setSelectedCube, setCubes, setTimerStatistics } = useTimerStore();
  const [isImporting, setIsImporting] = useState(false);
  const dataInputRef = useRef<HTMLInputElement>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const t = useTranslations("Index.backup-modal");

  useClickOutside(componentRef, () => setImportModalOpen(false));
  return (
    <>
        {importModalOpen && (
          <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <div className="flex flex-auto items-center justify-center">
      <DialogTitle>{t("title")}</DialogTitle>
      </div>
      <DialogDescription>
      {t("description")}
      </DialogDescription>
    </DialogHeader>
    {!isImporting ? (
            <div className="relative border-2 border-dashed border-blue-900 w-full h-20 text-md flex justify-center items-center hover:border-blue-600 transition duration-200 ">
              <input
                type="file"
                accept=".txt"
                ref={dataInputRef}
                onChange={async (e) => {
                  try {
                    setIsImporting(true);
                    const response = await importDataFromFile(e);
                    if (response) {
                      const cubesDB = await getAllCubes();
                      setCubes(cubesDB);
                      router.push("/cubes");
                      setSelectedCube(null);
                      setTimerStatistics();
                      setImportModalOpen(false);
                      alert(`${t("alert-category")}`);
                    }
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsImporting(false);
                  }
                }}
                className="absolute z-50 w-full h-full opacity-0 hover:cursor-pointer"
              />
              <div className="absolute z-40 text-center">
                {t("drag-drop")}
              </div>
            </div>
          ) : (
            <div className="text-center mx-auto flex-col items-center gap-2">
              <div className="flex justify-center mt-3">
                <Loading />
              </div>
              <div className="mx-auto mt-2">{t("loading-part-1")}</div>
              <div className="font-bold">{t("loading-part-2")}</div>
            </div>
          )}
          <div className="flex flex-auto items-center justify-center">
          <div className="font-medium mt-3">{t("welcome")}</div>
          </div>
          <DialogFooter>
          <ul className="flex items-center justify-center flex-auto gap-2 ">
            <Image
              src={"/timer-logos/nexustimer.jpg"}
              alt="nexustimer logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />
            <Image
              src={"/timer-logos/cstimer.jpg"}
              alt="cstimer logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />

            <Image
              src={"/timer-logos/twistytimer.jpg"}
              alt="twistytimer logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />

            <Image
              src={"/timer-logos/cubedesk.jpg"}
              alt="cubedesk logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />
            
          </ul>
          </DialogFooter>
    
    
  </DialogContent>
  </Dialog>
        )}      
    </>
  );
}
