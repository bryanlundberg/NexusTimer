import { FriendTable } from '@/widgets/friends/ui/FriendTable'

export function EmptyTable({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <FriendTable>
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-muted-foreground">{message}</p>
        {children}
      </div>
    </FriendTable>
  )
}
