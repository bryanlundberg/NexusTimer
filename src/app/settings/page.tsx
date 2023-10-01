"use client";

import ArrowLeft from "@/icons/ArrowLeft";
import Toggle from "@/components/headless/Toggle";
import Link from "next/link";
import Language from "@/icons/Language";
import CpuChip from "@/icons/CpuChip";
import BellAlert from "@/icons/BellAlert";
import Clock from "@/icons/Clock";

export default function SettingsPage() {
  return (
    <>
      <div className="bg-neutral-50 rounded-lg text-zinc-800 grow w-full md:max-w-6xl mx-auto flex flex-col gap-3 min-h-full">
        <div className="text-center font-medium text-2xl mt-3">Settings</div>
        <div className="absolute top-8 left-8">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </div>
        <div className="ps-20 pe-10 overflow-auto">
          <div className="mb-3">
            <div className="text-blue-500 mb-3 relative">
              <div>Locale</div>
              <div className="absolute right-56 bottom-0">
                <Language />
              </div>
            </div>
            <div className="flex justify-between">
              <div>language</div>
              <select name="a" id="a">
                <option value="a">US</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-blue-500 mb-3 relative">
              <div>Timer</div>
              <div className="absolute right-56 bottom-0">
                <Clock />
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div>Inspection</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Inspection duration</div>
              <input type="number" className="w-10" value={15} />
            </div>
            <div className="flex justify-between mb-2">
              <div>Start cue</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Hold to start</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Back cancels solve</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Manual mode</div>
              <Toggle />
            </div>
          </div>

          <div className="mb-3">
            <div className="text-blue-500 mb-3 relative">
              <div>Timer</div>
              <div className="absolute right-56 bottom-0">
                <BellAlert />
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div>Best time</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Best average</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Worst time</div>
              <Toggle />
            </div>
          </div>

          <div className="mb-3">
            <div className="text-blue-500 mb-3 relative">
              <div>Features</div>
              <div className="absolute right-56 bottom-0">
                <CpuChip />
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div>Scramble image</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Session stats</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Quick action buttons</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Hide time while solving</div>
              <Toggle />
            </div>
            <div className="flex justify-between mb-2">
              <div>Scramble background</div>
              <Toggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
