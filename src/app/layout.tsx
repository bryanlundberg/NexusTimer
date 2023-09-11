import Navigation from "@/components/Navigation";
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
      <body>
        <main className="min-h-screen flex flex-col justify-between bg-slate-900 text-zinc-50">
          {children}
          <Navigation />
        </main>
      </body>
    </html>
  );
}
