import Reload from "@/icons/Reload";
import Select from "../Select";
import Settings from "@/icons/Settings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { InteractiveIcon } from "./InteractiveIcon";
import { ScrambleZone } from "./ScrambleZone";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

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
          <InteractiveIcon icon={<Settings />} animation={true} />
        </Link>

        <Select />
        <InteractiveIcon
          icon={<Reload />}
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
