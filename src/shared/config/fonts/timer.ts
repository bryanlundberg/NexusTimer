import { Bebas_Neue, Inter, JetBrains_Mono, Oxanium, Press_Start_2P, Space_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const dsDigital = localFont({
  src: './ds-digital/ds-digital.ttf',
  display: 'swap',
  preload: false
})

export const inter = Inter({ subsets: ['latin'], weight: '400', display: 'swap', preload: false })

export const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: '400', display: 'swap', preload: false })

export const spaceMono = Space_Mono({ subsets: ['latin'], weight: '400', display: 'swap', preload: false })

export const oxanium = Oxanium({ subsets: ['latin'], weight: '400', display: 'swap', preload: false })

export const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400', display: 'swap', preload: false })

export const pressStart2P = Press_Start_2P({ subsets: ['latin'], weight: '400', display: 'swap', preload: false })
