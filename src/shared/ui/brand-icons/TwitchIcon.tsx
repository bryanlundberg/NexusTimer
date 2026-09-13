import { type BrandIconProps, brandIconProps } from '@/shared/ui/brand-icons/brand-icon-props'

export const TwitchIcon = ({ branded, ...props }: BrandIconProps) => (
  <svg {...brandIconProps} {...props} stroke={branded ? '#9146FF' : 'currentColor'}>
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2z" />
    <path d="M11 11V7" />
    <path d="M16 11V7" />
  </svg>
)
