import { Progress } from '@/components/ui/progress'

type BackupUploadToastProps = {
  progress: number
}

export default function BackupUploadToast({ progress }: BackupUploadToastProps) {
  return (
    <div className="w-full rounded-xl bg-card border border-border shadow-lg overflow-hidden">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">Saving new backup...</span>
          <span className="text-xs text-muted-foreground tabular-nums">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">Please do not close this page.</p>
      </div>
    </div>
  )
}
