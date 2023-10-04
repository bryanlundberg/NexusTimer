import InputText from "./InputText";
import CheckboxImage from "./CheckboxImage";
import { Categories } from "@/interfaces/Categories";
import { cubeCollection } from "@/lib/cubeCollection";
import genId from "@/lib/genId";
import { useCubesModalStore } from "@/store/CubesModalStore";
import createCube from "@/lib/createCube";
import { useTimerStore } from "@/store/timerStore";
import loadCubes from "@/lib/loadCubes";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function ModalCreate() {
  const {
    setModalOpen,
    editingCube,
    setEditingCube,
    selectedCategory,
    setSelectedCategory,
    cubeName,
    setCubeName,
  } = useCubesModalStore();
  const { settings } = useSettingsModalStore();
  const { setCubes } = useTimerStore();

  const handleClickRadio = (category: Categories) => {
    setSelectedCategory(category);
  };

  const handleWriteCubeName = (newText: string) => {
    setCubeName(newText);
  };

  const handleCreateCube = (name: string, category: Categories) => {
    if (name === "") return;
    const newCubes = createCube({
      cubeName: name,
      category: category,
    });
    setCubes(newCubes);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleEditCube = (name: string, category: Categories) => {
    if (name === "") return;
    if (!editingCube) return;
    const cubeDB = loadCubes();

    for (const cube of cubeDB) {
      if (cube.id === editingCube.id) {
        cube.name = name;
        cube.category = category;
      }
    }

    window.localStorage.setItem("cubes", JSON.stringify(cubeDB));
    setCubes(cubeDB);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleDeleteCube = () => {
    const cubeDB = loadCubes();
    if (!editingCube) return;
    const updatedCubeDB = cubeDB.filter((cube) => cube.id !== editingCube.id);
    window.localStorage.setItem("cubes", JSON.stringify(updatedCubeDB));
    setCubes(updatedCubeDB);
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCube(null);
    setCubeName("");
    setSelectedCategory("2x2");
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
                {editingCube
                  ? translation.cubes.modal["title-editing"][
                      settings.locale[0].lang
                    ]
                  : translation.cubes.modal["title-creating"][
                      settings.locale[0].lang
                    ]}
              </h3>
              <InputText
                placeholder={
                  translation.inputs.placeholders["modal-cubes"][
                    settings.locale[0].lang
                  ]
                }
                onChange={handleWriteCubeName}
                value={cubeName}
                focus={true}
              />
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                data-modal-hide="defaultModal"
                onClick={handleCloseModal}
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
                <span className="sr-only">
                  {translation.inputs["cancel"][settings.locale[0].lang]}
                </span>
              </button>
            </div>
            {/* <!-- Modal body --> */}

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

            <div className="px-6 text-zinc-400 text-sm">
              {
                translation.cubes.modal["current-select"][
                  settings.locale[0].lang
                ]
              }{" "}
              {selectedCategory}
            </div>

            {/* <!-- Modal footer --> */}
            <div className="flex items-center justify-end p-6 space-x-2 border-zinc-800 rounded-b ">
              {editingCube ? (
                <button
                  onClick={handleDeleteCube}
                  data-modal-hide="defaultModal"
                  type="button"
                  className="text-neutral-100 border border-red-900 bg-red-800 hover:bg-red-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {translation.inputs["delete"][settings.locale[0].lang]}
                </button>
              ) : null}
              {!editingCube ? (
                <button
                  onClick={handleCloseModal}
                  data-modal-hide="defaultModal"
                  type="button"
                  className="text-neutral-100 border border-zinc-800 bg-transparent hover:bg-zinc-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {translation.inputs["cancel"][settings.locale[0].lang]}
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
                className="text-gray-800 bg-neutral-50 hover:bg-neutral-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {editingCube
                  ? translation.inputs["save"][settings.locale[0].lang]
                  : translation.inputs["create"][settings.locale[0].lang]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
