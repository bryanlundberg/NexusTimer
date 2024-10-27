import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function DialogNavbarItem({
  href,
  label,
  image,
}: {
  href: string;
  label: string;
  image: string;
}) {
  const path = usePathname();
  return (
    <>
      <Link
        href={href}
        className="flex w-full h-12 relative rounded-ss-xl rounded-br-xl overflow-hidden border"
      >
        <Link
          className={`absolute w-full h-full flex items-center justify-center  hover:bg-primary hover:text-primary-foreground transition duration-200 hover:font-semibold text-2xl ${
            path === href
              ? "bg-primary text-primary-foreground font-semibold"
              : "bg-background"
          }`}
          href={href}
        >
          {label}
        </Link>
      </Link>
    </>
  );
}
