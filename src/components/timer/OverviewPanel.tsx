import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";
import formatTime from "@/lib/formatTime";
import { useTimerStatistics } from "@/hooks/useTimerStatistics";

export default function OverviewPanel() {
  const { lang, settings } = useSettingsModalStore();
  const statistics = useTimerStatistics();

  return (
    <div className="flex flex-col justify-center w-full h-full">
      {settings.features.sessionStats.status ? (
        <>
          <div className="font-medium">
            {translation.timer["deviation"][lang]}
            {": "}
            {formatTime(statistics.deviation)}
          </div>
          <div className="font-medium">
            {translation.timer["mean"][lang]}
            {": "}
            {formatTime(statistics.mean)}
          </div>
          <div className="font-medium">
            {translation.timer["best"][lang]}
            {": "}
            {formatTime(statistics.best)}
          </div>
          <div className="font-medium">
            {translation.timer["counter"][lang]}
            {": "}
            {statistics.count}
          </div>
        </>
      ) : null}
    </div>
  );
}
