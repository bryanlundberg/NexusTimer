export default function RealtimePill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-300 px-2 py-1 text-xs w-fit">
      <span className="relative inline-flex">
        <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500 opacity-75 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
      Real-time
    </div>
  )
}
