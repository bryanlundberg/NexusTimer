import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { CreatePriceLineOptions, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
import translation from "@/translations/global.json";

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
        console.log({ time: index, value: i.time });
        structuredData.unshift({
          time: dataArray.length - index,
          value: i.time,
        });
      });

      const lineSeries = chart.addLineSeries({
        color: cubeSelected ? "#2962FF" : "#F4D03F",
        lastValueVisible: false,
        priceLineVisible: false,
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
        color: "#ff4d4d",
        lineWidth: 1,
        lineStyle: 0,
        axisLabelVisible: true,
        title: `${translation.timer["mean"][lang]}`,
      };

      lineSeries.setData(structuredData);
      lineSeries.createPriceLine(meanTimeLine);

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
