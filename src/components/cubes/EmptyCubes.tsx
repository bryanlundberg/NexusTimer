import Image from "next/image";
import { useTranslations } from "next-intl";

interface EmptyCubesProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function EmptyCubes({ ...rest }: EmptyCubesProps) {
  const t = useTranslations("Index.CubesPage");
  return (
    <>
      <div
        {...rest}
        data-testid="empty-cubes-container"
        className="flex flex-col items-center justify-center h-full overflow-auto  rounded-md grow min-h-96 mx-auto w-full"
      >
        <div className="flex flex-col items-center justify-center gap-1 p-3 font-medium">
          <Image
            src={"/utils/undraw_to-the-moon_w1wa.svg"}
            alt={"no-cubes-for-display"}
            width={200}
            height={200}
            draggable={false}
            className="object-scale-down size-40"
          />
          <h2 className="text-2xl text-center text-balance font-bold">{t("no-cubes-for-display")}</h2>
          <p className="text-gray-600 text-center text-balance">
            Start adding cube collections to your vault to see them here.
          </p>
        </div>
      </div>
    </>
  );
}
