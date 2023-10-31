import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";

export function ScrambleZone() {
  const { selectedCube, scramble } = useTimerStore();
  const { lang, settings } = useSettingsModalStore();
  return (
    <>
      <div
        id="touch"
        className={
          settings.features.scrambleBackground.status
            ? "h-auto p-2 overflow-auto text-2xl font-medium text-center rounded-md min-w-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg max-h-52 dark:bg-zinc-900 light:bg-neutral-100"
            : "h-auto p-2 overflow-auto text-2xl font-medium text-center rounded-md min-w-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg max-h-52"
        }
      >
        {selectedCube ? scramble : translation.timer["empty-scramble"][lang]}
      </div>
    </>
  );
}
