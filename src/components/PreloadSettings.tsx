'use client';
import { usePreloadSettings } from '@/hooks/usePreloadSettings';
import { useBackgroundImageStore } from '@/store/BackgroundThemeStore';
import { ThemeProvider } from './theme-provider';
import { ReactNode } from 'react';

export default function PreloadSettings({
  children
}: {
  children: ReactNode;
}) {
  const backgroundImage = useBackgroundImageStore(state => state.backgroundImage);
  const { isMounted } = usePreloadSettings();

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme={'system'}
        enableSystem
        disableTransitionOnChange
      >
        {isMounted ? (
          <div
            className="flex flex-col justify-between max-h-dvh min-h-dvh gap-2 select-none bg-background overflow-hidden"
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : '',
              backgroundPosition: backgroundImage ? 'center' : '',
              backgroundAttachment: backgroundImage ? 'fixed' : '',
              backgroundRepeat: backgroundImage ? 'no-repeat' : '',
              backgroundSize: backgroundImage ? 'cover' : ''
            }}
          >
            {children}
          </div>
        ) : null}
      </ThemeProvider>
    </>
  );
}
