import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";

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
        className="flex w-full h-20 relative rounded-ss-xl rounded-br-xl overflow-hidden border"
      >
        <Link
          className={`absolute w-full h-full flex items-center justify-center  hover:bg-background/50 transition duration-200 hover:font-semibold ${
            path === href
              ? "bg-background/50 font-semibold"
              : "bg-background/95"
          }`}
          href={href}
        >
          {label}
        </Link>
        <Image
          src={image}
          width={500}
          height={100}
          alt=""
          className="object-cover object-center w-full h-full"
        />
      </Link>
    </>
  );
}
