'use client'
import QRCode from 'react-qr-code'
import { useTranslations } from 'next-intl'
import { useNexusConnectStore } from '../model/useNexusConnectStore'
import HowToConnectNexus from './HowToConnectNexus'

export default function ConnectQRInline() {
  const nexusConnectId = useNexusConnectStore((state) => state.nexusConnectId)
  const t = useTranslations('Index')

  if (!nexusConnectId) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div
        style={{
          backgroundColor: 'white',
          padding: 14,
          borderRadius: 16,
          maxWidth: 240,
          width: '100%'
        }}
      >
        <QRCode
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={nexusConnectId}
          level={'L'}
        />
      </div>
      <p className="max-w-xs text-center text-sm text-muted-foreground">{t('HomePage.nx-scan-hint')}</p>
      <HowToConnectNexus />
    </div>
  )
}
