import MainCubeSelector from "../MainCubeSelector";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { InteractiveIcon } from "./InteractiveIcon";
import { ScrambleZone } from "./ScrambleZone";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { GearIcon, ReloadIcon } from "@radix-ui/react-icons";

export default function HeaderTimer() {
  const { selectedCube, setNewScramble, isSolving, timerStatus } =
    useTimerStore();
  const { setSettingsOpen, settingsOpen, settings } = useSettingsModalStore();
  const { lastSolve, timerStatistics } = useTimerStore();
  const t = useTranslations("Index.HomePage");

  if (isSolving || timerStatus !== "IDLE") return null;
  return (
    <div className="flex flex-col items-center justify-center gap-5 pt-4 px-3">
      <div className="flex items-center justify-between w-full gap-4 sm:justify-center">
        <Link
          href={{
            pathname: "/",
            hash: `${t("settings")}`,
          }}
          onClick={() => {
            setSettingsOpen(!settingsOpen);
          }}
        >
          <InteractiveIcon
            icon={<GearIcon className="size-5" />}
            animation={true}
            message="Settings"
          />
        </Link>

        <MainCubeSelector />
        <InteractiveIcon
          message="Change scramble"
          icon={<ReloadIcon className="size-5" />}
          onClick={() => {
            if (selectedCube) {
              setNewScramble(selectedCube);
            }
          }}
          animation={true}
        />
      </div>
      <ScrambleZone />
      {lastSolve != null &&
      lastSolve.time <= timerStatistics.global.best &&
      settings.alerts.bestTime.status ? (
        <div id="touch" className="mt-10 text-center">
          <p>{t("congratulations")}</p>
          <p>{t("personal_best")}</p>
        </div>
      ) : null}
    </div>
  );
}
