import Favorite from "@/icons/Favorite";
import { useState } from "react";

export default function BookmarkFav({
  isChecked,
  setFavorite,
  cubeId,
}: {
  isChecked: boolean;
  setFavorite: any;
  cubeId: string;
}) {
  const [checked, setChecked] = useState(isChecked);

  return (
    <button
      onClick={() => {
        setFavorite(cubeId);
        setChecked(!checked);
      }}
      aria-pressed={checked}
      type="button"
      className={`w-4 h-4 mx-auto rounded-md border light:border-neutral-300 dark:border-zinc-800 ${
        checked ? "bg-transparent text-yellow-500" : "text-transparent"
      } text-sm flex justify-center items-center`}
    >
      <Favorite />
    </button>
  );
}