import { useTranslations } from "next-intl";
import Image from "next/image";

export default function EmptySolves() {
  const t = useTranslations("Index.SolvesPage");
  return (
    <div className="w-full flex flex-col items-center justify-center text-center text-sm sm:text-md font-mono py-20 max-w-96 mx-auto">
      <Image
        src={"/empty.png"}
        alt="empty"
        width={200}
        height={200}
        className="object-scale-down mb-10 size-40 "
      />
      <div className="bg-background/90 backdrop-blur-lg">
        {t("empty-solves")}
      </div>
      <div className="text-balance bg-background/90 backdrop-blur-lg">
        {t("empty-solves-description")}
      </div>
    </div>
  );
}
