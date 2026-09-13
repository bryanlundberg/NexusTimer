import { useId } from 'react'
import { type BrandIconProps, brandIconProps } from '@/shared/ui/brand-icons/brand-icon-props'

const INSTAGRAM_STOPS = ['#FFD600', '#FF7A00', '#FF0069', '#D300C5', '#7638FA']

export const InstagramIcon = ({ branded, ...props }: BrandIconProps) => {
  // useId output contains characters that break url(#...) references in some browsers.
  const gradientId = `ig-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const stroke = branded ? `url(#${gradientId})` : undefined

  return (
    <svg {...brandIconProps} {...props}>
      {branded && (
        <defs>
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="2" y1="22" x2="22" y2="2">
            {INSTAGRAM_STOPS.map((color, i) => (
              <stop key={color} offset={i / (INSTAGRAM_STOPS.length - 1)} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <rect x="2" y="2" width="20" height="20" rx="5" stroke={stroke} />
      <circle cx="12" cy="12" r="4" stroke={stroke} />
      <path d="M17.5 6.5h.01" stroke={stroke} />
    </svg>
  )
}
