import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export default function TableHeader() {
  const { settings } = useSettingsModalStore();
  return (
    <>
      <div className="table-header-group h-10 mb-10 text-sm font-medium border-b border-zinc-900 text-zinc-300 bg-zinc-900">
        <div className="table-row">
          <div className="table-cell w-20 text-center align-middle">
            {translation.cubes.table["favorite"][settings.locale[0].lang]}
          </div>
          <div className="table-cell text-left align-middle">
            {translation.cubes.table["cube"][settings.locale[0].lang]}
          </div>
          <div className="table-cell text-center align-middle">
            {translation.cubes.table["category"][settings.locale[0].lang]}
          </div>
          <div className="table-cell text-center align-middle">
            {translation.cubes.table["solves"][settings.locale[0].lang]}
          </div>
          <div className="hidden text-center align-middle  md:table-cell">
            {translation.cubes.table["created-at"][settings.locale[0].lang]}
          </div>
          <div className="hidden text-center align-middle md:table-cell">
            {translation.cubes.table["status"][settings.locale[0].lang]}
          </div>
          <div className="table-cell w-10 text-center align-middle sm:w-20"></div>
        </div>
      </div>
    </>
  );
}
