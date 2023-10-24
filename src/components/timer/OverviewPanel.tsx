import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";
import formatTime from "@/lib/formatTime";
import { useTimerStatistics } from "@/hooks/useTimerStatistics";

export default function OverviewPanel() {
  const { lang, settings } = useSettingsModalStore();
  const { session } = useTimerStatistics();

  return (
    <div className="flex flex-col justify-center w-full h-full">
      {settings.features.sessionStats.status ? (
        <>
          <div className="font-medium">
            {translation.timer["deviation"][lang]}
            {": "}
            {formatTime(session.deviation)}
          </div>
          <div className="font-medium">
            {translation.timer["mean"][lang]}
            {": "}
            {formatTime(session.mean)}
          </div>
          <div className="font-medium">
            {translation.timer["best"][lang]}
            {": "}
            {formatTime(session.best)}
          </div>
          <div className="font-medium">
            {translation.timer["counter"][lang]}
            {": "}
            {session.count}
          </div>
        </>
      ) : null}
    </div>
  );
}
