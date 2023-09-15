import PlusIcon from "@/icons/PlusIcon";
import SelectOptions from "@/icons/SelectOptions";
import { useState } from "react";
import Image from "next/image";
import Check from "@/icons/Check";
import Link from "next/link";
import { Cube } from "@/interfaces/Cube";
import { Categories } from "@/interfaces/Categories";
import { cubeCollection } from "@/lib/cubeCollection";
import genId from "@/lib/genId";

export default function Select({
  options,
  handleChange,
}: {
  options: any[];
  handleChange: any;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [choosedId, setChoosedId] = useState<string>("");
  console.log(choosedId);
  const handleChoosed = (cubeId: string) => {
    setChoosedId(cubeId);
    handleChange(cubeId);
  };

  return (
    <>
      <div className="relative p-2">
        <button
          onClick={() => setOpen(!open)}
          className="min-w-[250px] text-xs appearance-none border bg-transparent hover:bg-zinc-800 border-zinc-800 font-medium rounded-md px-4 py-2"
        >
          <div className="flex justify-between">
            <div className="">Select Cube</div>
            <SelectOptions />
          </div>
        </button>
        {open === true ? (
          <div
            id="list-options"
            className="absolute overflow-auto max-h-[400px] p-1 top-12 left-0 min-w-full max-w-full bg-zinc-950 text-slate-100 h-auto border border-zinc-800 rounded-md"
          >
            {/* Favorites */}
            <LabelSection description="Favorite" />
            {options.map((cube) => {
              if (cube.favorite) {
                return (
                  <Option
                    key={genId()}
                    name={cube.name}
                    category={cube.category}
                    choosedCube={choosedId}
                    handleChoosed={handleChoosed}
                    cubeId={cube.id}
                  />
                );
              }
            })}
            <LabelSection description="Cubes" />
            {options.map((cube) => {
              return (
                <Option
                  key={genId()}
                  name={cube.name}
                  category={cube.category}
                  choosedCube={choosedId}
                  handleChoosed={handleChoosed}
                  cubeId={cube.id}
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
    if (option.id === category) {
      return (
        <Image
          key={genId()}
          src={option.src}
          alt={option.id}
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
  choosedCube,
  cubeId,
  handleChoosed,
}: {
  name: string;
  category: Categories;
  choosedCube: string;
  cubeId: string;
  handleChoosed: any;
}) {
  return (
    <div
      onClick={() => handleChoosed(cubeId)}
      className={`hover:bg-zinc-800 p-1 select-none rounded-md ps-2 flex items-center justify-between overflow-hidden ${
        choosedCube === cubeId ? "bg-zinc-800" : null
      }`}
    >
      <div className="flex justify-start gap-3">
        <MiniatureIcon category={category} />
        <div className="overflow-hidden">{name}</div>
      </div>
      {choosedCube === cubeId && (
        <div className="w-4 h-4 me-3 text-xs">
          <Check />
        </div>
      )}
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
