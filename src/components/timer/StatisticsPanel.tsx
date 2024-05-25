import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import { useTimerStore } from "@/store/timerStore";

export default function StatisticsPanel() {
  const { settings } = useSettingsModalStore();
  const { timerStatistics } = useTimerStore();
  const bgRecord = "bg-yellow-500";

  return (
    <>
      <div
        className="flex flex-col justify-center w-full h-full gap-1"
        id="touch"
      >
        {settings.features.sessionStats.status ? (
          <>
            <div className="flex justify-end w-full font-medium text-right">
              <div
                className={`w-fit px-[5px] rounded-md ${
                  timerStatistics.global.ao5 !== 0 &&
                  timerStatistics.global.ao5 === timerStatistics.session.ao5 &&
                  settings.alerts.bestAverage.status
                    ? bgRecord
                    : ""
                }`}
              >
                Ao5:{" "}
                <span data-testid={"timer-session-ao5"}>
                  {timerStatistics.session.ao5 === 0
                    ? "--"
                    : formatTime(timerStatistics.session.ao5)}
                </span>
              </div>
            </div>
            <div className="flex justify-end w-full font-medium text-right">
              <div
                className={`w-fit px-[5px] rounded-md ${
                  timerStatistics.global.ao12 !== 0 &&
                  timerStatistics.global.ao12 ===
                    timerStatistics.session.ao12 &&
                  settings.alerts.bestAverage.status
                    ? bgRecord
                    : ""
                }`}
              >
                Ao12:{" "}
                <span data-testid={"timer-session-ao12"}>
                  {timerStatistics.session.ao12 === 0
                    ? "--"
                    : formatTime(timerStatistics.session.ao12)}
                </span>
              </div>
            </div>
            <div className="flex justify-end w-full font-medium text-right">
              <div
                className={`w-fit px-[5px] rounded-md ${
                  timerStatistics.global.ao50 !== 0 &&
                  timerStatistics.global.ao50 ===
                    timerStatistics.session.ao50 &&
                  settings.alerts.bestAverage.status
                    ? bgRecord
                    : ""
                }`}
              >
                Ao50:{" "}
                <span data-testid={"timer-session-ao50"}>
                  {timerStatistics.session.ao50 === 0
                    ? "--"
                    : formatTime(timerStatistics.session.ao50)}
                </span>
              </div>
            </div>
            <div className="flex justify-end w-full font-medium text-right">
              <div
                className={`w-fit px-[5px] rounded-md ${
                  timerStatistics.global.ao100 !== 0 &&
                  timerStatistics.global.ao100 ===
                    timerStatistics.session.ao100 &&
                  settings.alerts.bestAverage.status
                    ? bgRecord
                    : ""
                }`}
              >
                Ao100:{" "}
                <span data-testid={"timer-session-ao100"}>
                  {timerStatistics.session.ao100 === 0
                    ? "--"
                    : formatTime(timerStatistics.session.ao100)}
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
