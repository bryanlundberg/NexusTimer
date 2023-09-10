import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CubeStats",
  description:
    "Cubing Stats is a platform for recording and viewing Rubik's cube statistics. It also includes tools to improve Rubik's cube skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}