import Image from "next/image";
import nodata from "@/images/no-data.svg";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

interface EmptyCubes {
  onClick: () => void;
}

export default function EmptyCubes({ onClick }: EmptyCubes) {
  const { lang } = useSettingsModalStore();
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
          <div>{translation.cubes["no-cubes-for-display"][lang]}</div>
        </div>
      </div>
    </>
  );
}
