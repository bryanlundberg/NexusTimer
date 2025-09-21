"use client";
import React from "react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import RECORDS from '@/constants/records';

interface RecordsRadarProps {
  users?: Array<{ name?: string } | undefined>;
  className?: string;
}

export default function RecordsRadar({ users = [], className }: RecordsRadarProps) {
  const [u1, u2] = users;

  const u1Key = u1?.name || 'User 1';
  const u2Key = u2?.name || 'User 2';

  const entries = Object.entries(RECORDS) as Array<[
    string,
    { best: number; average: number }
  ]>;

  const data = entries.map(([event, rec]) => ({
    metric: event,
    [u1Key]: rec.best,
    [u2Key]: rec.average,
  }));

  const maxValue = entries.reduce((m, [, r]) => Math.max(m, r.best, r.average), 0);

  const config = {
    [u1Key]: { label: u1Key, color: 'var(--chart-1)' },
    [u2Key]: { label: u2Key, color: 'var(--chart-2)' },
  } as const;

  return (
    <ChartContainer config={config} className={(className ? className + ' ' : '') + 'h-72 w-full'}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid radialLines={false} />
        <PolarAngleAxis dataKey="metric" tickLine={false} />
        <PolarRadiusAxis tick={false} axisLine={false} domain={[0, maxValue]} />
        {u1 && (
          <Radar
            name={u1Key}
            dataKey={u1Key}
            stroke="var(--chart-1)"
            fill="transparent"
            fillOpacity={0}
          />
        )}
        {u2 && (
          <Radar
            name={u2Key}
            dataKey={u2Key}
            stroke="var(--chart-2)"
            fill="transparent"
            fillOpacity={0}
          />
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}
