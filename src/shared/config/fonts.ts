import { Saira, Source_Code_Pro } from 'next/font/google'

const saira = Saira({
  subsets: ['latin'],
  variable: '--font-saira',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const numericMono = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-mono-numeric',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700']
})

export { saira, numericMono }
