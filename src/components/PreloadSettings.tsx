"use client";
import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";
import loadCubes from "@/lib/loadCubes";
import loadSettings from "@/lib/loadSettings";

export default function PreloadSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCubes } = useTimerStore();

  useEffect(() => {
    const getCubes = loadCubes();
    loadSettings();
    if (setCubes) setCubes(getCubes);
  }, [setCubes]);

  return <>{children}</>;
}
