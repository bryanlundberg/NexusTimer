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
import { Themes } from "@/interfaces/types/Themes";
import { useCubesModalStore } from "@/store/CubesModalStore";

export default function Select() {
  const [open, setOpen] = useState<boolean>(false);
  const { selectedCube, cubes } = useTimerStore();
  const { lang, settings } = useSettingsModalStore();
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

  const variation: Record<Themes, string> = {
    light: "shadow-black bg-neutral-100 hover:bg-neutral-200",
    dark: "bg-zinc-950 hover:bg-zinc-800 border-zinc-800",
  };

  // split components in diferent files.
  const variation2: Record<Themes, string> = {
    light: "bg-neutral-100",
    dark: "border-zinc-800 bg-zinc-950 text-slate-100",
  };

  return (
    <>
      <div
        className="flex justify-end relative w-[200px] sm:w-[300px]"
        ref={componentRef}
      >
        <button
          onClick={() => setOpen(!open)}
          className={`max-w-[300px] w-full text-xs sm:text-sm appearance-none border  font-medium rounded-md px-4 py-2 transition duration-200 ${
            variation[settings.theme.background.color]
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            {selectedCube ? (
              <MiniatureIcon category={selectedCube.category} />
            ) : null}
            <div className="">
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
            className={`absolute z-40 overflow-auto max-h-[400px] p-1 top-12 right-0 w-full  h-auto border  rounded-md ${
              variation2[settings.theme.background.color]
            }`}
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
  const { settings } = useSettingsModalStore();

  const variation: Record<Themes, string> = {
    light: "hover:bg-zinc-700 hover:text-neutral-100",
    dark: "hover:bg-zinc-800",
  };

  const variation2: Record<Themes, string> = {
    light: "bg-zinc-800 text-neutral-200",
    dark: "bg-zinc-800",
  };

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
      className={` p-1 select-none rounded-md ps-2 flex items-center justify-between overflow-hidden ${
        variation[settings.theme.background.color]
      } ${
        selectedCube?.id === cubeId
          ? `${variation2[settings.theme.background.color]}`
          : null
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
  const { settings } = useSettingsModalStore();
  const { setModalOpen } = useCubesModalStore();

  const variation: Record<Themes, string> = {
    light: "border-zinc-800 hover:bg-zinc-700 hover:text-neutral-100",
    dark: "border-zinc-800 hover:bg-zinc-800",
  };
  return (
    <div
      className={`p-1 mt-1 border-t rounded-md cursor-pointer select-none ps-2 ${
        variation[settings.theme.background.color]
      }`}
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
