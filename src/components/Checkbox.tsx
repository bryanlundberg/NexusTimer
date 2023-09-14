import Check from "@/icons/Check";
import Favorite from "@/icons/Favorite";
import { useState } from "react";

export default function Checkbox() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
  };
  return (
    <button
      onClick={handleCheckboxClick}
      aria-pressed={isChecked}
      type="button"
      className={`w-4 h-4 mx-auto rounded-md border ${
        isChecked
          ? "bg-white text-black"
          : "border-zinc-800 text-transparent hover:bg-zinc-900"
      } text-sm flex justify-center items-center`}
    >
      <Favorite />
    </button>
  );
}
