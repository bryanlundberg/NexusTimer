import { type BrandIconProps, brandIconProps } from '@/shared/ui/brand-icons/brand-icon-props'

export const YoutubeIcon = ({ branded, ...props }: BrandIconProps) =>
  branded ? (
    <svg {...brandIconProps} {...props} stroke="none">
      <rect x="1.5" y="4.5" width="21" height="15" rx="4.5" fill="#FF0000" />
      <path d="M10 8.75v6.5L15.5 12z" fill="#FFFFFF" />
    </svg>
  ) : (
    <svg {...brandIconProps} {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3z" />
    </svg>
  )
