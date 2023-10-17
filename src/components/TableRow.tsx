import { Cube } from "@/interfaces/Cube";
import BookmarkFav from "./BookmarkFav";
import Ellipsis from "@/icons/Ellipsis";
import updateCube from "@/lib/updateCube";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import Play from "@/icons/Play";
import Stop from "@/icons/Stop";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useRouter } from "next/navigation";

export default function TableRow({ cube }: { cube: Cube }) {
  const { lang } = useSettingsModalStore();
  const router = useRouter();
  const { setSelectedCube, setNewScramble } = useTimerStore();
  const { setCubes } = useTimerStore();
  const { setEditingCube, setModalOpen, setCubeName, setSelectedCategory } =
    useCubesModalStore();
  const setFavorite = (cubeId: string) => {
    const updatedCube = updateCube({ cubeId });
    setCubes(updatedCube);
  };

  function formatDate(msDate: number) {
    const creationDate = new Date(cube.createdAt);
    const month = creationDate.getMonth() + 1;
    const day = creationDate.getDate();
    const year = creationDate.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  }

  const status = cube.solves.session.length > 0;

  const redirectToHome = (e: any) => {
    const targetDiv = e.target;
    const divIndex = Array.from(e.currentTarget.children).indexOf(targetDiv);
    if (divIndex > 0 && divIndex < e.currentTarget.children.length - 1) {
      setSelectedCube(cube);
      setNewScramble(cube);
      router.push("/");
    }
  };

  return (
    <>
      <div
        onClick={(e) => redirectToHome(e)}
        className="table-row h-10 transition duration-200 dark:hover:bg-zinc-800 dark:bg-zinc-950 dark:text-neutral-200 light:text-neutral-900 light:bg-neutral-100 light:hover:bg-neutral-200"
      >
        <div className="table-cell w-10 align-middle">
          <BookmarkFav
            cubeId={cube.id}
            isChecked={cube.favorite}
            setFavorite={setFavorite}
          />
        </div>
        <div className="table-cell text-left align-middle cursor-pointer">
          {cube.name}
        </div>
        <div className="table-cell text-center align-middle cursor-pointer">
          {cube.category}
        </div>
        <div className="table-cell text-center align-middle cursor-pointer">
          {`${cube.solves.session.length}/${cube.solves.all.length}`}
        </div>
        <div className="hidden text-center align-middle cursor-pointer md:table-cell">
          {formatDate(cube.createdAt)}
        </div>
        <div className="hidden text-center align-middle md:table-cell">
          {status ? (
            <div className="flex items-center justify-center gap-1">
              <Play />
              <span>{translation.cubes.table["using"][lang]}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <Stop />
              <span>{translation.cubes.table["idle"][lang]}</span>
            </div>
          )}
        </div>
        <div className="table-cell text-center align-middle">
          <button
            className="p-1 px-2 transition duration-300 rounded-md dark:text-neutral-200 dark:hover:text-white dark:hover:bg-zinc-900 light:hover:bg-neutral-900 light:text-neutral-800 light:hover:text-white sm:px-2"
            onClick={() => {
              setEditingCube(cube);
              setCubeName(cube.name);
              setSelectedCategory(cube.category);
              setModalOpen(true);
            }}
          >
            <Ellipsis />
          </button>
        </div>
      </div>
    </>
  );
}
