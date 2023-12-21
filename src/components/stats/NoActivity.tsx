import InformationBell from "@/icons/InformationBell";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export default function NoActivity() {
  const { lang } = useSettingsModalStore();

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full text-sm dark:text-white light:text-neutral-950 h-28">
        <InformationBell />
        <div className="font-thin">
          {translation.metrics["no-activity-found"][lang]}
        </div>
        <div className="italic font-light">
          {translation.metrics["no-activity-to-display"][lang]}
        </div>
      </div>
    </>
  );
}
