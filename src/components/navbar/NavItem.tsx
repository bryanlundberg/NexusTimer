import { Link, usePathname } from "@/i18n/routing";
import { twMerge } from "tailwind-merge";

interface NavItem {
  path: string;
  normalIcon: React.ReactNode;
  solidIcon: React.ReactNode;
}

export function NavItem({ path, solidIcon, normalIcon }: NavItem) {
  const pathname = usePathname();
  return (
    <>
      <li className="grow">
        <Link
          href={path}
          className={twMerge(
            `${
              pathname === path ? "bg-secondary" : ""
            } transition duration-300 py-2 rounded-md flex flex-col justify-center items-center font-medium`
          )}
        >
          {pathname === path ? solidIcon : normalIcon}
        </Link>
      </li>
    </>
  );
}
