import React from 'react'
import { toast } from 'sonner'
import BackupUploadToast from '@/components/backup-upload-toast'

export const UPLOAD_BACKUP_TOAST_ID = 'upload-backup'

export const showUploadToast = (title: string) =>
  toast.loading(title, {
    id: UPLOAD_BACKUP_TOAST_ID,
    description: React.createElement(BackupUploadToast)
  })
