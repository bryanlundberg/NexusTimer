import { useTranslations } from "next-intl";
import Image from "next/image";

export default function EmptySolves({ title, description }: { title?: string, description?: string }) {
  const t = useTranslations("Index.SolvesPage");
  return (
    <div className="w-full flex flex-col items-center justify-center text-center text-sm sm:text-md font-mono py-20 max-w-96 mx-auto">
      <Image
        src={"/utils/empty-solves.svg"}
        alt="empty"
        width={200}
        height={200}
        className="object-scale-down mb-10 size-40"
        priority={true}
      />
      <h2 className="text-2xl font-bold mb-4 text-center text-balance">
        {title ? title : t("empty-solves")}
      </h2>
      <p className="text-gray-600 text-center text-balance">
        {description ? description : t("empty-solves-description")}
      </p>
    </div>
  );
}
