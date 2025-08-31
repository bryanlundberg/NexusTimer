'use client';

import { LoaderProvider } from '@/components/loader/loader-context';
import LoaderOverlay from '@/components/loader/loader-overlay';
import dynamic from 'next/dynamic';
import AlertProvider from '@/components/alert/AlertProvider';

const PreloadSettings = dynamic(() => import('@/components/PreloadSettings'), { ssr: false });

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PreloadSettings>
        <LoaderProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </LoaderProvider>
      </PreloadSettings>
      <LoaderOverlay />
    </>
  );
}
