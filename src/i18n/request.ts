import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { merge } from "ts-deepmerge";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) notFound();

  const userMessages = (await import(`../../messages/${locale}.json`)).default;
  const defaultMessages = (await import(`../../messages/en.json`)).default;
  const messages = merge(defaultMessages, userMessages);

  return {
    messages,
  };
});
