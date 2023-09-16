"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import { useRef, useState } from "react";
import { Cube } from "@/interfaces/Cube";
import genScramble from "@/lib/timer/genScramble";
import TimerWidgets from "@/components/TimerWidgets";
import { cubeCollection } from "@/lib/cubeCollection";
import { Solve } from "@/interfaces/Solve";
import addSolve from "@/lib/addSolve";

export default function Home() {
  const [selectedCube, setSelectedCube] = useState<Cube | null>(null);
  const [scramble, setScramble] = useState<string | null>(null);

  const eventRef = useRef<any>(null);

  const handleSelectedCube = (cube: Cube) => {
    setSelectedCube(cube);
    const newScramble = genScramble(cube.category);
    setScramble(newScramble);
    eventRef.current = cubeCollection.find(
      (item) => item.name === cube.category
    );
  };

  const handleNewSolve = (solve: Solve) => {
    if (selectedCube) addSolve({ cubeId: selectedCube?.id, solve });
  };

  const cubeName = selectedCube === null ? "Select cube" : selectedCube.name;

  return (
    <>
      <HeaderTimer
        handleSelectedCube={handleSelectedCube}
        cubeName={cubeName}
        scramble={scramble}
      />
      <Timer
        scramble={scramble}
        cube={selectedCube}
        handleNewSolve={handleNewSolve}
      />
      <TimerWidgets scramble={scramble} event={eventRef.current} />
    </>
  );
}
