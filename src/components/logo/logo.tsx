import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Logo({ className, ...rest }: LogoProps) {
  return (
    <>
      <div
        {...rest}
        className={cn(
          "flex gap-2 justify-center items-center mx-auto",
          className
        )}
      >
        <p className="text-xl font-bold">Nexus</p>
        <Image
          src={"/logo.png"}
          alt="logo"
          width={320}
          height={100}
          className={"size-5 dark:invert invert-0"}
          draggable={false}
        />

        <p className="text-xl font-bold">Timer ™</p>
      </div>
    </>
  );
}
