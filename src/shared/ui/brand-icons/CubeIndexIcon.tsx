import { useId } from 'react'
import { type BrandIconProps, brandIconProps } from '@/shared/ui/brand-icons/brand-icon-props'

const RAYS =
  'M12 12L29 12L28.42 16.4zM12 12L26.72 20.5L24.02 24.02zM12 12L20.5 26.72L16.4 28.42zM12 12L12 29L7.6 28.42zM12 12L3.5 26.72L-0.02 24.02zM12 12L-2.72 20.5L-4.42 16.4zM12 12L-5 12L-4.42 7.6zM12 12L-2.72 3.5L-0.02 -0.02zM12 12L3.5 -2.72L7.6 -4.42zM12 12L12 -5L16.4 -4.42zM12 12L20.5 -2.72L24.02 -0.02zM12 12L26.72 3.5L28.42 7.6z'

const CUBE_GRID =
  'M7.53 7l5.2 3M9.27 6l5.2 3M7.53 9l5.2-3M9.27 10l5.2-3M7.53 9v6.5M9.27 10v6.5M5.8 10.17l5.2 3M5.8 12.33l5.2 3M12.73 10v6.5M14.47 9v6.5M11 13.17l5.2-3M11 15.33l5.2-3'

export const CubeIndexIcon = ({ branded, ...props }: BrandIconProps) => {
  const id = `ci-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  if (!branded) {
    return (
      <svg {...brandIconProps} {...props}>
        <path d="M9 2l6 3.5v7L9 16l-6-3.5v-7z" />
        <path d="M3 5.5 9 9l6-3.5M9 9v7" />
        <ellipse cx="18" cy="16" rx="3" ry="1.25" />
        <path d="M15 16v5a3 1.25 0 0 0 6 0v-5" />
      </svg>
    )
  }

  return (
    <svg {...brandIconProps} {...props} stroke="none">
      <defs>
        <radialGradient id={`${id}-bg`} cx="12" cy="12" r="15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6AA8FF" />
          <stop offset="1" stopColor="#1C5BD4" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" />
        </clipPath>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill={`url(#${id}-bg)`} />
      <path d={RAYS} fill="#FFFFFF" fillOpacity="0.12" clipPath={`url(#${id}-clip)`} />
      <g stroke="#1C5BD4" strokeWidth="0.6">
        <path d="M11 5l5.2 3L11 11 5.8 8z" fill="#FFFFFF" />
        <path d="M5.8 8 11 11v6.5L5.8 14.5z" fill="#E6EEFF" />
        <path d="M11 11l5.2-3v6.5L11 17.5z" fill="#C9DBFF" />
        <path d={CUBE_GRID} />
        <path d="M14.4 14.5v4a2.6 1 0 0 0 5.2 0v-4" fill="#FFFFFF" />
        <path d="M14.4 16.5a2.6 1 0 0 0 5.2 0" />
        <ellipse cx="17" cy="14.5" rx="2.6" ry="1" fill="#FFFFFF" />
      </g>
    </svg>
  )
}
