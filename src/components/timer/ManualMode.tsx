import { Solve } from "@/interfaces/Solve";
import convertToMs from "@/lib/convertToMs";
import formatTime from "@/lib/formatTime";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import { useState } from "react";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { Themes } from "@/interfaces/types/Themes";
import { saveCube } from "@/db/dbOperations";
import { useTranslations } from "next-intl";
import MenuSolveOptions from "../menu-solve-options/menu-solve-options";

const variation: Record<Themes, string> = {
  light: "bg-zinc-200 border-zinc-200 focus:border-neutral-300 text-black",
  dark: "bg-zinc-900 border-zinc-800 focus:border-neutral-300 text-neutral-200",
};

export default function ManualMode() {
  const [value, setValue] = useState<string>("");
  const {
    selectedCube,
    scramble,
    lastSolve,
    setNewScramble,
    setLastSolve,
    cubes,
    mergeUpdateSelectedCube,
    setTimerStatistics,
  } = useTimerStore();
  const { settings } = useSettingsModalStore();
  const t = useTranslations("Index.HomePage");

  const isValidInput = (input: string) => {
    if (/^[0-9]*$/.test(input) && parseInt(input) > 0) return true;
    else return false;
  };

  return (
    <>
      <form
        onSubmit={async (e) => {
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
            endTime: now,
            scramble: scramble,
            bookmark: false,
            time: msTime,
            dnf: false,
            plus2: false,
            rating: Math.floor(Math.random() * 20) + scramble.length,
            cubeId: selectedCube.id,
          };
          setLastSolve(newSolve);
          selectedCube.solves.session.push(newSolve);
          await saveCube({
            ...selectedCube,
            solves: selectedCube.solves,
          });
          mergeUpdateSelectedCube(selectedCube, cubes);
          setNewScramble(selectedCube);
          setTimerStatistics();
        }}
        className="flex flex-col items-center"
      >
        <input
          autoComplete="off"
          name="time"
          type="text"
          placeholder="..."
          value={value}
          className={`w-full max-w-[750px] h-20 text-6xl font-medium text-center border rounded-md outline-none appearance-none cursor-pointer focus:cursor-text py-14 ${
            variation[settings.theme.background.color]
          }`}
          onChange={(e) => {
            if (!selectedCube) return;
            if (
              (isValidInput(e.target.value) &&
                parseInt(e.target.value) <= 595959) ||
              e.target.value === ""
            ) {
              setValue(e.target.value);
            }
          }}
        />
        {value !== "" ? (
          <div className="mt-1 text-center">
            {t("preview")}: {formatTime(convertToMs(value))}{" "}
          </div>
        ) : null}
        {lastSolve && settings.features.quickActionButtons.status ? (
          <MenuSolveOptions solve={lastSolve} />
        ) : null}
      </form>
    </>
  );
}
