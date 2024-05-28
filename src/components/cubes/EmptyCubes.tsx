import Image from "next/image";
import nodata from "@/images/no-data.svg";
import { useTranslations } from "next-intl";

interface EmptyCubes {
  onClick: () => void;
}

export default function EmptyCubes({ onClick }: EmptyCubes) {
  const t = useTranslations("Index.CubesPage");
  return (
    <>
      <div
        onClick={onClick}
        className="flex flex-col items-center justify-center h-full m-3 overflow-auto border border-dashed rounded-md cursor-pointer grow border-zinc-800"
      >
        <div className="flex flex-col items-center justify-center gap-1 p-3 font-medium">
          <Image
            src={nodata}
            alt={"no-cubes-for-display"}
            width={56}
            height={61}
            draggable={false}
          />
          <div>{t("no-cubes-for-display")}</div>
        </div>
      </div>
    </>
  );
}
