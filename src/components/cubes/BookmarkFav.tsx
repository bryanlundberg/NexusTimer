import FavoriteSolid from "@/icons/FavoriteSolid";
import { Cube } from "@/interfaces/Cube";
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
      <FavoriteSolid />
    </button>
  );
}
