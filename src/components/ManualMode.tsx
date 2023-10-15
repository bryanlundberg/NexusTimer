import { Solve } from "@/interfaces/Solve";
import addSolve from "@/lib/addSolve";
import convertToMs from "@/lib/convertToMs";
import findCube from "@/lib/findCube";
import formatTime from "@/lib/formatTime";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import { useState } from "react";
import SolveOptions from "./SolveOptions";

export default function ManualMode() {
  const [value, setValue] = useState<string>("");
  const {
    selectedCube,
    scramble,
    lastSolve,
    setNewScramble,
    setLastSolve,
    setCubes,
    setSelectedCube,
  } = useTimerStore();

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!selectedCube) return;
          if (!scramble) return;
          if (parseInt(value) === 0 || value === "") return;
          setValue("");

          const msTime = convertToMs(value);
          const now = Date.now();
          const newSolve: Solve = {
            id: genId(),
            startTime: now - msTime,
            endTime: now + msTime,
            scramble: scramble,
            bookmark: false,
            time: msTime,
            dnf: false,
            plus2: false,
            rating: Math.floor(Math.random() * 20) + scramble.length,
            category: selectedCube.category,
            cubeId: selectedCube.id,
          };
          setLastSolve(newSolve);
          const newCubes = addSolve({
            cubeId: selectedCube.id,
            solve: newSolve,
          });
          setCubes(newCubes);
          const currentCube = findCube({ cubeId: selectedCube.id });
          if (currentCube) setSelectedCube(currentCube);
          setNewScramble(selectedCube);
        }}
        className="flex flex-col items-center"
      >
        <input
          autoComplete="off"
          name="time"
          type="number"
          placeholder="..."
          value={value}
          className="w-full max-w-[750px] h-20 text-6xl font-medium text-center border rounded-md outline-none appearance-none cursor-pointer bg-zinc-900 focus:cursor-text py-14 border-zinc-800 focus:border-neutral-300 text-nexutral-200"
          onChange={(e) => {
            if (!selectedCube) return;
            if (parseInt(e.target.value) <= 595959 || e.target.value === "") {
              setValue(e.target.value);
            }
          }}
        />
        {value !== "" ? (
          <div className="mt-1 text-center">
            Preview: {formatTime(convertToMs(value))}{" "}
          </div>
        ) : null}
        {lastSolve ? <SolveOptions solve={lastSolve} /> : null}
      </form>
    </>
  );
}
