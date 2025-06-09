"use client";
import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import { ChartOptions, createChart, createTextWatermark, DeepPartial, HistogramSeries } from 'lightweight-charts';
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import moment from "moment/min/moment-with-locales";


export default function LineCharter({ dataSet }: { dataSet: Solve[] }) {
  const t = useTranslations("Index.StatsPage");
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const locale = useLocale();

  useEffect(() => {
    const backgroundColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--background");

    const gridColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--border");

    const primaryColor = getComputedStyle(
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
          return formatTime(time);
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
      crosshair: {
        mode: 1, // CrosshairMode.Normal
        vertLine: {
          color: `hsl(${primaryColor})`,
          width: 1,
          style: 2, // LineStyle.Dashed
          visible: true,
          labelVisible: false,
        },
        horzLine: {
          color: `hsl(${primaryColor})`,
          width: 1,
          style: 2, // LineStyle.Dashed
          visible: true,
          labelVisible: true,
          labelBackgroundColor: `hsl(${primaryColor})`,
        },
      },
    };
    const container = chartContainerRef.current;
    const tooltip = tooltipRef.current;

    if (container && tooltip) {
      container.innerHTML = "";
      const chart = createChart(container, chartOptions);
      const structuredData: any[] = [];
      const solveMap = new Map<number, Solve>();

      dataSet.forEach((i: Solve, index: number) => {
        const timeIndex = dataSet.length - index;
        structuredData.unshift({
          time: timeIndex,
          value: i.time,
        });
        solveMap.set(timeIndex, i);
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
        color: `hsl(${primaryColor})`,
      });

      // const getMeanTime = (data: TimeObject[]) => {
      //   return data.length
      //     ? data.reduce(
      //         (total: number, timeObject: TimeObject) =>
      //           total + timeObject.value,
      //         0
      //       ) / data.length
      //     : 0;
      // };

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

      // Setup custom tooltip
      chart.subscribeCrosshairMove((param) => {
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > container.clientWidth ||
          param.point.y < 0 ||
          param.point.y > container.clientHeight
        ) {
          tooltip.style.display = 'none';
          return;
        }

        const solve = solveMap.get(param.time as number);
        if (!solve) {
          tooltip.style.display = 'none';
          return;
        }

        moment.locale(locale);

        let tooltipContent = `
          <div class="font-bold text-base">${formatTime(solve.time)}</div>
          <div class="text-xs opacity-80">Solve #${param.time}</div>
          <div class="mt-1 text-xs">${moment(solve.endTime).format('LL')}</div>
        `;

        if (solve.dnf) {
          tooltipContent += `<div class="mt-1 text-xs text-red-500">DNF</div>`;
        } else if (solve.plus2) {
          tooltipContent += `<div class="mt-1 text-xs text-yellow-500">+2</div>`;
        }

        tooltip.innerHTML = tooltipContent;
        tooltip.style.display = 'block';

        const tooltipWidth = tooltip.clientWidth;
        const tooltipHeight = tooltip.clientHeight;
        const chartRect = container.getBoundingClientRect();

        // Position the tooltip
        let left = param.point.x + 15;
        if (left + tooltipWidth > chartRect.width) {
          left = param.point.x - tooltipWidth - 15;
        }

        let top = param.point.y - tooltipHeight - 10;
        if (top < 0) {
          top = param.point.y + 15;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });

      // Make chart responsive with screen resize
      new ResizeObserver((entries) => {
        if (entries.length === 0 || entries[0].target !== container) {
          return;
        }
        const newRect = entries[0].contentRect;
        chart.applyOptions({ height: newRect.height, width: newRect.width });
      }).observe(container);
    }
  }, [dataSet, locale, t]);

  return (
    <div className="relative w-full h-96">
      <div ref={chartContainerRef} className="w-full h-full"></div>
      <div
        ref={tooltipRef}
        className="absolute hidden p-2 text-sm bg-black bg-opacity-80 rounded shadow-lg z-10 text-white"
        style={{ pointerEvents: 'none' }}
      ></div>
    </div>
  );
}
