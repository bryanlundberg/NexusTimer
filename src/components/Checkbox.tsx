import Check from "@/icons/Check";

export default function Checkbox() {
  return (
    <button
      type="button"
      className="w-6 h-6 mx-auto rounded-md border border-zinc-800 justify-center items-center hover:bg-zinc-900 text-sm flex checked:bg-white checked:text-black"
    >
      <Check />
    </button>
  );
}
