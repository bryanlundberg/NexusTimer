export default function StatisticsViewContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full px-3 pt-2 border rounded-md bg-background backdrop-blur-lg min-h-[300px]">
      {children}
    </div>
  )
}
