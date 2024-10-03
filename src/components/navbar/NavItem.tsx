import { Link, usePathname } from "@/i18n/routing";
import { twMerge } from "tailwind-merge";
import { InteractiveIcon } from "../timer/InteractiveIcon";

interface NavItem {
  path: string;
  icon: React.ReactNode;
  toolTipMessage:string;
}

export function NavItem({ path, icon , toolTipMessage}: NavItem) {
  const pathname = usePathname();
  return (
    <>
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
          <InteractiveIcon
              icon={icon}
              animation={false}
              message={toolTipMessage}
            />
        </Link>
      </li>
    </>
  );
}
