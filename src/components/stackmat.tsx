"use client";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Packet } from "stackmat";
import { toast } from "sonner";
import { TimerStatus } from "@/enums/TimerStatus";
import { useNXData } from '@/hooks/useNXData';

// more information: https://www.npmjs.com/package/stackmat
declare global {
  interface Window {
    Stackmat?: any;
  }
}

export default function Stackmat() {
  const { getAllCubes, getCubeById, saveCube } = useNXData();
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube);
  const cubes = useTimerStore((state) => state.cubes);
  const setCubes = useTimerStore((state) => state.setCubes);
  const setNewScramble = useTimerStore((state) => state.setNewScramble);
  const setLastSolve = useTimerStore((state) => state.setLastSolve);
  const setSolvingTime = useTimerStore((state) => state.setSolvingTime);
  const setIsSolving = useTimerStore((state) => state.setIsSolving);
  const timerStatus = useTimerStore((state) => state.timerStatus);
  const setTimerStatus = useTimerStore((state) => state.setTimerStatus);
  const scramble = useTimerStore((state) => state.scramble);

  const [stackmat, setStackmat] = useState<any>(null);
  const solvingIdRef = useRef<any>(null);

  useEffect(() => {
    if (stackmat) {
      let startTime: any = null;
      const onStarted = (packet: Packet) => {
        if (!selectedCube || !scramble) {
          return;
        }

        setIsSolving(true);
        setTimerStatus(TimerStatus.SOLVING);
        startTime = Date.now();

        if (!solvingIdRef.current) {
          solvingIdRef.current = setInterval(() => {
            setSolvingTime(Date.now() - startTime);
          }, 100);
        }
      };
      const onReset = async (packet: Packet) => {
        if (!solvingIdRef.current || !selectedCube || !scramble) return;
        clearInterval(solvingIdRef.current);
        solvingIdRef.current = null;

        setSolvingTime(packet.timeInMilliseconds);
        setIsSolving(false);
        setTimerStatus(TimerStatus.IDLE);
        const newSolve: Solve = {
          id: genId(),
          startTime: Date.now() - packet.timeInMilliseconds,
          endTime: Date.now(),
          scramble: scramble,
          bookmark: false,
          time: packet.timeInMilliseconds,
          dnf: false,
          plus2: false,
          rating: Math.floor(Math.random() * 20) + scramble.length,
          cubeId: selectedCube.id,
          comment: "",
        };

        const cube = cubes?.find((u) => u.id === selectedCube.id);

        if (cube) {
          await saveCube({
            ...cube,
            solves: {
              ...cube.solves,
              session: [...cube.solves.session, newSolve],
            },
          });
        }

        const updatedCubes = await getAllCubes();
        if (updatedCubes) {
          setCubes([...updatedCubes]);
        }

        const updatedCube = await getCubeById(selectedCube.id);
        if (updatedCube) {
          setSelectedCube({ ...updatedCube });
        }

        setLastSolve({ ...newSolve });

        setNewScramble(selectedCube);
      };

      const onConnected = (packet: Packet) => {
        toast("Device connected");
      };
      const onDisconnected = (packet: Packet) => {
        toast("Device disconnected");
      };

      /*
        TESTED SECTION
        ----------------
        The following events have been thoroughly tested using the QIYI Timer V2.
        They ensure controlled behavior for handling timer events:

        - Issue reported: Some users are unable to stop the timer.
      */

      stackmat.on("started", onStarted);
      stackmat.on("reset", onReset);
      stackmat.on("timerConnected", onConnected);
      stackmat.on("timerDisconnected", onDisconnected);

      /*
        EXPERIMENTAL SECTION
        ---------------------
        The following event is experimental and has not been tested.
        It was implemented based on the standard controller library's documentation
        to handle potential edge cases where events might be missing for certain users.

        Event:
        - "stopped": This event is expected to trigger when the timer stops.
      */

      stackmat.on("stopped", onReset);

      return () => {
        stackmat.off("started", onStarted);
        stackmat.off("reset", onReset);
        stackmat.off("timerConnected", onConnected);
        stackmat.off("timerDisconnected", onDisconnected);
        stackmat.off("stopped", onReset);
      };
    }
  }, [stackmat, setIsSolving, setSolvingTime, setTimerStatus, selectedCube, scramble, cubes, setCubes, setSelectedCube, setLastSolve, setNewScramble, timerStatus, getAllCubes, getCubeById, saveCube]);

  useEffect(() => {
    if (stackmat) {
      stackmat.start();
    }
  }, [stackmat]);

  return (
    <>
      <Script
        src="https://unpkg.com/stackmat"
        type="text/javascript"
        onReady={() => {
          if (window.Stackmat) {
            setStackmat(new window.Stackmat());
          }
        }}
      />
    </>
  );
}
