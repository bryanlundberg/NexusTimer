'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

// The theme script only runs from the server HTML; on a client render React would warn about an executable script.
const scriptProps = typeof window === 'undefined' ? undefined : { type: 'text/plain' }

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} scriptProps={scriptProps}>
      {children}
    </NextThemesProvider>
  )
}
