"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import { useState } from "react";
import { Cube } from "@/interfaces/Cube";

export default function Home() {
  const [selectedCube, setSelectedCube] = useState<Cube | null>(null);
  const handleSelectedCube = (cube: Cube) => {
    setSelectedCube(cube);
  };

  const cubeName = selectedCube === null ? "Select cube" : selectedCube.name;
  return (
    <>
      <HeaderTimer
        handleSelectedCube={handleSelectedCube}
        cubeName={cubeName}
      />
      <Timer />
    </>
  );
}
