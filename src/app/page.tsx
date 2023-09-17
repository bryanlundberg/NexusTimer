"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import { useEffect } from "react";
import TimerWidgets from "@/components/TimerWidgets";
import { useTimerStore } from "@/store/timerStore";
import loadCubes from "@/lib/loadCubes";

export default function Home() {
  const { setCubes } = useTimerStore();

  useEffect(() => {
    const getCubes = loadCubes();
    if (setCubes) setCubes(getCubes);
  }, []);

  return (
    <>
      <HeaderTimer />
      <Timer />
      <TimerWidgets />
    </>
  );
}
