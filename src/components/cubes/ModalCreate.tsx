"use client";
import { InputText } from "@/components/input-text/index";
import CheckboxImage from "@/components/cubes/CheckboxImage";
import { cubeCollection } from "@/lib/const/cubeCollection";
import genId from "@/lib/genId";
import useModalCube from "@/hooks/useModalCube";
import { useCubesModalStore } from "@/store/CubesModalStore";
import DeleteModal from "@/components/cubes/DeleteModal";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function ModalCreate() {
  const { editingCube } = useCubesModalStore();
  const {
    error,
    isDuplicate,
    handleClickRadio,
    handleWriteCubeName,
    handleCreateCube,
    handleEditCube,
    handleCloseModal,
    selectedCategory,
    cubeName,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    showDeleteConfirmation,
    cubeData,
  } = useModalCube();

  const t = useTranslations("Index");

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
                  ? t("Cubes-modal.title-editing")
                  : t("Cubes-modal.title-creating")}
              </h3>
              <div className="flex flex-col w-full">
                <InputText
                  placeholder={t("Cubes-modal.placeholder")}
                  onChangeCallback={handleWriteCubeName}
                  value={cubeName}
                  className={`bg-neutral-100 focus:bg-neutral-50 text-neutral-900 border border-neutral-300`}
                />
                {error ? (
                  <p className="px-2 mt-2 text-sm text-red-600">
                    {t("Cubes-modal.error-name")}
                  </p>
                ) : (
                  isDuplicate && (
                    <p className="px-2 mt-2 text-sm text-red-600">
                      {t("Cubes-modal.error-duplicate")}
                    </p>
                  )
                )}
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 ml-auto text-sm text-gray-400 transition duration-200 bg-transparent rounded-lg hover:text-gray-900"
                data-modal-hide="defaultModal"
                onClick={handleCloseModal}
              >
                <XMarkIcon className="w-6 h-6" />
                <span className="sr-only">{t("Inputs.cancel")}</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}

            <div className="flex flex-wrap gap-3 p-6">
              {cubeCollection.map((category) => {
                return (
                  <CheckboxImage
                    key={category.id}
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

            <div className="px-6 text-sm text-neutral-800">
              {t("Cubes-modal.current-select")} {selectedCategory}
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
                  {t("Inputs.delete")}
                </button>
              ) : null}

              {!editingCube ? (
                <button
                  onClick={handleCloseModal}
                  data-modal-hide="defaultModal"
                  type="button"
                  className="px-5 py-2 text-sm font-medium text-center transition duration-300 rounded-lg text-neutral-800 bg-neutral-200 hover:bg-neutral-300"
                >
                  {t("Inputs.cancel")}
                </button>
              ) : null}

              <button
                onClick={async () =>
                  editingCube
                    ? await handleEditCube(cubeName, selectedCategory)
                    : await handleCreateCube(cubeName, selectedCategory)
                }
                data-modal-hide="defaultModal"
                type="button"
                className="px-5 py-2 text-sm font-medium text-center text-white transition duration-200 bg-green-600 border border-green-500 rounded-md hover:border-green-700 hover:bg-green-700"
              >
                {editingCube ? t("Inputs.confirm") : t("Inputs.create")}
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
