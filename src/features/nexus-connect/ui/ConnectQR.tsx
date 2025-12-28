import QRCode from 'react-qr-code'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useNexusConnectStore } from '../model/useNexusConnectStore'
import Link from 'next/link'
import Image from 'next/image'

export default function ConnectQR() {
  const nexusConnectId = useNexusConnectStore((state) => state.nexusConnectId)

  if (!nexusConnectId) {
    return null
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Connect Your Device</DialogTitle>
        <DialogDescription className={'mb-3'}>
          Scan the QR code below with your Nexus Connect app to pair your device!
        </DialogDescription>

        <div
          style={{
            height: 'auto',
            margin: '0 auto',
            maxWidth: 256,
            width: '100%',
            backgroundColor: 'white',
            padding: 6
          }}
        >
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={nexusConnectId}
            level={'L'}
          />
        </div>
      </DialogHeader>
      <DialogDescription>
        <Link
          href={'https://c707vqzanp.ufs.sh/f/7SKMBzVlOB2HwGJzdKMHr2JoUKbvhputIcT4jNE5ldLg96OB'}
          target={'_blank'}
          rel={'noreferrer noopener'}
        >
          <Image
            src={'/utils/android-apk.webp'}
            alt={'Download Nexus Connect App'}
            width={200}
            height={60}
            className={'mx-auto'}
            unoptimized
          />
        </Link>
      </DialogDescription>
    </DialogContent>
  )
}
