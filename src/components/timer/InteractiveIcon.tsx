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
            className={`hover:cursor-pointer duration-300 transition ${
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
