import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { ActivityList } from "@/components/stats/ActivityList";

export default function LastActivity() {
  const { lang } = useSettingsModalStore();

  return (
    <>
      <div className="w-full p-3 text-left border rounded-md dark:border-zinc-800 light:border-neutral-200 sm:text-center dark:bg-neutral-950 light:bg-neutral-100">
        <div className="mb-3 text-xl font-medium">
          {translation.metrics["last-activity"][lang]}
        </div>
        <ActivityList />
      </div>
    </>
  );
}
