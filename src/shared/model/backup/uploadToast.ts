import React from 'react'
import { toast } from 'sonner'
import BackupUploadToast from '@/components/backup-upload-toast'

export const UPLOAD_BACKUP_TOAST_ID = 'upload-backup'

export const showUploadToast = (progress: number) =>
  toast.custom(() => React.createElement(BackupUploadToast, { progress }), {
    id: UPLOAD_BACKUP_TOAST_ID,
    duration: Infinity,
    style: { width: '100%' }
  })
