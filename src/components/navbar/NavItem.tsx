import { Link, usePathname } from "@/i18n/routing";
import { twMerge } from "tailwind-merge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface NavItem {
  path: string;
  icon: React.ReactNode;
  toolTipMessage: string;
}

export function NavItem({ path, icon, toolTipMessage }: NavItem) {
  const pathname = usePathname();
  return (
    <>
      <TooltipProvider delayDuration={250}>
        <Tooltip>
          <TooltipTrigger asChild>
            <li className="grow first:rounded-s-md last:rounded-e-md overflow-hidden">
              <Link
                href={path}
                data-testid={"nav" + path}
                className={twMerge(
                  `${
                    pathname === path ? "bg-secondary" : ""
                  } transition duration-300 py-2 flex flex-col justify-center items-center font-medium  `
                )}
              >
                {icon}
              </Link>
            </li>
          </TooltipTrigger>
          <TooltipContent>
            <p>{toolTipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
