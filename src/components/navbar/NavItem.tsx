import Link from "next/link";
import { usePathname } from "next/navigation";

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
          className={`${
            pathname === path
              ? "light:text-neutral-900 dark:text-neutral-200"
              : "light:text-neutral-500 dark:text-neutral-400"
          } transition-all duration-300 py-2 rounded-md hover:dark:text-neutral-300 light:hover:text-neutral-900 flex flex-col justify-center items-center font-medium`}
        >
          {pathname === path ? solidIcon : normalIcon}
        </Link>
      </li>
    </>
  );
}
