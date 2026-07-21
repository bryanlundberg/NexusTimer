import { Space_Grotesk, Chakra_Petch } from 'next/font/google'

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
})

export const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-chakra',
  display: 'swap'
})
