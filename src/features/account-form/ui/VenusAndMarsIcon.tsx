import type { SVGProps } from 'react'
import { genderIconProps } from '@/features/account-form/ui/gender-icon-props'

export const VenusAndMarsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...genderIconProps} {...props}>
    <path d="M10 20h4" />
    <path d="M12 16v6" />
    <path d="M17 2h4v4" />
    <path d="m21 2-5.46 5.46" />
    <circle cx="12" cy="11" r="5" />
  </svg>
)
