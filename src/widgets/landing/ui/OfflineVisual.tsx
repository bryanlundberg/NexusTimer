import { WifiOff } from 'lucide-react'

export default function OfflineVisual() {
  return (
    <div className="flex items-center justify-center py-6">
      <WifiOff className="size-20 text-[var(--cube-red)]" strokeWidth={1.5} aria-hidden />
    </div>
  )
}
