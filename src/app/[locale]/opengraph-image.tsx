import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export default async function OpenGraphImage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "OpenGraphImage" });
  return new ImageResponse(<div style={{ fontSize: 128 }}>{t("title")}</div>);
}
