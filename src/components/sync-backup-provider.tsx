'use client'
import React from 'react'
import { useAutoRestoreOnLogin } from '@/shared/model/backup/useAutoRestoreOnLogin'
import { useBackupSuggestion } from '@/shared/model/backup/useBackupSuggestion'

export default function SyncBackupProvider({ children }: { children: React.ReactNode }) {
  useAutoRestoreOnLogin()
  useBackupSuggestion()

  return <>{children}</>
}
