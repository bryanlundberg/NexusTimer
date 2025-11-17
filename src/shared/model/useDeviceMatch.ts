import { useEffect, useState } from 'react'

type Device = 'Mobile' | 'Desktop'

export default function useDeviceMatch() {
  const [device, setDevice] = useState<Device>('Desktop')

  useEffect(() => {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      setDevice('Mobile')
    } else {
      setDevice('Desktop')
    }
  }, [])

  return {
    device
  }
}
