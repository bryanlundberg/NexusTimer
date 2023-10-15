import { useTimerStore } from "@/store/timerStore";
import { useState } from "react";

export default function ManualMode() {
  const [value, setValue] = useState<string>("");
  const { selectedCube } = useTimerStore();

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setValue("");
        }}
      >
        <input
          autoComplete="off"
          name="time"
          type="number"
          placeholder="..."
          value={value}
          className="w-full h-20 text-6xl font-medium text-center border rounded-md outline-none appearance-none cursor-pointer bg-zinc-900 focus:cursor-text py-14 border-zinc-800 focus:border-neutral-300 text-nexutral-200"
          onChange={(e) => {
            if (!selectedCube) return;
            setValue(e.target.value);
          }}
        />
      </form>
    </>
  );
}
