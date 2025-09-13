import genId from "@/lib/genId";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useTimerStore } from "@/store/timerStore";
import { Cross1Icon } from "@radix-ui/react-icons";
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function DrawerHintPanel() {
  const hint = useTimerStore((state) => state.hint);

  return (
    <>
      <DrawerContent className="w-full max-w-[550px] mx-auto">
        <DrawerHeader>
          <DrawerTitle className="flex gap-2 items-center">
            <Cross1Icon className="rotate-45" />
            Hints: Yellow layer
          </DrawerTitle>
          <DrawerDescription className="text-start">
            White on top - Green facing forward.
          </DrawerDescription>
        </DrawerHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-5">
          <div className="px-3">
            {hint?.cross.map((i) => (
              <OptimalCrossLayer key={genId()} solution={i} type="cross" />
            ))}
          </div>

          <div className="px-3 mt-1">
            {hint?.xcross.map((i, index) => (
              <OptimalCrossLayer key={genId()} solution={i} type="xcross" index={index}  />
            ))}
          </div>
        </div>
      </DrawerContent>
    </>
  );
}

function OptimalCrossLayer({
  solution,
  type,
  index = 0,
}: {
  solution: string;
  type: "cross" | "xcross";
  index?: number;
}) {
  const { resolvedTheme } = useTheme()
  const rotation = (() => {
    switch (index) {
      case 0:
        return '-rotate-90';
      case 1:
        return '-rotate-180';
      case 2:
        return '-rotate-270';
      case 3:
        return '-rotate-360';
      default:
        return 'rotate-0';
    }
  })();

  return (
    <>
      <div className="select-text">
        {type === 'cross' ? (
          <Image
            src={'/icons/cross.svg'}
            alt={''}
            width={20}
            height={20}
            className={`inline mb-1 mr-1`}
            style={{
              filter:
                resolvedTheme === 'light'
                  ? 'brightness(0) saturate(100%)'
                  : 'invert(84%) sepia(85%) saturate(743%) hue-rotate(1deg) brightness(103%) contrast(102%)',
            }}
          />
        ) : (
          <Image
            src={'/icons/xcross.svg'}
            alt={''}
            width={20}
            height={20}
            className={`inline mb-1 mr-1 -rotate-90 ${rotation}`}
            style={{
              filter:
                resolvedTheme === 'light'
                  ? 'brightness(0) saturate(100%)'
                  : 'invert(84%) sepia(85%) saturate(743%) hue-rotate(1deg) brightness(103%) contrast(102%)',
            }}
          />
        )} - {solution}
      </div>
    </>
  );
}
