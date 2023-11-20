import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { CreatePriceLineOptions, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
import translation from "@/translations/global.json";
import getBestTime from "@/lib/getBestTime";

const chartOptions: any = {
  layout: {
    textColor: "white",
    background: { type: "solid", color: "black" },
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

type TimeObject = {
  time: number;
  value: number;
};

export default function LineCharter({
  data,
  cubeSelected,
}: {
  data: any;
  cubeSelected: boolean;
}) {
  const { lang } = useSettingsModalStore();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (container) {
      container.innerHTML = "";
      const chart = createChart(container, chartOptions);
      const dataArray = cubeSelected ? data.cubeAll : data.global;
      const structuredData: any[] = [];
      dataArray.forEach((i: Solve, index: number) => {
        structuredData.unshift({
          time: dataArray.length - index,
          value: i.time,
        });
      });

      const lineSeries = chart.addLineSeries({
        color: cubeSelected ? "cyan" : "white",
        lastValueVisible: false,
        priceLineVisible: false,
        lineWidth: 1,
      });

      const getMeanTime = (data: TimeObject[]) => {
        return data.length
          ? data.reduce(
              (total: number, timeObject: TimeObject) =>
                total + timeObject.value,
              0
            ) / data.length
          : 0;
      };

      const meanTimeLine: CreatePriceLineOptions = {
        price: getMeanTime(structuredData),
        color: "yellow",
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: `${translation.timer["mean"][lang]}`,
      };

      const bestTimeLine: CreatePriceLineOptions = {
        price: getBestTime({ solves: dataArray }),
        color: "green",
        lineWidth: 1,
        lineStyle: 0,
        axisLabelVisible: true,
        title: `${translation.timer["best"][lang]}`,
      };

      lineSeries.setData(structuredData);
      lineSeries.createPriceLine(meanTimeLine);
      cubeSelected ? null : lineSeries.createPriceLine(bestTimeLine);

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
  }, [data, cubeSelected, lang]);

  return <div ref={chartContainerRef} className="w-full h-full"></div>;
}
