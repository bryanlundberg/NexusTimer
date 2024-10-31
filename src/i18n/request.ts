import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { merge } from "ts-deepmerge";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const NEXT_LOCALE = cookieStore.get("NEXT_LOCALE");

  const locale = NEXT_LOCALE ? NEXT_LOCALE.value : "en";

  const userMessages = (await import(`../../messages/${locale}.json`)).default;
  const defaultMessages = (await import(`../../messages/en.json`)).default;
  const messages = merge(defaultMessages, userMessages);

  return {
    locale,
    messages,
  };
});
