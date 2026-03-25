export default function StatisticsViewContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-1 border border-border/50 rounded-2xl bg-background/80 backdrop-blur-xl min-h-[300px] shadow-sm">
      {children}
    </div>
  )
}
