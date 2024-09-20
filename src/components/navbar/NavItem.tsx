import { Link, usePathname } from "@/i18n/routing";
import { twMerge } from "tailwind-merge";

interface NavItem {
  path: string;
  icon: React.ReactNode;
}

export function NavItem({ path, icon }: NavItem) {
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
          {icon}
        </Link>
      </li>
    </>
  );
}
