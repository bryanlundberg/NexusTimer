import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
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
    priceFormatter: (time: number) => {
      const timeT = formatTime(time);
      console.log(time);
      return timeT;
    },
    timeFormatter: (time: number) => {
      return time.toString();
    },
  },
  timeScale: {
    tickMarkFormatter: (time: number) => {
      return time.toString();
    },
  },
  priceScale: {
    autoScale: false,
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

  useEffect(() => {
    const container = chartContainerRef.current;
    if (container) {
      container.innerHTML = "";
      const chart = createChart(container, chartOptions);
      const dataArray = cubeSelected ? data.cubeAll : data.global;
      const structuredData: any = sort(
        dataArray.map((i: Solve, index: number) => ({
          time: index,
          value: i.time,
        }))
      ).asc((u: any) => u.time);

      const lineSeries = chart.addLineSeries({
        color: cubeSelected ? "#2962FF" : "#F4D03F",
      });

      lineSeries.setData(structuredData);

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
  }, [data, cubeSelected]);

  return <div ref={chartContainerRef} className="w-full h-full"></div>;
}
