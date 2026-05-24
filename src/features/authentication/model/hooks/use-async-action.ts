'use client'

import { useState } from 'react'

export function useAsyncAction<TArgs extends unknown[], TResult>(action: (...args: TArgs) => Promise<TResult>) {
  const [isLoading, setIsLoading] = useState(false)

  const run = async (...args: TArgs): Promise<TResult> => {
    setIsLoading(true)
    try {
      return await action(...args)
    } finally {
      setIsLoading(false)
    }
  }

  return { run, isLoading }
}
