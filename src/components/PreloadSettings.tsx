"use client";
import { usePreloadSettings } from "@/hooks/usePreloadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useBackgroundImageStore } from "@/store/BackgroundThemeStore";
import { ThemeProvider } from "./theme-provider";
export default function PreloadSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettingsModalStore();
  const theme = settings ? settings.theme.background.color : "light";
  const { backgroundImage } = useBackgroundImageStore();

  usePreloadSettings();

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme={theme}
        // enableSystem
        disableTransitionOnChange
      >
        <div
          className="flex flex-col justify-between max-h-dvh min-h-dvh gap-2  select-none bg-background overflow-hidden"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "",
            backgroundPosition: backgroundImage ? "center" : "",
            backgroundAttachment: backgroundImage ? "fixed" : "",
            backgroundRepeat: backgroundImage ? "no-repeat" : "",
            backgroundSize: backgroundImage ? "cover" : "",
          }}
        >
          {children}
        </div>
      </ThemeProvider>
    </>
  );
}
