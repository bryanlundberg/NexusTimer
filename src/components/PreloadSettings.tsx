"use client";
import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";
import loadCubes from "@/lib/loadCubes";

export default function PreloadSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCubes } = useTimerStore();

  useEffect(() => {
    const getCubes = loadCubes();
    if (setCubes) setCubes(getCubes);
  }, [setCubes]);

  return <>{children}</>;
}
