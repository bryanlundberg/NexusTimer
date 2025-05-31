import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import PreloadSettings from "@/components/PreloadSettings";
import { saira } from "@/fonts/fonts";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { LoaderProvider } from "@/components/loader/loader-context";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      t("keywords.key1"),
      t("keywords.key2"),
      t("keywords.key3"),
      t("keywords.key4"),
      t("keywords.key5"),
      t("keywords.key6"),
      t("keywords.key7"),
      t("keywords.key8"),
      t("keywords.key9"),
      t("keywords.key10"),
      t("keywords.key11"),
      t("keywords.key12"),
      t("keywords.key13"),
      t("keywords.key14"),
    ],
    metadataBase: new URL("https://nexustimer.com/" + locale),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={saira.className}>
      <NuqsAdapter>
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages}>
            <PreloadSettings>
              <LoaderProvider>
                {children}
              </LoaderProvider>
            </PreloadSettings>
          </NextIntlClientProvider>
          <Toaster />
        </SessionProvider>
      </NuqsAdapter>
      </body>
    </html>
  );
}
