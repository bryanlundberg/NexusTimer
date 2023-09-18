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
      className={`w-4 h-4 mx-auto rounded-md border ${
        checked
          ? "bg-zinc-800 text-yellow-500 border-yellow-500"
          : "border-zinc-800 text-transparent hover:bg-zinc-900"
      } text-sm flex justify-center items-center`}
    >
      <Favorite />
    </button>
  );
}
