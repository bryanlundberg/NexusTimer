"use client";
import { Solve } from "@/interfaces/Solve";
import convertToMs from "@/lib/convertToMs";
import formatTime from "@/lib/formatTime";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import { useState } from "react";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTranslations } from "next-intl";
import MenuSolveOptions from "../menu-solve-options/menu-solve-options";
import { Input } from "../ui/input";
import { useNXData } from '@/hooks/useNXData';

export default function ManualMode() {
  const { saveCube } = useNXData();
  const [value, setValue] = useState<string>("");
  const selectedCube = useTimerStore(store => store.selectedCube);
  const scramble = useTimerStore(store => store.scramble);
  const lastSolve = useTimerStore(store => store.lastSolve);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const setLastSolve = useTimerStore(store => store.setLastSolve);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);

  const settings = useSettingsModalStore(store => store.settings);
  const t = useTranslations("Index.HomePage");

  const isValidInput = (input: string) => {
    return /^[0-9]*$/.test(input) && parseInt(input) > 0;
  };

  if (!selectedCube) return null;

  return (
    <>
      <form
        className="flex flex-col items-center grow justify-center"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedCube) return;
          if (!scramble) return;
          if (parseInt(value) === 0 || value === "") return;

          const msTime = convertToMs(value);
          const now = Date.now();

          const newSolve: Solve = {
            id: genId(),
            startTime: now - msTime,
            endTime: Date.now(),
            scramble: scramble,
            bookmark: false,
            time: msTime,
            dnf: false,
            plus2: false,
            rating: Math.floor(Math.random() * 20) + scramble.length,
            cubeId: selectedCube.id,
            comment: "",
          };

          const updatedCube = {
            ...selectedCube,
            solves: {
              ...selectedCube.solves,
              session: [newSolve, ...selectedCube.solves.session],
            },
          }

          saveCube(updatedCube);
          setSelectedCube(updatedCube);
          setLastSolve({ ...newSolve });
          setNewScramble(selectedCube);
          setValue("");
        }}
      >
        <Input
          autoComplete="off"
          name="time"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="..."
          value={value}
          className={`w-full max-w-[500px] h-20 text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-center border rounded-md outline-hidden appearance-none cursor-pointer focus:cursor-text py-14`}
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
          <div className="mt-1 text-center font-mono">
            {t("preview")}: {formatTime(convertToMs(value))}{" "}
          </div>
        ) : null}
        {lastSolve && (
          <div className="mt-2 text-center font-mono text-muted-foreground">
            Last one: {formatTime(lastSolve.time)}
          </div>
        )}
      </form>
      {lastSolve && settings.features.quickActionButtons ? (
        <MenuSolveOptions
          solve={lastSolve}
          onDeleteSolve={() => setLastSolve(null)}
          caseOfUse="last-solve"
        />
      ) : null}
    </>
  );
}
