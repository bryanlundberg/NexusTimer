import useClickOutside from "@/hooks/useClickOutside";
import importDataFromFile from "@/lib/importDataFromFile";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Loading from "../Loading";

export default function ImportModal() {
  const { setImportModalOpen, importModalOpen } = useSettingsModalStore();
  const { setSelectedCube } = useTimerStore();
  const [isImporting, setIsImporting] = useState(false);
  const dataInputRef = useRef<HTMLInputElement>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  useClickOutside(componentRef, () => setImportModalOpen(false));

  return (
    <>
      <AnimatePresence>
        {importModalOpen && (
          <div className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-screen px-4 py-10 overflow-x-hidden overflow-y-auto bg-black bg-opacity-10 md:inset-0 text-neutral-950">
            <motion.div
              initial={{ y: 100, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.9, opacity: 0 }}
              className="relative w-full h-auto text-xs bg-white rounded-md sm:w-96 p-3 flex flex-col gap-2 items-center text-center"
              ref={componentRef}
            >
              <div className="text-xl font-medium">
                Intelligent Backup Restoration
              </div>
              <div className="text-md text-balance">
                Let NexusTimer smartly import everything; it will automatically
                detect and recreate a compatible data structure.
              </div>

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
                          router.push("/cubes");
                          setSelectedCube(null);
                          setImportModalOpen(false);
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
                    Drag and drop your files here, or click to select.
                  </div>
                </div>
              ) : (
                <div className="text-center mx-auto flex-col items-center gap-2">
                  <div className="flex justify-center">
                    <Loading />
                  </div>

                  <div className="text-balance w-9/12 mx-auto">
                    This action can take several minutes restoring thousands of
                    solves
                  </div>

                  <div className="font-bold">
                    Please wait, dont close this window
                  </div>
                </div>
              )}
              <div className="font-medium">Supported Timers:</div>
              <ul className="flex gap-2">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
