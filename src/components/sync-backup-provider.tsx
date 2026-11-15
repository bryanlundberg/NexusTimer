'use client'
import React from 'react'
import { useBackupSuggestion } from '@/shared/model/backup/useBackupSuggestion'

export default function SyncBackupProvider({ children }: { children: React.ReactNode }) {
  useBackupSuggestion()

  return <>{children}</>
}
