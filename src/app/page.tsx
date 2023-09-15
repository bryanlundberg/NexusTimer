"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import { useRef, useState } from "react";
import { Cube } from "@/interfaces/Cube";
import genScramble from "@/lib/timer/genScramble";
import TimerWidgets from "@/components/TimerWidgets";
import { cubeCollection } from "@/lib/cubeCollection";

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

  console.log("eventRef" + eventRef.current);

  const cubeName = selectedCube === null ? "Select cube" : selectedCube.name;

  return (
    <>
      <HeaderTimer
        handleSelectedCube={handleSelectedCube}
        cubeName={cubeName}
        scramble={scramble}
      />
      <Timer />
      <TimerWidgets scramble={scramble} event={eventRef.current} />
    </>
  );
}
