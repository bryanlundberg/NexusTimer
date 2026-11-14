import type { ComponentType, ReactNode } from 'react'

export interface NavUserItemProps {
  onClick?: () => void
  className?: string
  variant?: 'default' | 'destructive'
  children: ReactNode
  'data-testid'?: string
}

export type NavUserItemComponent = ComponentType<NavUserItemProps>
