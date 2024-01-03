import "./globals.css";
import type { Metadata, Viewport } from "next";
import PreloadSettings from "@/components/PreloadSettings";

const APP_NAME = "Nexus Timer";
const APP_DEFAULT_TITLE = "Nexus Timer";
const APP_TITLE_TEMPLATE = "Nexus Timer";
const APP_DESCRIPTION =
  "Nexus Timer is a platform for recording and viewing Rubik's cube statistics. It also includes tools to improve Rubik's cube skills.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nexustimer.pro/"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#181818",
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
