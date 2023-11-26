import { DeleteCubeDetails } from "@/interfaces/DeleteCubeDetails";
export default function DeleteModal({
  confirmDelete,
  cancelDelete,
  cubeData,
}: {
  confirmDelete: () => void;
  cancelDelete: () => void;
  cubeData: DeleteCubeDetails | null;
}) {
  if (!cubeData) return;
  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-black bg-opacity-80 bg-neutral-900">
        <div className="flex flex-col w-full h-auto gap-3 p-3 m-8 bg-white rounded-lg shadow-lg sm:w-96">
          <div className="text-lg font-bold text-center">
            Are you sure you want to delete?
          </div>

          <div className="flex gap-2">
            <div className="flex-1 text-end">
              <div className="w-full h-5 text-black">Name:</div>
              <div className="text-black">Category: </div>
              <div className="text-black">Best time: </div>
              <div className="text-black">Best Ao5: </div>
              <div className="text-black">Count: </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="w-full h-5 overflow-hidden text-black">
                {cubeData.name}
              </div>
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
            This irreversible action will delete all solve history for this cube
            and may impact your statistics.
          </div>

          <div className="flex justify-center w-full h-10 gap-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 transition duration-200 rounded-lg bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-white transition duration-200 bg-red-600 rounded-lg hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
