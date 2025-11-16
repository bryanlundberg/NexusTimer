import { cn } from '@/lib/utils'

interface MenuSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  icon: React.ReactNode
  title: string
  className?: string
}

export function MenuSection({ children, icon, title, className, ...rest }: MenuSectionProps) {
  return (
    <>
      <div
        {...rest}
        className={cn(
          'flex items-center gap-3 font-semibold sticky bg-background backdrop-blur-lg top-0 py-2 z-10 my-3 ps-3',
          className
        )}
      >
        {icon}
        <div className="w-full">
          <span className="text-lg">{title}</span>
        </div>
      </div>
      <div className="">{children}</div>
    </>
  )
}
