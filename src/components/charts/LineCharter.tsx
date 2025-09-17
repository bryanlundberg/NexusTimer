"use client";
import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import { ChartOptions, createChart, createTextWatermark, CreatePriceLineOptions, DeepPartial, LineSeries } from 'lightweight-charts';
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import moment from "moment/min/moment-with-locales";
import getBestTime from "@/lib/getBestTime";
import getWorstTime from "@/lib/getWorstTime";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import { convert } from "colorizr";

interface TimeObject {
  time: number;
  value: number;
}


export default function LineCharter({ dataSet }: { dataSet: Solve[] }) {
  const t = useTranslations("Index.StatsPage");
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const [showBestTime, setShowBestTime] = useState(true);
  const [showWorstTime, setShowWorstTime] = useState(true);
  const [showAverageTime, setShowAverageTime] = useState(true);
  const [showStandardDeviation, setShowStandardDeviation] = useState(true);


  useEffect(() => {
    const backgroundColor = convert(getComputedStyle(
      document.documentElement
    ).getPropertyValue("--card"), "rgb");
    const gridColor = "rgba(78,78,78,0.22)";
    const primaryColor = convert(getComputedStyle(
      document.documentElement
    ).getPropertyValue("--primary"), "rgb");

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: "gray",
        background: {
          color: backgroundColor,
        },
        attributionLogo: false
      },
      grid: {
        vertLines: {
          color: gridColor,
        },
        horzLines: {
          color: gridColor,
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
          color: primaryColor,
          width: 1,
          style: 2, // LineStyle.Dashed
          visible: true,
          labelVisible: false,
        },
        horzLine: {
          color: primaryColor,
          width: 1,
          style: 2, // LineStyle.Dashed
          visible: true,
          labelVisible: true,
          labelBackgroundColor: primaryColor,
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

      const reversedDataSet = [...dataSet].reverse();
      reversedDataSet.forEach((i: Solve, index: number) => {
        const timeIndex = index + 1;
        structuredData.push({
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

      const lineSeries = chart.addSeries(LineSeries,{
        lastValueVisible: false,
        priceLineVisible: false,
        lineWidth: 1.5 as any,
        color: primaryColor,
      });

      // Utility functions for statistics
      const getMeanTime = (data: TimeObject[]): number => {
        return data.length
          ? data.reduce(
              (total: number, timeObject: TimeObject) =>
                total + timeObject.value,
              0
            ) / data.length
          : 0;
      };

      const getStandardDeviation = (data: TimeObject[]): number => {
        if (data.length <= 1) return 0;

        const mean = getMeanTime(data);
        const squaredDifferences = data.map(item =>
          Math.pow(item.value - mean, 2)
        );

        const variance = squaredDifferences.reduce((sum, squaredDiff) =>
          sum + squaredDiff, 0
        ) / data.length;

        return Math.sqrt(variance);
      };

      if (showBestTime) {
        const bestTimeLine: CreatePriceLineOptions = {
          price: getBestTime({ solves: dataSet }),
          color: "#059669", // Green
          lineWidth: 1,
          lineStyle: 0, // Solid
          axisLabelVisible: true,
          title: `${t("best-time")}`,
        };
        lineSeries.createPriceLine(bestTimeLine);
      }

      if (showWorstTime) {
        const worstTimeLine: CreatePriceLineOptions = {
          price: getWorstTime(dataSet),
          color: "#DC2626", // Red
          lineWidth: 1,
          lineStyle: 0, // Solid
          axisLabelVisible: true,
          title: "Worst",
        };
        lineSeries.createPriceLine(worstTimeLine);
      }

      if (showAverageTime) {
        const meanTimeLine: CreatePriceLineOptions = {
          price: getMeanTime(structuredData),
          color: "#FBBF24", // Yellow
          lineWidth: 2,
          lineStyle: 2, // Dashed
          axisLabelVisible: true,
          title: `${t("average")}`,
        };
        lineSeries.createPriceLine(meanTimeLine);
      }

      if (showStandardDeviation) {
        const stdDev = getStandardDeviation(structuredData);
        const meanTime = getMeanTime(structuredData);

        // Upper bound (mean + stdDev)
        const upperBoundLine: CreatePriceLineOptions = {
          price: meanTime + stdDev,
          color: "#8B5CF6", // Purple
          lineWidth: 1,
          lineStyle: 3, // Dotted
          axisLabelVisible: true,
          title: `+σ`,
        };
        lineSeries.createPriceLine(upperBoundLine);

        // Lower bound (mean - stdDev)
        const lowerBoundLine: CreatePriceLineOptions = {
          price: Math.max(0, meanTime - stdDev),
          color: "#8B5CF6", // Purple
          lineWidth: 1,
          lineStyle: 3, // Dotted
          axisLabelVisible: true,
          title: `-σ`,
        };
        lineSeries.createPriceLine(lowerBoundLine);
      }

      lineSeries.setData(structuredData);
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
  }, [dataSet, locale, t, showBestTime, showWorstTime, showAverageTime, showStandardDeviation, resolvedTheme]);

  return (
    <div className="relative w-full">
      <div className="h-96">
        <div ref={chartContainerRef} className="w-full h-full"></div>
        <div
          ref={tooltipRef}
          className="absolute hidden p-2 text-sm bg-black bg-opacity-80 rounded shadow-lg z-10 text-white"
          style={{ pointerEvents: 'none' }}
        ></div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="best-time"
            checked={showBestTime}
            onCheckedChange={(e: boolean) => setShowBestTime(e)}
          />
          <label
            htmlFor="best-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Best Time
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="worst-time"
            checked={showWorstTime}
            onCheckedChange={(e: boolean) => setShowWorstTime(e)}
          />
          <label
            htmlFor="worst-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Worst Time
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="average-time"
            checked={showAverageTime}
            onCheckedChange={(e: boolean) => setShowAverageTime(e)}
          />
          <label
            htmlFor="average-time"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Average
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="standard-deviation"
            checked={showStandardDeviation}
            onCheckedChange={(e: boolean) => setShowStandardDeviation(e)}
          />
          <label
            htmlFor="standard-deviation"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Standard Deviation
          </label>
        </div>
      </div>
    </div>
  );
}
