import ExitFullScreen from "@/icons/ExitFullScreen";
import { InteractiveIcon } from "./InteractiveIcon";
import FullScreen from "@/icons/FullScreen";
import { useFullScreen } from "@/hooks/useFullScreen";

export default function FullscreenOption() {
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  return (
    <>
      <div className="absolute hidden sm:block right-4 top-4">
        <InteractiveIcon
          icon={isFullScreen ? <ExitFullScreen /> : <FullScreen />}
          onClick={toggleFullScreen}
        />
      </div>
    </>
  );
}
