"use client";
import React from "react";

export interface PieDatum {
  label: string;
  value: number;
  color?: string;
}

interface PieCharterProps {
  data: PieDatum[];
  title?: string;
  className?: string;
}

// A lightweight, dependency-free pie chart using SVG arcs
export default function PieCharter({ data, title, className }: PieCharterProps) {
  const total = data.reduce((a, b) => a + (b.value || 0), 0);
  const size = 240; // px
  const radius = size / 2;
  const stroke = radius; // full pie (donut feel by lowering stroke)
  const center = radius;

  // Fallback palette from CSS vars
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

  let cumulative = 0;
  const segments = total > 0 ? data.map((d, i) => {
    const value = d.value || 0;
    const start = cumulative / total;
    const end = (cumulative + value) / total;
    cumulative += value;
    const largeArc = end - start > 0.5 ? 1 : 0;

    // Convert to polar coordinates
    const startAngle = 2 * Math.PI * (start - 0.25); // start at -90deg (top)
    const endAngle = 2 * Math.PI * (end - 0.25);

    const x1 = center + Math.cos(startAngle) * radius;
    const y1 = center + Math.sin(startAngle) * radius;
    const x2 = center + Math.cos(endAngle) * radius;
    const y2 = center + Math.sin(endAngle) * radius;

    const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      pathData,
      color: d.color || defaultColors[i % defaultColors.length],
      label: d.label,
      value: d.value,
      percent: total ? Math.round((d.value / total) * 100) : 0,
    };
  }) : [];

  return (
    <div className={"w-full " + (className || "") }>
      {title && (
        <div className="text-sm font-medium mb-2 opacity-80">{title}</div>
      )}
      <div className="flex items-center gap-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
          {total === 0 ? (
            <circle cx={center} cy={center} r={radius} fill="rgba(128,128,128,0.15)" />
          ) : (
            segments.map((s, idx) => (
              <path key={idx} d={s.pathData} fill={s.color} opacity={0.9} />
            ))
          )}
        </svg>
        <div className="flex-1 min-w-0">
          {total === 0 ? (
            <div className="text-sm opacity-70">No data</div>
          ) : (
            <ul className="space-y-1 text-sm">
              {segments.map((s, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ background: s.color }} />
                  <span className="truncate">{s.label}</span>
                  <span className="ml-auto tabular-nums opacity-80">{s.percent}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
