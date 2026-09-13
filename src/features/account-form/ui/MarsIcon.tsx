import type { SVGProps } from 'react'
import { genderIconProps } from '@/features/account-form/ui/gender-icon-props'

export const MarsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...genderIconProps} {...props}>
    <path d="M16 3h5v5" />
    <path d="m21 3-6.75 6.75" />
    <circle cx="10" cy="14" r="6" />
  </svg>
)
