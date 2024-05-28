import { DeleteCubeDetails } from "@/interfaces/DeleteCubeDetails";
import { useTranslations } from "next-intl";

export default function DeleteModal({
  confirmDelete,
  cancelDelete,
  cubeData,
}: {
  confirmDelete: () => void;
  cancelDelete: () => void;
  cubeData: DeleteCubeDetails | null;
}) {
  const t = useTranslations("Index");
  if (!cubeData) return;
  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-black bg-opacity-75 bg-neutral-900">
        <div className="flex flex-col w-full h-auto gap-3 p-3 m-8 bg-white rounded-lg shadow-lg sm:w-96">
          <div className="text-lg font-medium text-center">
            {t("Cubes-modal.question-delete")}
          </div>

          <div className="px-2 mx-auto font-mono text-center text-black bg-yellow-300 w-fit text-md ">
            {cubeData.name}
          </div>

          <div className="flex justify-center gap-2 ">
            <div className="flex flex-col text-end">
              <div className="text-black">{t("CubesPage.category")}: </div>
              <div className="text-black">{t("Settings-menu.best-time")}: </div>
              <div className="text-black">{t("HomePage.best")} Ao5: </div>
              <div className="text-black">{t("HomePage.counter")}: </div>
            </div>

            <div className="flex flex-col text-start">
              <div className="w-full overflow-hidden text-black">
                {cubeData.category}
              </div>
              <div className="w-auto overflow-hidden text-black">
                {cubeData.best}
              </div>
              <div className="w-auto overflow-hidden text-black">
                {cubeData.ao5}
              </div>
              <div className="w-auto overflow-hidden text-black">
                {cubeData.count}
              </div>
            </div>
          </div>

          <div className="w-11/12 mx-auto text-xs text-center">
            {t("Cubes-modal.warning-delete")}
          </div>

          <div className="flex justify-center w-full h-10 gap-3">
            <button
              onClick={cancelDelete}
              className="px-5 py-2 text-sm font-medium text-center transition duration-300 rounded-lg text-neutral-800 bg-neutral-200 hover:bg-neutral-300"
            >
              {t("Inputs.cancel")}
            </button>

            <button
              onClick={confirmDelete}
              className="px-5 py-2 text-sm font-medium text-center text-white transition duration-200 bg-red-500 border border-red-500 rounded-md hover:border-red-600 hover:bg-red-600"
              autoFocus={true}
            >
              {t("Inputs.cancel")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
