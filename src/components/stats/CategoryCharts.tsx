"use client";

import React, { useMemo } from 'react';
import { useTimerStore } from '@/store/timerStore';
import type { Cube } from '@/interfaces/Cube';
import type { Solve } from '@/interfaces/Solve';
import formatTime from '@/lib/formatTime';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, XAxis, YAxis, } from 'recharts';

// Simple color palette (no gradients)
const COLORS = [
  "#6366F1", // indigo-500
  "#22C55E", // green-500
  "#E11D48", // rose-600
  "#F59E0B", // amber-500
  "#06B6D4", // cyan-500
  "#8B5CF6", // violet-500
  "#10B981", // emerald-500
  "#EF4444", // red-500
  "#3B82F6", // blue-500
  "#A855F7", // purple-500
];

function aggregateByCube(cubes: Cube[], category?: Cube["category"]) {
  const filtered = category
    ? cubes.filter((c) => c.category === category)
    : cubes;

  // Build entries { name, solvesCount, totalTimeMs }
  return filtered.map((cube) => {
    const solvesAll: Solve[] = [
      ...(cube.solves?.all || []),
      ...(cube.solves?.session || []),
    ];
    const successful = solvesAll.filter((s) => !s.dnf);
    const solvesCount = successful.length;
    const totalTimeMs = successful.reduce((acc, s) => acc + (s.time || 0), 0);
    return {
      id: cube.id,
      name: cube.name || "Cube",
      solvesCount,
      totalTimeMs,
    };
  });
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
      No data to display
    </div>
  );
}

export default function CategoryCharts() {
  const selectedCube = useTimerStore((s) => s.selectedCube);
  const cubes = useTimerStore((s) => s.cubes);

  const data = useMemo(() => {
    if (!selectedCube) return [] as ReturnType<typeof aggregateByCube>;
    const safeCubes = cubes ?? [];
    return aggregateByCube(safeCubes, selectedCube.category)
      .filter((e) => e.solvesCount > 0 || e.totalTimeMs > 0);
  }, [cubes, selectedCube]);

  const pieData = useMemo(() => {
    // Pie = total time by cube
    return data
      .filter((d) => d.totalTimeMs > 0)
      .map((d, i) => ({
        name: d.name,
        value: d.totalTimeMs,
        fill: COLORS[i % COLORS.length],
      }));
  }, [data]);

  const barData = useMemo(() => {
    // Bars = total solves by cube
    // Sort descending for nicer display
    return [...data]
      .sort((a, b) => b.solvesCount - a.solvesCount)
      .map((d, i) => ({
        name: d.name,
        solves: d.solvesCount,
        fill: COLORS[i % COLORS.length],
      }));
  }, [data]);

  const hasAny = pieData.length > 0 || barData.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Pie: Time by Cube */}
      <div className="p-3 border rounded-md bg-card/50">
        {pieData.length === 0 ? (
          <EmptyState />
        ) : (
          <ChartContainer
            className={"h-96"}
            config={pieData.reduce((acc, it) => {
              acc[it.name] = { label: it.name, color: it.fill };
              return acc;
            }, {} as Record<string, { label: string; color: string }>)}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={1}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={
                  <ChartTooltipContent
                    nameKey="name"
                    labelKey="name"
                    formatter={(value) => {
                      if (typeof value === "number") {
                        return (
                          <>
                            <span className="text-gray-400">Time</span>
                            <span className="ml-auto font-mono">{formatTime(value)}</span>
                          </>
                        );
                      }
                      return value as any;
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        )}
      </div>

      {/* Horizontal Bars: Solves by Cube */}
      <div className="p-3 border rounded-md bg-card/50">
        {barData.length === 0 ? (
          <EmptyState />
        ) : (
          <ChartContainer
            className={"h-96"}
            config={barData.reduce((acc, it) => {
              acc[it.name] = { label: it.name, color: it.fill };
              return acc;
            }, {} as Record<string, { label: string; color: string }>)}
          >
            <BarChart data={barData} layout="vertical" margin={{ left: 12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                width={0}
                tickLine={false}
                axisLine={false}
                hide
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={
                  <ChartTooltipContent
                    nameKey="name"
                    formatter={(value, name) => (
                      <>
                        <span className="text-gray-400">Solves</span>
                        <span className="ml-auto font-mono">{value as number}</span>
                      </>
                    )}
                  />
                }
              />
              <Bar dataKey="solves" radius={3}>
                <LabelList dataKey="name" position="outside" offset={8} fill="#fff" />
                {barData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </div>

      {!hasAny && (
        <div className="md:col-span-2">
          <EmptyState />
        </div>
      )}
    </div>
  );
}
