import "./globals.css";
import type { Metadata } from "next";
import PreloadSettings from "@/components/PreloadSettings";

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
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "es-ES": "/",
      "fr-FR": "/",
      "de-DE": "/",
      "ja-JP": "/",
      "zh-CN": "/",
      "ru-RU": "/",
      "hi-IN": "/",
      "pt-PT": "/",
      "it-IT": "/",
      "ko-KR": "/",
      "nl-NL": "/",
      "sv-SE": "/",
      "tr-TR": "/",
      "pl-PL": "/",
      "vi-VN": "/",
      "th-TH": "/",
      "el-GR": "/",
      "fi-FI": "/",
      "uk-UA": "/",
      "cs-CZ": "/",
      "ro-RO": "/",
      "no-NO": "/",
      "da-DK": "/",
      "ms-MY": "/",
      "hu-HU": "/",
      "id-ID": "/",
      "bn-BD": "/",
      "sk-SK": "/",
      "fil-PH": "/",
      "et-EE": "/",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <PreloadSettings>{children}</PreloadSettings>
        </main>
      </body>
    </html>
  );
}
