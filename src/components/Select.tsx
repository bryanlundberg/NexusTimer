import PlusIcon from "@/icons/PlusIcon";
import SelectOptions from "@/icons/SelectOptions";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Categories } from "@/interfaces/Categories";
import { cubeCollection } from "@/lib/cubeCollection";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import findCube from "@/lib/findCube";

export default function Select() {
  const [open, setOpen] = useState<boolean>(false);
  const { selectedCube, cubes } = useTimerStore();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-end relative w-[200px] sm:w-[250px]">
        <button
          onClick={() => setOpen(!open)}
          className="max-w-[250px] w-full text-xs appearance-none border bg-zinc-950 hover:bg-zinc-800 border-zinc-800 font-medium rounded-md px-4 py-2 transition duration-200"
        >
          <div className="flex justify-between items-center">
            {selectedCube ? (
              <MiniatureIcon category={selectedCube.category} />
            ) : null}
            <div className="">
              {selectedCube ? selectedCube.name : "Select"}
            </div>
            <SelectOptions />
          </div>
        </button>
        {open === true ? (
          <div
            id="list-options"
            className="absolute z-40 overflow-auto max-h-[400px] p-1 top-10 right-0 w-full bg-zinc-950 text-slate-100 h-auto border border-zinc-800 rounded-md"
          >
            {/* Favorites */}
            <LabelSection description="Favorite" />
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
            <LabelSection description="Cubes" />
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
  return <div className="p-1 ps-2 text-xs text-neutral-500">{description}</div>;
}

function AddCubeOption() {
  return (
    <div className=" mt-1 cursor-pointer hover:bg-zinc-800 p-1 select-none rounded-md ps-2 border-t border-zinc-800">
      <Link href="/cubes">
        <div className="flex justify-start items-center align-middle gap-2">
          <PlusIcon />
          <div>Add Cube</div>
        </div>
      </Link>
    </div>
  );
}
