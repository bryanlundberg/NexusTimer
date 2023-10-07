import PlusIcon from "@/icons/PlusIcon";
import SelectOptions from "@/icons/SelectOptions";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Categories } from "@/interfaces/Categories";
import { cubeCollection } from "@/lib/cubeCollection";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import findCube from "@/lib/findCube";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function Select() {
  const [open, setOpen] = useState<boolean>(false);
  const { selectedCube, cubes } = useTimerStore();
  const { settings } = useSettingsModalStore();
  const componentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className="flex justify-end relative w-[200px] sm:w-[300px]"
        ref={componentRef}
      >
        <button
          onClick={() => setOpen(!open)}
          className="max-w-[300px] w-full text-xs sm:text-sm appearance-none border bg-zinc-950 hover:bg-zinc-800 border-zinc-800 font-medium rounded-md px-4 py-2 transition duration-200"
        >
          <div className="flex items-center justify-between gap-2">
            {selectedCube ? (
              <MiniatureIcon category={selectedCube.category} />
            ) : null}
            <div className="">
              {selectedCube
                ? selectedCube.name
                : translation.inputs["select-cube"][settings.locale[0].lang]}
            </div>
            <SelectOptions />
          </div>
        </button>
        {open === true ? (
          <div
            id="list-options"
            className="absolute z-40 overflow-auto max-h-[400px] p-1 top-12 right-0 w-full bg-zinc-950 text-slate-100 h-auto border border-zinc-800 rounded-md"
          >
            {/* Favorites */}
            <LabelSection
              description={
                translation.inputs["favorites"][settings.locale[0].lang]
              }
            />
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
            <LabelSection
              description={translation.inputs["list"][settings.locale[0].lang]}
            />
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
  const { selectedCube, setSelectedCube, setNewScramble } = useTimerStore();

  return (
    <div
      onClick={() => {
        if (setSelectedCube && setNewScramble) {
          const cube = findCube({ cubeId: cubeId });
          if (cube) {
            setSelectedCube(cube);
            setNewScramble(cube);
          }
        }
        handleClose();
      }}
      className={`hover:bg-zinc-800 p-1 select-none rounded-md ps-2 flex items-center justify-between overflow-hidden ${
        selectedCube?.id === cubeId ? "bg-zinc-800" : null
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
  return <div className="p-1 text-xs ps-2 text-neutral-500">{description}</div>;
}

function AddCubeOption() {
  const { settings } = useSettingsModalStore();
  return (
    <div className="p-1 mt-1 border-t rounded-md cursor-pointer select-none  hover:bg-zinc-800 ps-2 border-zinc-800">
      <Link href="/cubes">
        <div className="flex items-center justify-start gap-2 align-middle">
          <PlusIcon />
          <div>{translation.inputs["add-cube"][settings.locale[0].lang]}</div>
        </div>
      </Link>
    </div>
  );
}
