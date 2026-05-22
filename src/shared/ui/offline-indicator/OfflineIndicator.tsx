'use client'
import { useTranslations } from 'next-intl'
import { useIsOnline } from 'react-use-is-online'

/**
 * Thin red bar pinned to the top of the viewport, shown only while the device
 * is offline. Sits above the notch via the safe-area inset and stays out of
 * the way (non-interactive) when connectivity returns.
 */
export function OfflineIndicator() {
  const { isOnline } = useIsOnline()
  const t = useTranslations('Index')

  if (isOnline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-100 flex items-center justify-center bg-red-600 text-white text-[11px] font-medium leading-none tracking-wide pointer-events-none"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2px)', paddingBottom: '2px' }}
    >
      {t('Offline.offline')}
    </div>
  )
}
