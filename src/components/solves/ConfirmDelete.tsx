import { Categories } from "@/interfaces/Categories";
import formatTime from "@/lib/formatTime";
import { useTranslations } from "next-intl";

export interface ConfirmDeleteData {
  category: Categories;
  bestTime: number;
  average: number;
  count: number;
}

export default function ConfirmDelete({
  onConfirm,
  onCancel,
  data,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  data: () => ConfirmDeleteData | null;
}) {
  const t = useTranslations("Index");
  const getData = data();
  if (getData === null) return null;

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-black bg-opacity-75 bg-neutral-900">
        <div className="flex flex-col w-full h-auto gap-3 p-3 m-8 bg-white rounded-lg shadow-lg sm:w-96">
          <div className="text-lg font-medium text-center">
            {t("SolvesPage.eliminate-session")}
          </div>

          <div className="flex justify-center gap-2 ">
            <div className="flex flex-col text-end">
              <div className="text-black">{t("CubesPage.category")}:</div>
              <div className="text-black">{t("Settings-menu.best-time")}:</div>
              <div className="text-black">{t("HomePage.mean")}:</div>
              <div className="text-black">{t("HomePage.counter")}:</div>
            </div>

            <div className="flex flex-col text-start">
              <div className="w-full overflow-hidden text-black">
                {getData.category}
              </div>
              <div className="w-auto overflow-hidden text-black">
                {formatTime(getData.bestTime)}
              </div>
              <div className="w-auto overflow-hidden text-black">
                {formatTime(getData.average)}
              </div>
              <div className="w-auto overflow-hidden text-black">
                {getData.count}
              </div>
            </div>
          </div>

          <div className="w-11/12 mx-auto text-xs text-center">
            {t("SolvesPage.delete-session-legend")}
          </div>

          <div className="flex justify-center w-full h-10 gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2 text-sm font-medium text-center transition duration-300 rounded-lg text-neutral-800 bg-neutral-200 hover:bg-neutral-300"
            >
              {t("Inputs.cancel")}
            </button>

            <button
              onClick={onConfirm}
              className="px-5 py-2 text-sm font-medium text-center text-white transition duration-200 border rounded-md bg-red-500 border-red-500 hover:border-red-600 hover:bg-red-600"
              autoFocus={true}
            >
              {t("Inputs.delete")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
