import genId from "@/lib/genId";

type TypesSelect = "Category" | "Cube";

export default function Select({
  type,
  options,
  handleChange,
  currentSelection,
}: {
  type: TypesSelect;
  options: any[];
  handleChange: any;
  currentSelection: any;
}) {
  return (
    <>
      <select
        value={currentSelection}
        onChange={(e) => {
          e.target.blur();
          handleChange(type, e.target.value);
        }}
        className="font-medium bg-transparent border border-zinc-800 text-neutral-300 text-sm rounded-lg focus:bg-zinc-950 focus:border-zinc-800 block min-w-40 p-2 px-3"
      >
        {options.map((option) => {
          return (
            <option
              value={type === "Category" ? option : option.id}
              key={genId()}
            >
              {type === "Category" ? option : option.name}
            </option>
          );
        })}
      </select>
    </>
  );
}
