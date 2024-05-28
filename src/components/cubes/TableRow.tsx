import { Cube } from "@/interfaces/Cube";
import BookmarkFav from "@/components/cubes/BookmarkFav";
import Ellipsis from "@/icons/Ellipsis";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import Play from "@/icons/Play";
import Stop from "@/icons/Stop";
import { useRouter } from "next/navigation";
import { getAllCubes, saveCube } from "@/db/dbOperations";
import { useTranslations } from "next-intl";

export default function TableRow({ cube }: { cube: Cube }) {
  const t = useTranslations("Index.CubesPage");
  const router = useRouter();
  const {
    setSelectedCube,
    setNewScramble,
    setLastSolve,
    setCubes,
    setTimerStatistics,
  } = useTimerStore();
  const { setEditingCube, setModalOpen, setCubeName, setSelectedCategory } =
    useCubesModalStore();
  const setFavorite = async (cube: Cube) => {
    const updatedCube = await saveCube({
      ...cube,
      favorite: !cube.favorite,
    });

    const cubesDB = await getAllCubes();
    setCubes(cubesDB);
  };

  function formatDate(msDate: number) {
    const creationDate = new Date(msDate);
    const month = creationDate.getMonth() + 1;
    const day = creationDate.getDate();
    const year = creationDate.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  }

  const redirectToHome = (e: any) => {
    const targetDiv = e.target;
    const divIndex = Array.from(e.currentTarget.children).indexOf(targetDiv);
    if (divIndex > 0 && divIndex < e.currentTarget.children.length - 1) {
      setSelectedCube(cube);
      setTimerStatistics();
      setNewScramble(cube);
      setLastSolve(null);
      router.push("/");
    }
  };

  return (
    <>
      <div
        onClick={(e) => redirectToHome(e)}
        className="table-row h-10 transition duration-200 bg-transparent dark:even:bg-zinc-900 light:even:bg-neutral-200 dark:hover:bg-zinc-800 light:hover:bg-neutral-300 dark:text-neutral-100 light:text-neutral-950 "
      >
        <div className="table-cell w-10 align-middle">
          <BookmarkFav
            cube={cube}
            isChecked={cube.favorite}
            setFavorite={setFavorite}
          />
        </div>
        <div className="table-cell text-left align-middle cursor-pointer">
          {cube.name}
        </div>
        <div className="table-cell text-center align-middle cursor-pointer">
          {cube?.category}
        </div>
        <div className="table-cell text-center align-middle cursor-pointer">
          {`${cube?.solves?.session.length}/${cube?.solves?.all.length}`}
        </div>
        <div className="hidden text-center align-middle cursor-pointer md:table-cell">
          {formatDate(cube?.createdAt)}
        </div>
        <div className="hidden text-center align-middle md:table-cell">
          {cube?.solves?.session.length > 0 ? (
            <div className="flex items-center justify-center gap-1">
              <div className="w-4 h-4">
                <Play />
              </div>
              <span>{t("using")}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <div className="w-4 h-4">
                <Stop />
              </div>
              <span>{t("idle")}</span>
            </div>
          )}
        </div>
        <div className="table-cell text-center align-middle">
          <button
            className="p-1 px-2 transition duration-300 rounded-md dark:text-neutral-200 dark:hover:text-white dark:hover:bg-zinc-600 light:hover:bg-neutral-600 light:text-neutral-800 light:hover:text-white sm:px-2"
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
