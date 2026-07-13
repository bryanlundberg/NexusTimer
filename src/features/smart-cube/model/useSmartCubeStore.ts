import { create } from 'zustand'
import {
  connectSmartCube,
  type ConnectSmartCubeOptions,
  type SmartCubeConnection,
  type SmartCubeEvent
} from 'smartcube-web-bluetooth'

export type SmartCubeStatus = 'idle' | 'connecting' | 'connected' | 'error'
export type SmartCubeConnectResult = 'connected' | 'cancelled' | 'error'

type MacAddressProvider = NonNullable<ConnectSmartCubeOptions['macAddressProvider']>
type Subscription = ReturnType<SmartCubeConnection['events$']['subscribe']>

// Non-reactive module refs. They live for the whole app session so the Bluetooth
// connection survives client-side navigation (the store never unmounts). The
// connection is only torn down by an explicit `disconnect()` or a hardware
// DISCONNECT event - never by a component unmounting.
let subscription: Subscription | null = null
let macResolver: ((mac: string | null) => void) | null = null

const teardownSubscription = () => {
  subscription?.unsubscribe()
  subscription = null
}

interface SmartCubeState {
  status: SmartCubeStatus
  connection: SmartCubeConnection | null
  deviceName: string | null
  // Set when the library needs a MAC address entered manually (fallback). The UI
  // renders a dialog and resolves it via `provideMac`.
  macRequest: { deviceId: string } | null

  connect: () => Promise<SmartCubeConnectResult>
  disconnect: () => void
  provideMac: (mac: string | null) => void
}

export const useSmartCubeStore = create<SmartCubeState>((set, get) => {
  const macAddressProvider: MacAddressProvider = (device, isFallbackCall) => {
    if (!isFallbackCall) return Promise.resolve(null)
    return new Promise<string | null>((resolve) => {
      macResolver = resolve
      set({ macRequest: { deviceId: device.id } })
    })
  }

  return {
    status: 'idle',
    connection: null,
    deviceName: null,
    macRequest: null,

    connect: async () => {
      const current = get()
      if (current.status === 'connected' && current.connection) return 'connected'
      if (current.status === 'connecting') return 'cancelled'

      set({ status: 'connecting' })
      try {
        const connection = await connectSmartCube({ macAddressProvider })

        teardownSubscription()
        subscription = connection.events$.subscribe((event: SmartCubeEvent) => {
          if (event.type === 'DISCONNECT') {
            teardownSubscription()
            set({ status: 'idle', connection: null, deviceName: null })
          }
        })

        set({ status: 'connected', connection, deviceName: connection.deviceName })

        if (connection.capabilities.facelets) {
          try {
            await connection.sendCommand({ type: 'REQUEST_FACELETS' })
          } catch {}
        }
        if (connection.capabilities.battery) {
          try {
            await connection.sendCommand({ type: 'REQUEST_BATTERY' })
          } catch {}
        }
        return 'connected'
      } catch (error) {
        macResolver?.(null)
        macResolver = null
        teardownSubscription()
        get()
          .connection?.disconnect()
          .catch(() => {})
        set({ connection: null, deviceName: null, macRequest: null })

        // The user dismissed the browser device picker: not an error.
        if (error instanceof DOMException && error.name === 'NotFoundError') {
          set({ status: 'idle' })
          return 'cancelled'
        }
        set({ status: 'error' })
        return 'error'
      }
    },

    disconnect: () => {
      macResolver?.(null)
      macResolver = null
      teardownSubscription()
      get()
        .connection?.disconnect()
        .catch(() => {})
      set({ status: 'idle', connection: null, deviceName: null, macRequest: null })
    },

    provideMac: (mac) => {
      macResolver?.(mac)
      macResolver = null
      set({ macRequest: null })
    }
  }
})
