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
        className="flex flex-col items-center justify-center h-full overflow-auto border border-dashed rounded-md cursor-pointer grow min-h-96 bg-background"
      >
        <div className="flex flex-col items-center justify-center gap-1 p-3 font-medium">
          <Image
            src={"/emp-cube.png"}
            alt={"no-cubes-for-display"}
            width={180}
            height={180}
            draggable={false}
            className="size-60 object-scale-down"
          />
          <p className="font-mono">{t("no-cubes-for-display")}</p>
        </div>
      </div>
    </>
  );
}
