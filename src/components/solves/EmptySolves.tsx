import { useTranslations } from "next-intl";
import Image from "next/image";

export default function EmptySolves() {
  const t = useTranslations("Index.SolvesPage");
  return (
    <>
      <>
        <div className="w-full flex flex-col items-center justify-center text-center text-sm sm:text-md font-mono border border-dashed rounded-md py-20 bg-background">
          <Image
            src={"/empty.png"}
            alt="empty"
            width={200}
            height={200}
            className="object-scale-down mb-10 size-40"
          />
          <div>{t("empty-solves")}</div>
          <div className="w-10/12">{t("empty-solves-description")}</div>
        </div>
      </>
    </>
  );
}
