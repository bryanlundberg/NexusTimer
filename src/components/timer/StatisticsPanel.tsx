import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import { useTimerStatistics } from "@/hooks/useTimerStatistics";

export default function StatisticsPanel() {
  const { settings } = useSettingsModalStore();
  const statistics = useTimerStatistics();

  return (
    <>
      <div className="flex flex-col justify-center w-full h-full">
        {settings.features.sessionStats.status ? (
          <>
            <div className="font-medium text-right">
              Ao5: {statistics.ao5 === 0 ? "--" : formatTime(statistics.ao5)}
            </div>
            <div className="font-medium text-right">
              Ao12: {statistics.ao12 === 0 ? "--" : formatTime(statistics.ao12)}
            </div>
            <div className="font-medium text-right">
              Ao50: {statistics.ao50 === 0 ? "--" : formatTime(statistics.ao50)}
            </div>
            <div className="font-medium text-right">
              Ao100:{" "}
              {statistics.ao100 === 0 ? "--" : formatTime(statistics.ao100)}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
