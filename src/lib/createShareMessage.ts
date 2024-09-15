import { Solve } from "@/interfaces/Solve";
import getMean from "./getMean";
import getWorstTime from "./getWorstTime";
import getBestTime from "./getBestTime";
import getDeviation from "./getDeviation";
import formatTime from "./formatTime";

interface createShareMessage {
  type: "All" | "3" | "5" | "12" | "50" | "100";
  solves: Solve[] | null;
  translations: {
    statsTitle: string;
    avg: string;
    listOfTimes: string;
    date: string;
  };
}

export function createShareMessage({
  type,
  solves,
  translations: { statsTitle, avg, listOfTimes, date },
}: createShareMessage) {
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
  let content = `${statsTitle}: ${date} `;

  // summary
  content += `\n${avg} ${dataSet.length}: ${formatTime(
    average
  )} (σ = ${formatTime(deviation)})`;

  // Space row
  content += `\n \n`;

  // subtitle
  content += listOfTimes;

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
  return (content += formattedDataSet);
}
