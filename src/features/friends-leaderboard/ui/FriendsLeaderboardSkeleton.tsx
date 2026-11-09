import { Skeleton } from '@/components/ui/skeleton'

export default function FriendsLeaderboardSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="border border-border/60 bg-card/40">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border/40 px-3 py-2.5 last:border-b-0">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
