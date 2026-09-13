import type { SVGProps } from 'react'
import { genderIconProps } from '@/features/account-form/ui/gender-icon-props'

export const VenusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...genderIconProps} {...props}>
    <circle cx="12" cy="9" r="6" />
    <path d="M12 15v7" />
    <path d="M9 19h6" />
  </svg>
)
