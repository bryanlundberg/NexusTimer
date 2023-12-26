import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { CreatePriceLineOptions, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
import translation from "@/translations/global.json";
import getBestTime from "@/lib/getBestTime";

type TimeObject = {
  time: number;
  value: number;
};

export default function LineCharter({
  data,
  cubeSelected,
  optInChart,
}: {
  data: any;
  cubeSelected: boolean;
  optInChart: {
    mean: boolean;
    best: boolean;
  };
}) {
  const { lang } = useSettingsModalStore();
  const { settings } = useSettingsModalStore();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chartOptions: any = {
      layout: {
        textColor:
          settings.theme.background.color === "dark" ? "white" : "gray",
        background: {
          type: "solid",
          color:
            settings.theme.background.color === "dark" ? "#09090B" : "#F5F5F5",
        },
      },
      grid: {
        vertLines: {
          color:
            settings.theme.background.color === "dark"
              ? "rgb(41, 44, 58)"
              : "rgb(229 229 229)",
        },
        horzLines: {
          color:
            settings.theme.background.color === "dark"
              ? "rgb(41, 44, 58)"
              : "rgb(229 229 229)",
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
        fixRightEdge: true,
        fixLeftEdge: true,
      },
      areaStyle: {
        lineColor: "black",
      },
    };

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
        color: cubeSelected
          ? "#0891B2"
          : settings.theme.background.color === "dark"
          ? "white"
          : "black",
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
        color: "#FBBF24",
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: `${translation.timer["mean"][lang]}`,
      };

      const bestTimeLine: CreatePriceLineOptions = {
        price: getBestTime({ solves: dataArray }),
        color: "#059669",
        lineWidth: 1,
        lineStyle: 0,
        axisLabelVisible: true,
        title: `${translation.timer["best"][lang]}`,
      };

      lineSeries.setData(structuredData);
      optInChart.mean ? lineSeries.createPriceLine(meanTimeLine) : null;
      optInChart.best ? lineSeries.createPriceLine(bestTimeLine) : null;

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
  }, [
    data,
    cubeSelected,
    lang,
    settings.theme.background.color,
    optInChart.best,
    optInChart.mean,
  ]);

  return <div ref={chartContainerRef} className="w-full h-full"></div>;
}
