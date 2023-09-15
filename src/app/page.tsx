"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import { useState } from "react";
import { Cube } from "@/interfaces/Cube";
import genScramble from "@/lib/timer/genScramble";

export default function Home() {
  const [selectedCube, setSelectedCube] = useState<Cube | null>(null);
  const [scramble, setScramble] = useState<string | null>(null);

  const handleSelectedCube = (cube: Cube) => {
    setSelectedCube(cube);
    const newScramble = genScramble(cube.category);
    setScramble(newScramble);
  };

  const cubeName = selectedCube === null ? "Select cube" : selectedCube.name;

  return (
    <>
      <HeaderTimer
        handleSelectedCube={handleSelectedCube}
        cubeName={cubeName}
        scramble={scramble}
      />
      <Timer />
    </>
  );
}
