import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export function StatisticHeader() {
  const { lang } = useSettingsModalStore();
  return (
    <>
      <div className="flex items-center h-10 p-1 font-medium rounded-md dark:bg-zinc-700 dark:text-zinc-200 light:bg-neutral-200 light:text-neutral-950">
        <div className="w-1/5"></div>
        <div className="w-1/5 text-center">
          {translation.metrics["global"][lang]}
        </div>
        <div className="w-1/5 text-center">
          {translation.metrics["sessions"][lang]}
        </div>
        <div className="w-1/5 text-center">
          C {translation.solves.filter["all"][lang]}
        </div>
        <div className="w-1/5 text-center">
          C {translation.solves.filter["session"][lang]}
        </div>
      </div>
    </>
  );
}
