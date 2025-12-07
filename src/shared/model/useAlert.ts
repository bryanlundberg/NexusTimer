'use client'

import type { AlertFunction } from '@/components/alerts-provider'
import { useAlertContext } from '@/components/alerts-provider'

export default function useAlert(): AlertFunction {
  const { alert } = useAlertContext()
  return alert
}
