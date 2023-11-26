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
        <div className="flex flex-col w-auto h-auto gap-3 p-4 bg-white rounded-lg shadow-lg">
          <div className="flex gap-2">
            <div className="flex-1 text-end">
              <div className="text-black">Name:</div>
              <div className="text-black">Category: </div>
              <div className="text-black">Best time: </div>
              <div className="text-black">Best Ao5: </div>
              <div className="text-black">Count: </div>
            </div>

            <div className="flex-1">
              <div className="text-black">{cubeData.name}</div>
              <div className="text-black">{cubeData.category}</div>
              <div className="text-black">{cubeData.best}</div>
              <div className="text-black">{cubeData.ao5}</div>
              <div className="text-black">{cubeData.count}</div>
            </div>
          </div>

          <div className="flex justify-end w-full h-10 gap-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 rounded-lg bg-neutral-300 text-neutral-900 hover:bg-neutral-400"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover-bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
