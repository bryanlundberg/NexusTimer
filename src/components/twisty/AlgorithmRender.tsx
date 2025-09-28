"use client";

import React, { useEffect, useRef } from "react";
import { TwistyPlayer } from "cubing/twisty";

interface TwistyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  config?: Partial<TwistyPlayer>
}

export default function AlgorithmRender({
  className,
  width = 140,
  height = 140,
  config,
  ...rest
}: TwistyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const existing = containerRef.current.querySelector("twisty-player");
    if (existing) existing.remove();

    const player = new TwistyPlayer(config);

    containerRef.current.appendChild(player);

    player.style.width = typeof width === "number" ? `${width}px` : width;
    player.style.height = typeof height === "number" ? `${height}px` : height;
    player.style.maxWidth = "100%";
    player.style.borderRadius = "8px";

    return () => {
      player.remove();
    };
  }, [width, height, config]);

  return (
    <div
      {...rest}
      ref={containerRef}
      className={className}
    />
  );
}
