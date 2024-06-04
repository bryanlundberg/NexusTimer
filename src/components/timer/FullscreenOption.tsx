import {
  ArrowDownCircleIcon,
  ArrowDownLeftIcon,
} from "@heroicons/react/24/outline";
import { InteractiveIcon } from "./InteractiveIcon";
import { useFullScreen } from "@/hooks/useFullScreen";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

export default function FullscreenOption() {
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  return (
    <>
      <div className="absolute hidden sm:block right-4 top-4">
        <InteractiveIcon
          icon={
            isFullScreen ? (
              <ArrowDownLeftIcon className="w-6 h-6 hover:opacity-85 transition duration-200" />
            ) : (
              <ArrowUpRightIcon className="w-6 h-6 hover:opacity-85 transition duration-200" />
            )
          }
          onClick={toggleFullScreen}
        />
      </div>
    </>
  );
}
