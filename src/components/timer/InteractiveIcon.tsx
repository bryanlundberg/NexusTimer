import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InteractiveIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  animation?: boolean;
  message?: string;
}

export function InteractiveIcon({
  icon,
  animation = false,
  message,
  ...props
}: InteractiveIconProps) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            {...props}
            className={`light:text-neutral-800 light:hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-200 hover:cursor-pointer duration-300 transition ${
              animation ? "hover:rotate-45" : ""
            }`}
          >
            {icon}
          </div>
        </TooltipTrigger>
        {message && (
          <TooltipContent>
            <p>{message}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
