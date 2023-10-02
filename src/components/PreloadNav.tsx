"use client";
import { usePathname } from "next/navigation";

export default function PreloadNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return <>{pathname === "/settings" ? null : children}</>;
}
