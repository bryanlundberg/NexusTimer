import useClickOutside from "@/hooks/useClickOutside";
import { DeleteCubeDetails } from "@/interfaces/DeleteCubeDetails";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export default function MoveModal({
  onConfirm,
  onCancel,
  data,
}: {
  onConfirm?: () => void;
  onCancel?: () => void;
  data?: any;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-black bg-opacity-75 bg-neutral-900">
        <div className="flex flex-col w-full h-auto gap-3 p-3 m-8 bg-white rounded-lg shadow-lg sm:w-96">
          <div className="text-lg font-medium text-center">
            Finish training session?
          </div>

          <div className="flex justify-center gap-2 ">
            <div className="flex flex-col text-end">
              <div className="text-black">Category:</div>
              <div className="text-black">Best time:</div>
              <div className="text-black">Average:</div>
              <div className="text-black">Count:</div>
            </div>

            <div className="flex flex-col text-start">
              <div className="w-full overflow-hidden text-black">SQ-1</div>
              <div className="w-auto overflow-hidden text-black">19.90</div>
              <div className="w-auto overflow-hidden text-black">21.34</div>
              <div className="w-auto overflow-hidden text-black">31</div>
            </div>
          </div>

          <div className="w-11/12 mx-auto text-xs text-center">
            This action will store all active sessions from SQ-1 category.
          </div>

          <div className="flex justify-center w-full h-10 gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2 text-sm font-medium text-center transition duration-300 rounded-lg text-neutral-800 bg-neutral-200 hover:bg-neutral-300"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-5 py-2 text-sm font-medium text-center text-white transition duration-200 bg-lime-500 border border-lime-500 rounded-md hover:border-lime-600 hover:bg-lime-600"
              autoFocus={true}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
