import { Categories } from "@/interfaces/Categories";
import formatTime from "@/lib/formatTime";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export interface MoveData {
  category: Categories;
  bestTime: number;
  average: number;
  count: number;
}

export default function MoveModal({
  onConfirm,
  onCancel,
  data,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  data: () => MoveData | null;
}) {
  const { lang } = useSettingsModalStore();
  const getData = data();
  if (getData === null) return null;

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-black bg-opacity-75 bg-neutral-900">
        <div className="flex flex-col w-full h-auto gap-3 p-3 m-8 bg-white rounded-lg shadow-lg sm:w-96">
          <div className="text-lg font-medium text-center">
            {translation.solves["finalize-session"][lang]}
          </div>

          <div className="flex justify-center gap-2 ">
            <div className="flex flex-col text-end">
              <div className="text-black">
                {translation.cubes.table["category"][lang]}:
              </div>
              <div className="text-black">
                {translation.settings["best-time"][lang]}:
              </div>
              <div className="text-black">
                {translation.timer["mean"][lang]}:
              </div>
              <div className="text-black">
                {translation.timer["counter"][lang]}:
              </div>
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
            {translation.solves["archive-sessions-legend"][lang]}
          </div>

          <div className="flex justify-center w-full h-10 gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2 text-sm font-medium text-center transition duration-300 rounded-lg text-neutral-800 bg-neutral-200 hover:bg-neutral-300"
            >
              {translation.inputs["cancel"][lang]}
            </button>

            <button
              onClick={onConfirm}
              className="px-5 py-2 text-sm font-medium text-center text-white transition duration-200 border rounded-md bg-lime-500 border-lime-500 hover:border-lime-600 hover:bg-lime-600"
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
