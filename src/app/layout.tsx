import "./globals.css";
import type { Metadata } from "next";
import PreloadSettings from "@/components/PreloadSettings";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nexustimer.pro"),
  title: "Nexus Timer - Professional Rubik's Cube Timer",
  applicationName: "Nexus Timer",
  description:
    "Nexus Timer is a professional platform for training and analyzing your journey with the Rubiks Cube.",
  creator: "Bryan Lundberg",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  keywords: [
    "timer",
    "nxtimer",
    "nexustimer",
    "nexus",
    "rubiks cube timer",
    "online timer",
    "web timer",
    "rubiks",
    "cube",
    "online rubiks cube timer",
    "speedcubing",
    "cubing",
    "cubing timer",
    "world cubing association",
    "wca",
  ],
  referrer: "origin-when-cross-origin",
  generator: "Nextjs",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  // Provide all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <PreloadSettings>{children}</PreloadSettings>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
