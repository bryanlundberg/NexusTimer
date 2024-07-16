import useSolvesPage from "@/hooks/useSolvesPage";
import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import getBestTime from "@/lib/getBestTime";
import getDeviation from "@/lib/getDeviation";
import getMean from "@/lib/getMean";
import getWorstTime from "@/lib/getWorstTime";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

interface ShareMenuProps {
  submenuRef: React.RefObject<HTMLDivElement>;
  setShareSolveModal: (bool: boolean) => void;
}

export default function ShareMenu({
  submenuRef,
  setShareSolveModal,
}: ShareMenuProps) {
  const t = useTranslations("Index.SolvesPage");
  const locale = useLocale();
  const date = DateTime.now().setLocale(locale).toLocaleString();

  const { displaySolves } = useSolvesPage();

  function createClipboardSessionContent(
    type: "All" | "3" | "5" | "12" | "50" | "100",
    solves: Solve[] | null,
    date: String
  ) {
    if (!solves) return "";

    let dataSet: Solve[] = [];
    if (type === "All") {
      dataSet = [...solves];
    } else {
      dataSet = solves.slice(0, parseInt(type));
    }

    const average = getMean(dataSet);
    const worstTime = getWorstTime(dataSet);
    const bestTime = getBestTime({ solves: dataSet });
    const deviation = getDeviation(dataSet);

    // Header
    let content = `${t("share-stats-title")}: ${date} `;

    // summary
    content += `\n${t("average")} ${dataSet.length}: ${formatTime(
      average
    )} (σ = ${formatTime(deviation)})`;

    // Space row
    content += `\n \n`;

    // subtitle
    content += `${t("list-of-times")}:`;

    // Space row
    content += `\n \n`;

    // formatSolves

    let formattedDataSet = "";

    dataSet.sort((a, b) => a.endTime - b.endTime);

    for (let i = 0; i < dataSet.length; i++) {
      const parenthesis =
        worstTime === dataSet[i].time || bestTime === dataSet[i].time;

      formattedDataSet += `${i + 1}. ${parenthesis ? "(" : ""}${formatTime(
        dataSet[i].time
      )}${dataSet[i].plus2 ? "+" : ""}${parenthesis ? ")" : ""} ${
        dataSet[i].scramble
      }\n`;
    }

    // attach dataset
    content += formattedDataSet;

    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(content);
    }

    setShareSolveModal(false);
  }

  return (
    <div
      className="w-40 p-2 z-50 flex  flex-col gap-1 mt-1 bg-white rounded-md text-xs text-black"
      ref={submenuRef}
    >
      <p className="text-sm font-semibold">{t("share")}</p>

      <div
        className="flex justify-between items-center p-0 gap-1 py-2 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={() =>
          createClipboardSessionContent("5", displaySolves, date.toString())
        }
      >
        <div className="p-0">
          <span className="mx-1.5">{t("last")} Ao5</span>
        </div>
      </div>

      <div
        className="flex justify-between items-center p-0 gap-1 py-1 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={() =>
          createClipboardSessionContent("12", displaySolves, date.toString())
        }
      >
        <div className="p-0">
          <span className="mx-1.5">{t("last")} Ao12</span>
        </div>
      </div>

      <div
        className="flex justify-between items-center p-0 gap-1 py-1 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={() =>
          createClipboardSessionContent("All", displaySolves, date.toString())
        }
      >
        <div className="p-0">
          <span className="mx-1.5">{t("all")}</span>
        </div>
      </div>
    </div>
  );
}
