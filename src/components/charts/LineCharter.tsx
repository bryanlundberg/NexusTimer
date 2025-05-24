"use client";

import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import {
  ChartOptions,
  createChart,
  CreatePriceLineOptions,
  createTextWatermark,
  DeepPartial, HistogramSeries,
  LineSeries
} from 'lightweight-charts';
import { useEffect, useRef } from "react";
import getBestTime from "@/lib/getBestTime";
import { useTranslations } from "next-intl";

type TimeObject = {
  time: number;
  value: number;
};

export default function LineCharter({ dataSet }: { dataSet: Solve[] }) {
  const t = useTranslations("Index.StatsPage");
  const { settings } = useSettingsModalStore();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const backgroundColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--background");

    const gridColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--border");

    const lineColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--primary");

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: "gray",
        background: {
          color: `hsl(${backgroundColor})`,
        },
        attributionLogo: false
      },
      grid: {
        vertLines: {
          color: `hsl(${gridColor})`,
        },
        horzLines: {
          color: `hsl(${gridColor})`,
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
        allowBoldLabels: false,
      },
      kineticScroll: {
        mouse: true,
      },
      handleScale: {
        axisPressedMouseMove: {
          price: false,
        },
      },
    };
    const container = chartContainerRef.current;
    if (container) {
      container.innerHTML = "";
      const chart = createChart(container, chartOptions);
      const structuredData: any[] = [];
      dataSet.forEach((i: Solve, index: number) => {
        structuredData.unshift({
          time: dataSet.length - index,
          value: i.time,
        });
      });

      const firstPane = chart.panes()[0];

      createTextWatermark(firstPane, {
        horzAlign: 'center',
        vertAlign: 'center',
        lines: [{
          text: 'nexustimer.com',
          color: 'rgba(120,120,120, 0.1)',
          fontSize: 24,
        }],
      });

      const lineSeries = chart.addSeries(HistogramSeries,{
        lastValueVisible: false,
        priceLineVisible: false,
        // lineWidth: 1,
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

      // const meanTimeLine: CreatePriceLineOptions = {
      //   price: getMeanTime(structuredData),
      //   color: "#FBBF24",
      //   lineWidth: 2,
      //   lineStyle: 2,
      //   axisLabelVisible: true,
      //   title: `${t("average")}`,
      // };
      //
      // const bestTimeLine: CreatePriceLineOptions = {
      //   price: getBestTime({ solves: dataSet }),
      //   color: "#059669",
      //   lineWidth: 1,
      //   lineStyle: 0,
      //   axisLabelVisible: true,
      //   title: `${t("best-time")}`,
      // };

      lineSeries.setData(structuredData);
      // lineSeries.createPriceLine(meanTimeLine);
      // lineSeries.createPriceLine(bestTimeLine);

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
  }, [dataSet, t, settings.theme.background.color]);

  return <div ref={chartContainerRef} className="w-full h-96"></div>;
}
