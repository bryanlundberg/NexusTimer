import { type BrandIconProps, brandIconProps } from '@/shared/ui/brand-icons/brand-icon-props'

export const TiktokIcon = ({ branded, style, ...props }: BrandIconProps) => (
  <svg
    {...brandIconProps}
    {...props}
    style={branded ? { ...style, filter: 'drop-shadow(-1px -1px 0 #25F4EE) drop-shadow(1px 1px 0 #FE2C55)' } : style}
  >
    <path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5" />
  </svg>
)
