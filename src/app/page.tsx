"use client";
import Timer from "@/components/Timer";
import HeaderTimer from "@/components/HeaderTimer";
import TimerWidgets from "@/components/TimerWidgets";

export default function Home() {
  return (
    <>
      <div className="grow flex flex-col justify-between">
        <HeaderTimer />
        <Timer />
        <TimerWidgets />
      </div>
    </>
  );
}
