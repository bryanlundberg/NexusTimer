import { Cube } from "@/interfaces/Cube";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function BookmarkFav({
  isChecked,
  setFavorite,
  cube,
}: {
  isChecked: boolean;
  setFavorite: (cube: Cube) => void;
  cube: Cube;
}) {
  const [checked, setChecked] = useState(isChecked);

  return (
    <button
      onClick={() => {
        setFavorite(cube);
        setChecked(!checked);
      }}
      aria-pressed={checked}
      type="button"
      className={`w-4 h-4 mx-auto rounded-md border light:border-neutral-400  dark:border-zinc-600 ${
        checked ? "bg-transparent text-yellow-500" : "text-transparent"
      } text-sm flex justify-center items-center`}
    >
      <StarIcon className="w-6 h-6" />
    </button>
  );
}
