import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import { useTimerStatistics } from "@/hooks/useTimerStatistics";

export default function StatisticsPanel() {
  const { settings } = useSettingsModalStore();
  const { global, session } = useTimerStatistics();
  const bgRecord = "bg-yellow-500";

  return (
    <>
      <div className="flex flex-col justify-center w-full h-full gap-1">
        {settings.features.sessionStats.status ? (
          <>
            <div className="flex justify-end w-full font-medium text-right">
              <div
                className={`w-fit px-[5px] rounded-md ${
                  global.ao5 !== 0 && global.ao5 === session.ao5 ? bgRecord : ""
                }`}
              >
                Ao5: {session.ao5 === 0 ? "--" : formatTime(session.ao5)}
              </div>
            </div>
            <div className="flex justify-end w-full font-medium text-right">
              <div
                className={`w-fit px-[5px] rounded-md ${
                  global.ao12 !== 0 && global.ao12 === session.ao12
                    ? bgRecord
                    : ""
                }`}
              >
                Ao12: {session.ao12 === 0 ? "--" : formatTime(session.ao12)}
              </div>
            </div>
            <div className="flex justify-end w-full font-medium text-right">
              <div
                className={`w-fit px-[5px] rounded-md ${
                  global.ao50 !== 0 && global.ao50 === session.ao50
                    ? bgRecord
                    : ""
                }`}
              >
                Ao50: {session.ao50 === 0 ? "--" : formatTime(session.ao50)}
              </div>
            </div>
            <div className="flex justify-end w-full font-medium text-right">
              <div
                className={`w-fit px-[5px] rounded-md ${
                  global.ao100 !== 0 && global.ao100 === session.ao100
                    ? bgRecord
                    : ""
                }`}
              >
                Ao100: {session.ao100 === 0 ? "--" : formatTime(session.ao100)}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
