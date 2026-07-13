'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Compass, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  connectSmartCube,
  type ConnectSmartCubeOptions,
  type SmartCubeConnection,
  type SmartCubeEvent
} from 'smartcube-web-bluetooth'
import { SmartCubeTimer } from '@/features/smart-cube/ui/SmartCubeTimer'
import { HowToConnectDialog } from '@/features/smart-cube/ui/HowToConnectDialog'

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error'
type Subscription = ReturnType<SmartCubeConnection['events$']['subscribe']>
type MacAddressProvider = NonNullable<ConnectSmartCubeOptions['macAddressProvider']>

const MAC_STORAGE_PREFIX = 'nexus-smartcube-mac:'
const MAC_PATTERN = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/

function readStoredMac(deviceId: string): string {
  try {
    return localStorage.getItem(MAC_STORAGE_PREFIX + deviceId) ?? ''
  } catch {
    return ''
  }
}

function writeStoredMac(deviceId: string, mac: string): void {
  try {
    localStorage.setItem(MAC_STORAGE_PREFIX + deviceId, mac)
  } catch {
    /* ignore */
  }
}

interface SmartCubeProps {
  // When provided, renders custom content while connected (e.g. the trainer's
  // own smart timer) instead of the default main-timer SmartCubeTimer. All the
  // connection lifecycle (connect/disconnect/MAC dialog) is reused as-is.
  renderConnected?: (connection: SmartCubeConnection) => ReactNode
  onCancel?: () => void
  cancelLabel?: string
}

export default function SmartCube({ renderConnected, onCancel, cancelLabel }: SmartCubeProps = {}) {
  const t = useTranslations('Index.HomePage')
  const [status, setStatus] = useState<ConnectionStatus>('idle')
  const [deviceName, setDeviceName] = useState<string | null>(null)
  const [connection, setConnection] = useState<SmartCubeConnection | null>(null)
  // null = not yet checked; false = unsupported (iOS/Safari).
  const [supportsBluetooth, setSupportsBluetooth] = useState<boolean | null>(null)
  const [macRequest, setMacRequest] = useState<{ deviceId: string } | null>(null)
  const [macInput, setMacInput] = useState('')
  const [macError, setMacError] = useState(false)

  const connectionRef = useRef<SmartCubeConnection | null>(null)
  const subscriptionRef = useRef<Subscription | null>(null)
  const macResolverRef = useRef<((mac: string | null) => void) | null>(null)

  const cleanup = () => {
    subscriptionRef.current?.unsubscribe()
    subscriptionRef.current = null
    connectionRef.current?.disconnect().catch(() => {})
    connectionRef.current = null
  }

  const resolveMacRequest = (mac: string | null) => {
    macResolverRef.current?.(mac)
    macResolverRef.current = null
    setMacRequest(null)
    setMacError(false)
  }

  useEffect(() => {
    setSupportsBluetooth(typeof navigator !== 'undefined' && 'bluetooth' in navigator && !!navigator.bluetooth)
  }, [])

  useEffect(() => {
    return () => {
      resolveMacRequest(null)
      cleanup()
    }
  }, [])

  // Last-resort MAC source (only on fallback): prompt for the MAC and resolve when submitted.
  const macAddressProvider: MacAddressProvider = (device, isFallbackCall) => {
    if (!isFallbackCall) return Promise.resolve(null)
    return new Promise<string | null>((resolve) => {
      macResolverRef.current = resolve
      setMacInput(readStoredMac(device.id))
      setMacError(false)
      setMacRequest({ deviceId: device.id })
    })
  }

  const handleConnect = async () => {
    try {
      setStatus('connecting')
      const newConnection = await connectSmartCube({ macAddressProvider })
      connectionRef.current = newConnection
      setConnection(newConnection)
      setDeviceName(newConnection.deviceName)

      console.log('[SmartCube] connected', {
        deviceName: newConnection.deviceName,
        deviceMAC: newConnection.deviceMAC,
        protocol: newConnection.protocol,
        capabilities: newConnection.capabilities
      })

      subscriptionRef.current = newConnection.events$.subscribe((event: SmartCubeEvent) => {
        if (event.type === 'DISCONNECT') {
          setStatus('idle')
          setDeviceName(null)
          setConnection(null)
        }
      })

      setStatus('connected')

      if (newConnection.capabilities.facelets) {
        await newConnection.sendCommand({ type: 'REQUEST_FACELETS' })
      }
      if (newConnection.capabilities.battery) {
        await newConnection.sendCommand({ type: 'REQUEST_BATTERY' })
      }
    } catch (error) {
      resolveMacRequest(null)
      cleanup()
      setConnection(null)

      if (error instanceof DOMException && error.name === 'NotFoundError') {
        setStatus('idle')
        return
      }

      setStatus('error')
      toast.error(t('connection-error'))
    }
  }

  const handleDisconnect = () => {
    cleanup()
    setConnection(null)
    setStatus('idle')
    setDeviceName(null)
  }

  const submitMac = () => {
    const mac = macInput.trim().toUpperCase()
    if (!MAC_PATTERN.test(mac)) {
      setMacError(true)
      return
    }
    if (macRequest) writeStoredMac(macRequest.deviceId, mac)
    resolveMacRequest(mac)
  }

  const isConnected = status === 'connected'

  if (supportsBluetooth === false) {
    return (
      <div className="flex flex-col grow items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium">Smart cube not available on this device</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Your browser doesn&apos;t support Web Bluetooth. Smart cube connection isn&apos;t available on iOS
          (Safari/PWA). Use Chrome on Android or desktop.
        </p>
      </div>
    )
  }

  if (macRequest) {
    return (
      <form
        className="flex w-full max-w-xs flex-col grow items-center justify-center gap-3 mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
          submitMac()
        }}
      >
        <p className="text-center text-sm text-muted-foreground">
          Couldn&apos;t read the cube&apos;s MAC automatically. Enter your Cube MAC address.
        </p>
        <Input
          autoFocus
          value={macInput}
          onChange={(e) => {
            setMacInput(e.target.value)
            setMacError(false)
          }}
          placeholder="AA:BB:CC:DD:EE:FF"
          aria-invalid={macError}
          className="text-center font-mono uppercase"
        />
        {macError && <p className="text-xs text-destructive">Invalid format. Expected AA:BB:CC:DD:EE:FF</p>}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => resolveMacRequest(null)}>
            Cancel
          </Button>
          <Button type="submit">Connect</Button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-col grow items-center justify-center gap-2 sm:gap-3 relative">
      {isConnected && connection && renderConnected && renderConnected(connection)}

      {isConnected && connection && !renderConnected && (
        <SmartCubeTimer
          connection={connection}
          secondaryActions={(onSync, gyroActive, onReset) => (
            <div className="absolute bottom-2 left-0 flex flex-col items-start gap-0.5">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onSync}
                className="h-7 px-2 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                {t('reset-state')}
              </Button>
              {gyroActive && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={onReset}
                  className="h-7 px-2 gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Compass className="size-3" />
                  {t('reset-orientation')}
                </Button>
              )}
            </div>
          )}
        />
      )}

      {isConnected ? (
        <div className="flex flex-col items-center gap-1">
          {deviceName && <span className="text-xs sm:text-sm text-muted-foreground">{deviceName}</span>}
          <Button onClick={handleDisconnect} variant="outline" size="sm" className="sm:h-9 sm:px-4 sm:text-sm">
            {t('disconnect')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleConnect}
              disabled={status === 'connecting'}
              variant="default"
              size="sm"
              className="sm:h-9 sm:px-4 sm:text-sm"
            >
              {status === 'connecting'
                ? t('connecting')
                : status === 'error'
                  ? t('retry-connection')
                  : t('connect-smart-cube')}
            </Button>

            <HowToConnectDialog />
          </div>

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {cancelLabel ?? 'Cancel'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
