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
        <main className="min-h-screen flex flex-col gap-5 justify-between bg-zinc-950 text-slate-50 py-3 px-5">
          {children}
          <Navigation />
        </main>
      </body>
    </html>
  );
}
