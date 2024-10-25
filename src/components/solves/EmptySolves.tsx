import { useTranslations } from "next-intl";
import Image from "next/image";

export default function EmptySolves() {
  const t = useTranslations("Index.SolvesPage");
  return (
    <div className="w-full flex flex-col items-center justify-center text-center text-sm sm:text-md font-mono py-20 bg-background max-w-96 mx-auto rounded-full">
      <Image
        src={"/empty.png"}
        alt="empty"
        width={200}
        height={200}
        className="object-scale-down mb-10 size-40"
      />
      <div>{t("empty-solves")}</div>
      <div className="text-balance">{t("empty-solves-description")}</div>
    </div>
  );
}
