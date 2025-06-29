import formatTime from "@/lib/formatTime";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function OverviewPanel() {
  const timerStatistics = useTimerStore(store => store.timerStatistics);
  const t = useTranslations("Index");

  const stats = useMemo(() => {
    return [
      {
        label: t("HomePage.deviation"),
        value: formatTime(timerStatistics.session.deviation),
        testId: "timer-session-deviation",
      },
      {
        label: t("HomePage.average"),
        value: formatTime(timerStatistics.session.mean),
        testId: "timer-session-mean",
      },
      {
        label: t("HomePage.best"),
        value: formatTime(timerStatistics.session.best),
        testId: "timer-session-best",
      },
      {
        label: t("HomePage.counter"),
        value: timerStatistics.session.count.toString(),
        testId: "timer-session-count",
      },
    ]
  },[timerStatistics.session, t]);

  return (
    <div className="flex flex-col justify-center w-full h-full gap-1" id="touch">
      {stats.map(({ label, value, testId }) => (
        <div className="font-medium" key={testId}>
          {label}
          {": "}
          <span data-testid={testId}>{value}</span>
        </div>
      ))}
    </div>
  );
}
