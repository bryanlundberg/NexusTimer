import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import { useTimerStatistics } from "@/hooks/useTimerStatistics";

export default function StatisticsPanel() {
  const { settings } = useSettingsModalStore();
  const { session } = useTimerStatistics();

  return (
    <>
      <div className="flex flex-col justify-center w-full h-full">
        {settings.features.sessionStats.status ? (
          <>
            <div className="font-medium text-right">
              Ao5: {session.ao5 === 0 ? "--" : formatTime(session.ao5)}
            </div>
            <div className="font-medium text-right">
              Ao12: {session.ao12 === 0 ? "--" : formatTime(session.ao12)}
            </div>
            <div className="font-medium text-right">
              Ao50: {session.ao50 === 0 ? "--" : formatTime(session.ao50)}
            </div>
            <div className="font-medium text-right">
              Ao100: {session.ao100 === 0 ? "--" : formatTime(session.ao100)}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
