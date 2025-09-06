'use client';
import { usePreloadSettings } from '@/hooks/usePreloadSettings';
import { useBackgroundImageStore } from '@/store/BackgroundThemeStore';
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
      {isMounted ? (
        <div
          className="flex flex-col justify-between gap-2 select-none bg-background grow"
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
    </>
  );
}
