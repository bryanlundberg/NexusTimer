import "./globals.css";
import Script from "next/script";
import type { Metadata } from "next";
import PreloadSettings from "@/components/PreloadSettings";

export const metadata: Metadata = {
  title: "Nexus Timer | For SpeedCubers",
  description:
    "Nexus Timer is a platform for recording and viewing Rubik's cube statistics. It also includes tools to improve Rubik's cube skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="relative">
          <PreloadSettings>{children}</PreloadSettings>
        </main>
        <Script
          src="https://cdn.cubing.net/js/scramble-display"
          type="module"
        />
      </body>
    </html>
  );
}
