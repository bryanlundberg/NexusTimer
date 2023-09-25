import InputText from "./InputText";
import CheckboxImage from "./CheckboxImage";
import { useState } from "react";
import { Categories } from "@/interfaces/Categories";
import { cubeCollection } from "@/lib/cubeCollection";
import genId from "@/lib/genId";

export default function ModalCreate({
  handleCreateCube,
  handleClose,
}: {
  handleCreateCube: any;
  handleClose: any;
}) {
  const [selectedCategory, setSelectedCategory] = useState<Categories>("2x2");
  const [cubeName, setCubeName] = useState<string>("");

  const handleClickRadio = (category: Categories) => {
    setSelectedCategory(category);
  };

  const handleWriteCubeName = (newText: string) => {
    setCubeName(newText);
  };

  return (
    <>
      {/* <!-- Main modal --> */}
      <div
        id="defaultModal"
        tabIndex={2}
        aria-hidden={false}
        className="fixed backdrop-blur-[2px] top-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex flex-col items-center"
      >
        <div className="relative w-full max-w-2xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-lg">
            {/* <!-- Modal header --> */}
            <div className="flex gap-3 items-start justify-between p-4 border-b border-zinc-800 rounded-t">
              <h3 className="text-sm font-semibold text-neutral-50 w-32 flex items-center justify-center h-8">
                New Cube:
              </h3>
              <InputText
                placeholder="Brand | Model | Version | Magenetic?"
                onChange={handleWriteCubeName}
              />
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                data-modal-hide="defaultModal"
                onClick={() => handleClose(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-6 space-y-6"></div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
              {cubeCollection.map((category) => {
                return (
                  <CheckboxImage
                    key={genId()}
                    src={category.src}
                    alt={category.name}
                    id={category.id}
                    value={category.name}
                    handleClickRadio={handleClickRadio}
                    selectedCategory={selectedCategory}
                  />
                );
              })}
            </div>

            {/* <!-- Modal footer --> */}
            <div className="flex items-center justify-end p-6 space-x-2 border-zinc-800 rounded-b ">
              <button
                onClick={() => handleClose(false)}
                data-modal-hide="defaultModal"
                type="button"
                className="text-neutral-100 border border-zinc-800 bg-transparent hover:bg-zinc-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Cancel
              </button>

              <button
                onClick={() => handleCreateCube(cubeName, selectedCategory)}
                data-modal-hide="defaultModal"
                type="button"
                className="text-gray-800 bg-neutral-50 hover:bg-neutral-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
