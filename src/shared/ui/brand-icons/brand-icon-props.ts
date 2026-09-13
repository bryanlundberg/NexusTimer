import type { SVGProps } from 'react'

export type BrandIconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & { branded?: boolean }

export const brandIconProps: SVGProps<SVGSVGElement> = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
}
