export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col">
      <div className="flex w-full h-1 shrink-0">
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-yellow-500" />
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-blue-900" />
        <div className="flex-1 bg-green-500" />
      </div>
      <div className="flex-1 flex">{children}</div>
    </div>
  )
}
