'use client';

import { LoaderProvider } from '@/components/loader/loader-context';
import LoaderOverlay from '@/components/loader/loader-overlay';
import PreloadSettings from '@/components/PreloadSettings';
import { useEffect } from 'react';
import { useSettingsModalStore } from '@/store/SettingsModalStore';
import useWebsiteColors from '@/hooks/useWebsiteColors';

export default function Providers({
  loaderProvider = true,
  children,
}: {
  children: React.ReactNode;
  loaderProvider?: boolean;
}) {

  const settings = useSettingsModalStore(store => store.settings);
  const { applyColorTheme } = useWebsiteColors();

  useEffect(() => {
    applyColorTheme(settings.preferences.colorTheme);
  }, [applyColorTheme, settings.preferences.colorTheme]);

  return (
    <>
      <PreloadSettings>
        {loaderProvider ? (
          <LoaderProvider>
            {children}
          </LoaderProvider>
        ) : (
          <>{children}</>
        )}
      </PreloadSettings>
      <LoaderOverlay/>
    </>
  );
}
