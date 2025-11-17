'use client'

import type { AlertFunction } from '@/components/alert/AlertProvider'
import { useAlertContext } from '@/components/alert/AlertProvider'

export default function useAlert(): AlertFunction {
  const { alert } = useAlertContext()
  return alert
}
