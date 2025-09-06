'use client';

import { LoaderProvider } from '@/components/loader/loader-context';
import LoaderOverlay from '@/components/loader/loader-overlay';
import dynamic from 'next/dynamic';

const PreloadSettings = dynamic(() => import('@/components/PreloadSettings'), { ssr: false });

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
