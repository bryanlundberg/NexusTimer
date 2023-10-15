import { Solve } from "@/interfaces/Solve";
import { sort } from "fast-sort";
import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

const chartOptions: any = {
  layout: {
    textColor: "white",
    background: { type: "solid", color: "transparent" },
  },
  grid: {
    vertLines: {
      color: "rgb(41, 44, 58)",
    },
    horzLines: {
      color: "rgb(41, 44, 58)",
    },
  },
  localization: {
    timeFormatter: (time: number) => {
      return time.toString();
    },
  },
  timeScale: {
    tickMarkFormatter: (time: number) => {
      return time.toString();
    },
  },
};

export default function LineCharter({
  data,
  cubeSelected,
}: {
  data: any;
  cubeSelected: boolean;
}) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const global: any = [];
  const cubeAll: any = [];

  useEffect(() => {
    const container = chartContainerRef.current;
    if (container) {
      container.innerHTML = "";
      const chart = createChart(container, chartOptions);
      if (cubeSelected) {
        data.cubeAll.map((i: Solve, index: number) => {
          cubeAll.push({ time: index, value: i.time / 1000 });
        });
        const cubeAllStructuredData: any = sort(cubeAll).asc(
          (u: any) => u.time
        );
        const cubeAllLine = chart.addLineSeries({ color: "#ffffff" });
        cubeAllLine.setData(cubeAllStructuredData);
      } else {
        data.global.map((i: Solve, index: number) => {
          global.push({ time: index, value: i.time / 1000 });
        });
        const globalStructuredData: any = sort(global).asc((u: any) => u.time);
        const globalLine = chart.addLineSeries({ color: "#2962FF" });
        globalLine.setData(globalStructuredData);
      }
      chart.autoSizeActive();
      chart.timeScale().fitContent();
      // Make chart responsive with screen resize
      new ResizeObserver((entries) => {
        if (entries.length === 0 || entries[0].target !== container) {
          return;
        }
        const newRect = entries[0].contentRect;
        chart.applyOptions({ height: newRect.height, width: newRect.width });
      }).observe(container);
    }
  });

  return <div ref={chartContainerRef} className="w-full h-full"></div>;
}
