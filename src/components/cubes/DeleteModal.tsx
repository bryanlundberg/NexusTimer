import { DeleteCubeDetails } from "@/interfaces/DeleteCubeDetails";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export default function DeleteModal({
  confirmDelete,
  cancelDelete,
  cubeData,
}: {
  confirmDelete: () => void;
  cancelDelete: () => void;
  cubeData: DeleteCubeDetails | null;
}) {
  const { lang } = useSettingsModalStore();
  if (!cubeData) return;
  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-black bg-opacity-80 bg-neutral-900">
        <div className="flex flex-col w-full h-auto gap-3 p-3 m-8 bg-white rounded-lg shadow-lg sm:w-96">
          <div className="text-lg font-medium text-center">
            {translation.cubes.modal["question-delete"][lang]}
          </div>

          <div className="px-2 mx-auto font-mono text-center text-black bg-yellow-300 w-fit text-md ">
            {cubeData.name}
          </div>

          <div className="flex justify-center gap-2 ">
            <div className="flex flex-col text-end">
              <div className="text-black">
                {translation.cubes.table["category"][lang]}:{" "}
              </div>
              <div className="text-black">
                {translation.settings["best-time"][lang]}:{" "}
              </div>
              <div className="text-black">
                {translation.timer["best"][lang]} Ao5:{" "}
              </div>
              <div className="text-black">
                {translation.timer["counter"][lang]}:{" "}
              </div>
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
            {translation.cubes.modal["warning-delete"][lang]}
          </div>

          <div className="flex justify-center w-full h-10 gap-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 transition duration-200 rounded-lg bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
            >
              {translation.inputs["cancel"][lang]}
            </button>

            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-white transition duration-200 bg-red-600 rounded-lg hover:bg-red-700"
              autoFocus={true}
            >
              {translation.inputs["confirm"][lang]}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
