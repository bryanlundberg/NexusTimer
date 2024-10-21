import { cn } from "@/lib/utils";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import Image from "next/image";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Logo({ className, ...rest }: LogoProps) {
  const { settings } = useSettingsModalStore();
  return (
    <>
      <div
        {...rest}
        className={cn("flex gap-2 items-center mx-auto", className)}
      >
        <Image
          src={"/logo.png"}
          alt="logo"
          width={320}
          height={100}
          className={`size-10 ${
            settings.theme.background.color === "dark" ? "invert" : "invert-0"
          }`}
          draggable={false}
        />

        <p className="text-2xl font-bold">Nexus Timer</p>
      </div>
    </>
  );
}
