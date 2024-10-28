import { usePathname } from "next/navigation";
import Link from "next/link";
export default function DialogNavbarItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const path = usePathname();
  return (
    <>
      <Link
        href={href}
        className={`flex w-full h-12 relative rounded-ss-xl rounded-br-xl overflow-hidden border items-center justify-center hover:bg-primary hover:text-primary-foreground transition duration-200 hover:font-semibold text-2xl ${
          path === href
            ? "bg-primary text-primary-foreground font-semibold"
            : "bg-background"
        }`}
      >
        {label}
      </Link>
    </>
  );
}
