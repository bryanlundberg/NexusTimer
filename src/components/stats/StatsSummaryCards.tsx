"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { TrophyIcon, GaugeIcon, TimerIcon, PercentIcon } from 'lucide-react';

export type StatsSummaryCardsProps = {
  best: string;
  overallAverage: string;
  ao5Current: string;
  successRate: string;
};

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex flex-row items-center gap-3 p-3 border rounded-md bg-card backdrop-blur-lg">
      <div className="inline-flex items-center justify-center rounded-md bg-primary/10 text-primary p-2">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-lg font-bold leading-none">{value}</span>
      </div>
    </Card>
  );
}

export default function StatsSummaryCards({
  best,
  overallAverage,
  ao5Current,
  successRate,
}: StatsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatItem icon={<TrophyIcon className={"size-5"}/>} label="Best Time" value={best} />
      <StatItem icon={<GaugeIcon className={"size-5"}/>} label="Overall Average" value={overallAverage} />
      <StatItem icon={<TimerIcon className={"size-5"}/>} label="Ao5 (Current)" value={ao5Current} />
      <StatItem icon={<PercentIcon className={"size-5"}/>} label="Success Rate" value={successRate} />
    </div>
  );
}
