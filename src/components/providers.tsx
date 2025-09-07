'use client';

import { LoaderProvider } from '@/components/loader/loader-context';
import LoaderOverlay from '@/components/loader/loader-overlay';
import PreloadSettings from '@/components/PreloadSettings';

export default function Providers({
  loaderProvider = true,
  children,
}: {
  children: React.ReactNode;
  loaderProvider?: boolean;
}) {
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
