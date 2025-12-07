export default function StatisticsViewContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full px-3 pt-3 border rounded-md bg-card backdrop-blur-lg min-h-[300px]">
      {children}
    </div>
  )
}
