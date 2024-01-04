import { InputText } from "@/components/input-text/index";
import CheckboxImage from "@/components/cubes/CheckboxImage";
import { cubeCollection } from "@/lib/const/cubeCollection";
import genId from "@/lib/genId";
import translation from "@/translations/global.json";
import useModalCube from "@/hooks/useModalCube";
import { useCubesModalStore } from "@/store/CubesModalStore";
import DeleteModal from "@/components/cubes/DeleteModal";
import CloseModal from "@/icons/CloseModal";
import { motion } from "framer-motion";

export default function ModalCreate() {
  const { editingCube } = useCubesModalStore();
  const {
    error,
    handleClickRadio,
    handleWriteCubeName,
    handleCreateCube,
    handleEditCube,
    handleCloseModal,
    selectedCategory,
    cubeName,
    lang,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    showDeleteConfirmation,
    cubeData,
  } = useModalCube();
  return (
    <>
      {/* <!-- Main modal --> */}
      <div
        id="defaultModal"
        tabIndex={2}
        aria-hidden={false}
        className={`absolute bg-opacity-10 bg-black top-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen flex flex-col items-center`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseModal();
        }}
      >
        <div className="relative w-full max-w-2xl max-h-full">
          {/* <!-- Modal content --> */}
          <motion.div
            initial={{ y: 0, scale: 0.9, opacity: 0.8 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ x: 0, scale: 0.9, opacity: 0 }}
            className="relative bg-white border rounded-lg"
          >
            {/* <!-- Modal header --> */}
            <div className="flex items-start justify-between gap-3 p-4 border-b rounded-t border-neutral-200">
              <h3 className="flex items-center justify-center w-32 h-8 text-sm font-semibold text-neutral-950">
                {editingCube
                  ? translation.cubes.modal["title-editing"][lang]
                  : translation.cubes.modal["title-creating"][lang]}
              </h3>
              <div className="flex flex-col w-full">
                <InputText
                  placeholder={
                    translation.inputs.placeholders["modal-cubes"][lang]
                  }
                  onChange={handleWriteCubeName}
                  value={cubeName}
                  focus={true}
                  className={`bg-neutral-100 focus:bg-neutral-50 text-neutral-900 border border-neutral-300`}
                />
                {error && (
                  <p className="px-2 mt-2 text-sm text-red-600">
                    {translation.cubes.modal["error-name"][lang]}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 ml-auto text-sm text-gray-400 transition duration-200 bg-transparent rounded-lg hover:text-gray-900"
                data-modal-hide="defaultModal"
                onClick={handleCloseModal}
              >
                <CloseModal />
                <span className="sr-only">
                  {translation.inputs["cancel"][lang]}
                </span>
              </button>
            </div>
            {/* <!-- Modal body --> */}

            <div className="flex flex-wrap gap-3 p-6">
              {cubeCollection.map((category) => {
                return (
                  <CheckboxImage
                    key={genId()}
                    src={category.src}
                    alt={category.name}
                    id={category.id}
                    value={category.name}
                    handleClickRadio={
                      !editingCube ? handleClickRadio : () => {}
                    }
                    selectedCategory={selectedCategory}
                  />
                );
              })}
            </div>

            <div className="px-6 text-sm text-neutral-800">
              {translation.cubes.modal["current-select"][lang]}{" "}
              {selectedCategory}
            </div>

            {/* <!-- Modal footer --> */}
            <div className="flex items-center justify-end px-6 py-3 mt-2 space-x-2 border-t rounded-b border-neutral-200">
              {editingCube ? (
                <button
                  onClick={handleDeleteClick}
                  data-modal-hide="defaultModal"
                  type="button"
                  className="px-5 py-2 text-sm font-medium text-center text-white transition duration-200 bg-red-500 border border-red-500 rounded-md hover:border-red-600 hover:bg-red-600"
                >
                  {translation.inputs["delete"][lang]}
                </button>
              ) : null}

              {!editingCube ? (
                <button
                  onClick={handleCloseModal}
                  data-modal-hide="defaultModal"
                  type="button"
                  className="px-5 py-2 text-sm font-medium text-center transition duration-300 rounded-lg text-neutral-800 bg-neutral-200 hover:bg-neutral-300"
                >
                  {translation.inputs["cancel"][lang]}
                </button>
              ) : null}

              <button
                onClick={() =>
                  editingCube
                    ? handleEditCube(cubeName, selectedCategory)
                    : handleCreateCube(cubeName, selectedCategory)
                }
                data-modal-hide="defaultModal"
                type="button"
                className="px-5 py-2 text-sm font-medium text-center text-white transition duration-200 bg-green-600 border border-green-500 rounded-md hover:border-green-700 hover:bg-green-700"
              >
                {editingCube
                  ? translation.inputs["save"][lang]
                  : translation.inputs["create"][lang]}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      {showDeleteConfirmation && (
        <DeleteModal
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
          cubeData={cubeData}
        />
      )}
    </>
  );
}
