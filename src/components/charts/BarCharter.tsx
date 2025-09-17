"use client";
import React from "react";

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

interface BarCharterProps {
  data: BarDatum[];
  title?: string;
  className?: string;
  maxBars?: number;
}

export default function BarCharter({ data, title, className, maxBars = 8 }: BarCharterProps) {
  const filtered = data.filter(d => (d.value || 0) > 0);
  const sorted = [...filtered].sort((a, b) => b.value - a.value).slice(0, maxBars);
  const max = sorted.reduce((m, d) => Math.max(m, d.value || 0), 0);

  const defaultColors = [
    "var(--primary)",
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#22c55e",
    "#06b6d4",
  ];

  return (
    <div className={"w-full " + (className || "") }>
      {title && (
        <div className="text-sm font-medium mb-2 opacity-80">{title}</div>
      )}
      {sorted.length === 0 ? (
        <div className="h-[240px] w-full flex items-center justify-center text-sm opacity-70 bg-muted/30 rounded">Sin datos suficientes</div>
      ) : (
        <div className="w-full space-y-2">
          {sorted.map((d, idx) => {
            const width = max > 0 ? Math.max(2, Math.round((d.value / max) * 100)) : 0;
            const color = d.color || defaultColors[idx % defaultColors.length];
            return (
              <div key={idx} className="w-full">
                <div className="flex items-center gap-2 mb-1 text-sm">
                  <span className="truncate flex-1" title={d.label}>{d.label}</span>
                  <span className="tabular-nums opacity-80">{d.value}</span>
                </div>
                <div className="w-full h-2 rounded bg-muted/40">
                  <div className="h-full rounded" style={{ width: width + '%', background: color }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
