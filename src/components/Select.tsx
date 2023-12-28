import PlusIcon from "@/icons/PlusIcon";
import SelectOptions from "@/icons/SelectOptions";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Categories } from "@/interfaces/Categories";
import { cubeCollection } from "@/lib/cubeCollection";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import findCube from "@/lib/findCube";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import useClickOutside from "@/hooks/useClickOutside";

export default function Select() {
  const [open, setOpen] = useState<boolean>(false);
  const { selectedCube, cubes } = useTimerStore();
  const { lang } = useSettingsModalStore();
  const componentRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  useClickOutside(componentRef, handleClose);

  return (
    <>
      <div
        className="flex justify-end relative w-full sm:w-[400px]"
        ref={componentRef}
      >
        <button
          onClick={() => setOpen(!open)}
          className={`grow text-md appearance-none border font-medium rounded-md px-3 transition duration-200 light:shadow-black  light:hover:bg-neutral-200  dark:hover:bg-zinc-800 dark:border-zinc-800 light:border-neutral-200 h-10 ${
            open
              ? "dark:bg-zinc-900 opacity-80 light:bg-neutral-200"
              : "dark:bg-zinc-950 light:bg-neutral-100"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            {selectedCube ? (
              <MiniatureIcon category={selectedCube.category} />
            ) : null}
            <div>
              {selectedCube
                ? selectedCube.name
                : translation.inputs["select-cube"][lang]}
            </div>
            <SelectOptions />
          </div>
        </button>
        {open === true ? (
          <div
            id="list-options"
            className={
              "absolute z-40 overflow-auto max-h-[400px] p-1 top-12 mt-1 right-0 w-full h-auto border rounded-md light:bg-neutral-100 light:border-neutral-400 light:text-neutral-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-100"
            }
          >
            {/* Favorites */}
            <LabelSection description={translation.inputs["favorites"][lang]} />
            {cubes?.map((cube) => {
              if (cube.favorite) {
                return (
                  <Option
                    key={genId()}
                    name={cube.name}
                    category={cube.category}
                    cubeId={cube.id}
                    handleClose={handleClose}
                  />
                );
              }
            })}
            <LabelSection description={translation.inputs["list"][lang]} />
            {cubes?.map((cube) => {
              return (
                <Option
                  key={genId()}
                  name={cube.name}
                  category={cube.category}
                  cubeId={cube.id}
                  handleClose={handleClose}
                />
              );
            })}
            <AddCubeOption />
          </div>
        ) : null}
      </div>
    </>
  );
}

function MiniatureIcon({ category }: { category: Categories }) {
  const images = cubeCollection.map((option) => {
    if (option.name === category) {
      return (
        <Image
          key={genId()}
          src={option.src}
          alt={option.name}
          width={24}
          height={24}
          className="object-contain"
          draggable={false}
        />
      );
    } else {
      return null;
    }
  });

  return <>{images}</>;
}

function Option({
  name,
  category,
  cubeId,
  handleClose,
}: {
  name: string;
  category: Categories;
  cubeId: string;
  handleClose: () => void;
}) {
  const { selectedCube, setSelectedCube, setNewScramble, setLastSolve } =
    useTimerStore();

  return (
    <div
      onClick={() => {
        if (setSelectedCube && setNewScramble) {
          const cube = findCube({ cubeId: cubeId });
          if (cube) {
            setSelectedCube(cube);
            setNewScramble(cube);
            setLastSolve(null);
          }
        }
        handleClose();
      }}
      className={`transition duration-200 p-1 select-none rounded-md ps-2 flex items-center justify-between overflow-hidden ${
        selectedCube?.id === cubeId
          ? `light:bg-neutral-700 light:text-neutral-200 dark:bg-zinc-700 dark:text-neutral-200`
          : "light:bg-neutral-100 light:text-neutral-900 light:hover:bg-neutral-500 light:hover:text-neutral-100 dark:bg-zinc-900 dark:text-neutral-100 dark:hover:bg-zinc-800 dark:hover:text-neutral-100"
      }`}
    >
      <div className="flex justify-start gap-3">
        <MiniatureIcon category={category} />
        <div className="overflow-hidden">{name}</div>
      </div>
    </div>
  );
}

function LabelSection({ description }: { description: string }) {
  return (
    <div className="p-1 text-xs ps-2 dark:text-neutral-500 light:text-black">
      {description}
    </div>
  );
}

function AddCubeOption() {
  const { lang } = useSettingsModalStore();
  const { setModalOpen } = useCubesModalStore();

  return (
    <div
      className={
        "p-1 mt-1 border-t rounded-md cursor-pointer select-none ps-2 light:border-neutral-400 light:hover:bg-zinc-700 light:hover:text-neutral-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
      }
    >
      <Link href="/cubes" onClick={() => setModalOpen(true)}>
        <div className="flex items-center justify-start gap-2 align-middle">
          <PlusIcon />
          <div>{translation.inputs["add-cube"][lang]}</div>
        </div>
      </Link>
    </div>
  );
}
