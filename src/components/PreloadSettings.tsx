"use client";
import { usePreloadSettings } from "@/hooks/usePreloadSettings";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";
import { ThemeProvider } from "./theme-provider";
import { ReactNode } from "react";

export default function PreloadSettings({
  children
}: {
  children: ReactNode;
}) {
  const { backgroundImage } = useBackgroundImageStore();
  const { isMounted } = usePreloadSettings();

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme={"system"}
        enableSystem
        disableTransitionOnChange
      >
        <div
          className="flex flex-col justify-between max-h-dvh min-h-dvh gap-2 select-none bg-background overflow-hidden"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "",
            backgroundPosition: backgroundImage ? "center" : "",
            backgroundAttachment: backgroundImage ? "fixed" : "",
            backgroundRepeat: backgroundImage ? "no-repeat" : "",
            backgroundSize: backgroundImage ? "cover" : ""
          }}
        >
          {isMounted ? children : null}
        </div>
      </ThemeProvider>
    </>
  );
}
